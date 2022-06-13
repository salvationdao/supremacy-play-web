import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import { ReactNode, useMemo } from "react"
import { useHistory } from "react-router-dom"
import { FancyButton } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { numFormatter, timeDiff } from "../../../../helpers"
import { MARKETPLACE_TABS } from "../../../../pages"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { AuctionPrice } from "../../Common/MarketItem/AuctionPrice"
import { BuyoutPrice } from "../../Common/MarketItem/BuyoutPrice"
import { SellerInfo } from "../../Common/MarketItem/SellerInfo"
import { Thumbnail } from "../../Common/MarketItem/Thumbnail"
import { Timeframe } from "../../Common/MarketItem/Timeframe"

interface MarketItemProps {
    imageUrl: string
    animationUrl?: string
    backgroundImageUrl?: string
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
    children: ReactNode
    linkSubPath: MARKETPLACE_TABS
}

export const MarketItem = ({ imageUrl, animationUrl, backgroundImageUrl, item, isGridView, children, linkSubPath }: MarketItemProps) => {
    const history = useHistory()
    const theme = useTheme()

    const formattedBuyoutPrice = useMemo(() => {
        if (!item.buyout_price) return ""
        let buyoutPrice = new BigNumber(item.buyout_price).shiftedBy(-18)
        const dropPrice = new BigNumber(item.dutch_auction_drop_rate).shiftedBy(-18)
        if (item.dutch_auction_drop_rate) {
            buyoutPrice = buyoutPrice.minus(dropPrice.multipliedBy(timeDiff(item.created_at, new Date()).minutes))
        }
        return numFormatter(buyoutPrice.toNumber())
    }, [item.buyout_price, item.created_at, item.dutch_auction_drop_rate])
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
    const backgroundColor = theme.factionTheme.background

    const { id, end_at, owner, total_bids } = item

    if (!owner) return null

    const { username, gid } = owner

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <FancyButton
                excludeCaret
                clipThingsProps={{
                    clipSize: "7px",
                    clipSlantSize: "0px",
                    corners: {
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    },
                    backgroundColor: backgroundColor,
                    opacity: 0.7,
                    border: { isFancy: !isGridView, borderColor: primaryColor, borderThickness: ".25rem" },
                    sx: { position: "relative" },
                }}
                sx={{ color: primaryColor, textAlign: "start" }}
                onClick={() => history.push(`/marketplace/${linkSubPath}/${id}${location.hash}`)}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: isGridView ? ".5rem .6rem" : ".1rem .3rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: "8rem minmax(auto, 38rem) 1.5fr repeat(3, 1fr)",
                        gap: "1.6rem",
                        ...(isGridView
                            ? {
                                  "&>*:not(:last-child)": {
                                      mb: ".8rem",
                                  },
                              }
                            : {}),
                    }}
                >
                    <Thumbnail isGridView={isGridView} imageUrl={imageUrl} animationUrl={animationUrl} />
                    {children}
                    <SellerInfo isGridView={isGridView} username={username} gid={gid} />
                    <Timeframe isGridView={isGridView} endAt={end_at} />
                    <BuyoutPrice isGridView={isGridView} formattedPrice={formattedBuyoutPrice} formattedDropPrice={formattedDropPrice} />
                    <AuctionPrice isGridView={isGridView} formattedPrice={formattedAuctionPrice} totalBids={total_bids} />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `url(${backgroundImageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top",
                        backgroundSize: "cover",
                        opacity: 0.08,
                        zIndex: -2,
                    }}
                />

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
}
