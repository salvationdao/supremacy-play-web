import { Box } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { MarketplaceBuyItem } from "../../../../types/marketplace"
import { KeycardInfo } from "./KeycardInfo"
import { Pricing } from "../../Common/MarketItem/Pricing"
import { Thumbnail } from "../../Common/MarketItem/Thumbnail"
import { SellerInfo } from "../../Common/MarketItem/SellerInfo"
import { Timeframe } from "../../Common/MarketItem/Timeframe"
import { ViewButton } from "../../Common/MarketItem/ViewButton"
import { useMemo } from "react"
import { numFormatter } from "../../../../helpers"
import BigNumber from "bignumber.js"
import { SvgWallet } from "../../../../assets"

interface KeycardMarketItemProps {
    item: MarketplaceBuyItem
    isGridView: boolean
}

export const KeycardMarketItem = ({ item, isGridView }: KeycardMarketItemProps) => {
    const theme = useTheme()

    const { id, end_at, owner, keycard, buyout_price } = item
    const formattedPrice = useMemo(() => numFormatter(new BigNumber(buyout_price).shiftedBy(-18).toNumber()), [buyout_price])

    if (!keycard || !owner) return null

    const { username, gid } = owner
    const { label, image_url, animation_url, description } = keycard

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="7px"
                border={{
                    isFancy: !isGridView,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".25rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: isGridView ? "1.2rem 1.3rem" : ".8rem 1rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: "8rem minmax(auto, 35rem) repeat(3, 1fr) min-content",
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
                    <Thumbnail isGridView={isGridView} imageUrl={image_url} animationUrl={animation_url} />
                    <KeycardInfo isGridView={isGridView} label={label} description={description} />
                    <SellerInfo isGridView={isGridView} username={username} gid={gid} />
                    <Timeframe isGridView={isGridView} endAt={end_at} />
                    <Pricing isGridView={isGridView} formattedPrice={formattedPrice} priceLabel="FIXED PRICE" />
                    <ViewButton
                        isGridView={isGridView}
                        id={id}
                        primaryColor={theme.factionTheme.primary}
                        secondaryColor={theme.factionTheme.secondary}
                        ctaLabel="BUY NOW"
                        icon={<SvgWallet size="1.9rem" fill={theme.factionTheme.secondary} />}
                    />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF10, ${theme.factionTheme.background}80)`,
                        zIndex: -1,
                    }}
                />
            </ClipThing>
        </Box>
    )
}
