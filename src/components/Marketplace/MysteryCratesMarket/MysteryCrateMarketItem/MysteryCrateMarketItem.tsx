import { Box } from "@mui/material"
import { useMemo } from "react"
import { ClipThing } from "../../.."
import { SafePNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { consolidateMarketItemDeets, numFormatter } from "../../../../helpers"
import { MARKETPLACE_TABS } from "../../../../pages"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { Pricing } from "../../Common/MarketItem/Pricing"
import { SellerInfo } from "../../Common/MarketItem/SellerInfo"
import { Thumbnail } from "../../Common/MarketItem/Thumbnail"
import { Timeframe } from "../../Common/MarketItem/Timeframe"
import { ViewButton } from "../../Common/MarketItem/ViewButton"
import { MysteryCrateInfo } from "./MysteryCrateInfo"

interface MysteryCratesMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const MysteryCrateMarketItem = ({ item, isGridView }: MysteryCratesMarketItemProps) => {
    const theme = useTheme()

    const marketItemDeets = useMemo(() => consolidateMarketItemDeets(item, theme), [item, theme])
    const formattedPrice = useMemo(() => numFormatter(marketItemDeets.price.toNumber()), [marketItemDeets.price])

    const { id, end_at, owner, mystery_crate, collection_item } = item

    if (!mystery_crate || !collection_item || !owner) return null

    const { username, gid } = owner
    const { label, description } = mystery_crate
    const { image_url, animation_url } = collection_item

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            <ClipThing
                clipSize="7px"
                border={{
                    isFancy: !isGridView,
                    borderColor: marketItemDeets.primaryColor,
                    borderThickness: ".25rem",
                }}
                opacity={0.7}
                backgroundColor={marketItemDeets.backgroundColor}
            >
                <Box
                    sx={{
                        position: "relative",
                        p: isGridView ? "1.2rem 1.3rem" : ".8rem 1rem",
                        display: isGridView ? "block" : "grid",
                        gridTemplateRows: "7rem",
                        gridTemplateColumns: "8rem minmax(auto, 30rem) 1.5fr repeat(2, 1fr) min-content",
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
                    <Thumbnail isGridView={isGridView} imageUrl={image_url || SafePNG} animationUrl={animation_url} />
                    <MysteryCrateInfo isGridView={isGridView} label={label} description={description} />
                    <SellerInfo isGridView={isGridView} username={username} gid={gid} />
                    <Timeframe isGridView={isGridView} endAt={end_at} />
                    <Pricing isGridView={isGridView} formattedPrice={formattedPrice} priceLabel={marketItemDeets.priceLabel} />
                    <ViewButton
                        isGridView={isGridView}
                        primaryColor={marketItemDeets.primaryColor}
                        secondaryColor={marketItemDeets.secondaryColor}
                        listingTypeLabel={marketItemDeets.listingTypeLabel}
                        ctaLabel={marketItemDeets.ctaLabel}
                        icon={<marketItemDeets.Icon size="1.9rem" fill={marketItemDeets.secondaryColor} />}
                        to={`/marketplace/${MARKETPLACE_TABS.MysteryCrates}/${id}${location.hash}`}
                    />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(to top, #FFFFFF10, ${marketItemDeets.backgroundColor}80)`,
                        zIndex: -1,
                    }}
                />
            </ClipThing>
        </Box>
    )
}
