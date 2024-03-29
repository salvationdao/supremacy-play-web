import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import React, { ReactNode, useMemo } from "react"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { calculateDutchAuctionCurrentPrice, numFormatter, shadeColor } from "../../../../helpers"
import { colors } from "../../../../theme/theme"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { AuctionPrice } from "../../Common/MarketItem/AuctionPrice"
import { BuyoutPrice } from "../../Common/MarketItem/BuyoutPrice"
import { Timeframe } from "../../Common/MarketItem/Timeframe"
import { SoldPrice } from "./SoldPrice"
import { UserInfo } from "./UserInfo"

interface MarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
    children: ReactNode
    linkSubPath: string
}

const propsAreEqual = (prevProps: MarketItemProps, nextProps: MarketItemProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.isGridView === nextProps.isGridView &&
        prevProps.linkSubPath === nextProps.linkSubPath &&
        prevProps.children === nextProps.children
    )
}

export const MarketItem = React.memo(function MarketItem({ item, isGridView, children, linkSubPath }: MarketItemProps) {
    const theme = useTheme()

    const formattedBuyoutPrice = useMemo(() => {
        if (!item.buyout_price) return ""
        let buyoutPrice = new BigNumber(item.buyout_price).shiftedBy(-18)
        const dropPrice = new BigNumber(item.dutch_auction_drop_rate).shiftedBy(-18)
        if (item.dutch_auction_drop_rate) {
            buyoutPrice = BigNumber.max(
                calculateDutchAuctionCurrentPrice({ createdAt: item.created_at, dropRate: dropPrice, startPrice: buyoutPrice }),
                new BigNumber(item.auction_reserved_price || 1000000000000000000).shiftedBy(-18),
            )
        }
        return numFormatter(buyoutPrice.toNumber())
    }, [item.auction_reserved_price, item.buyout_price, item.created_at, item.dutch_auction_drop_rate])
    const formattedAuctionPrice = useMemo(() => {
        if (!item.auction_current_price) return ""
        const auctionPrice = new BigNumber(item.auction_current_price).shiftedBy(-18)
        return numFormatter(auctionPrice.toNumber())
    }, [item.auction_current_price])
    const formattedDropPrice = useMemo(() => {
        if (!item.dutch_auction_drop_rate) return ""
        const dropPrice = new BigNumber(item.dutch_auction_drop_rate).shiftedBy(-18)
        return numFormatter(dropPrice.toNumber())
    }, [item.dutch_auction_drop_rate])

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.u800
    const soldBackgroundColor = useMemo(() => shadeColor(colors.marketSold, -95), [])

    const { id, end_at, owner, total_bids, sold_at, sold_for, sold_to } = item

    if (!owner) return null

    return (
        <Box sx={{ position: "relative", overflow: "visible", height: "100%" }}>
            <FancyButton
                disableRipple
                clipThingsProps={{
                    clipSize: "7px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: sold_at ? soldBackgroundColor : backgroundColor,
                    opacity: 0.9,
                    border: { isFancy: !isGridView, borderColor: sold_at ? `${colors.marketSold}50` : `${primaryColor}50`, borderThickness: ".25rem" },
                    sx: { position: "relative", height: "100%" },
                }}
                sx={{ color: primaryColor, textAlign: "start", height: "100%", ":hover": { opacity: 1 } }}
                to={`/marketplace/${linkSubPath}/${id}`}
            >
                <Box
                    sx={{
                        position: "relative",
                        height: "100%",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: `minmax(36rem, auto) 23rem repeat(3, 17rem)`, // hard-coded to have 6 columns, adjust as required
                        gap: "1.4rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: "1rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    {children}

                    <UserInfo isGridView={isGridView} marketUser={owner} title="SELLER" />

                    {sold_to && <UserInfo isGridView={isGridView} marketUser={sold_to} title="SOLD TO" />}

                    <Timeframe isGridView={isGridView} endAt={end_at} soldAt={sold_at} />

                    {sold_at && sold_for ? (
                        <SoldPrice isGridView={isGridView} soldFor={sold_for} />
                    ) : (
                        <>
                            <BuyoutPrice isGridView={isGridView} formattedPrice={formattedBuyoutPrice} formattedDropPrice={formattedDropPrice} />
                            <AuctionPrice isGridView={isGridView} formattedPrice={formattedAuctionPrice} totalBids={total_bids} />
                        </>
                    )}
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF08, ${backgroundColor}90)`,
                        zIndex: -1,
                    }}
                />
            </FancyButton>
        </Box>
    )
}, propsAreEqual)
