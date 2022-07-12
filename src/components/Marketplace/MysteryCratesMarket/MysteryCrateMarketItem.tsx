import { Stack, Typography } from "@mui/material"
import { SafePNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { MARKETPLACE_TABS } from "../../../pages"
import { fonts } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface MysteryCratesMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const MysteryCrateMarketItem = ({ item, isGridView }: MysteryCratesMarketItemProps) => {
    const { mystery_crate, collection_item } = item

    if (!mystery_crate || !collection_item) return null

    const { label, description } = mystery_crate
    const { image_url, avatar_url, large_image_url, animation_url, card_animation_url } = collection_item

    return (
        <MarketItem
            item={item}
            imageUrl={image_url || large_image_url || avatar_url || SafePNG}
            animationUrl={animation_url}
            cardAnimationUrl={card_animation_url}
            isGridView={isGridView}
            linkSubPath={MARKETPLACE_TABS.MysteryCrates}
        >
            <MysteryCrateInfo isGridView={isGridView} label={label} description={description} />
        </MarketItem>
    )
}

const MysteryCrateInfo = ({ isGridView, label, description }: { isGridView: boolean; label: string; description: string }) => {
    const theme = useTheme()

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: theme.factionTheme.primary,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {description}
            </Typography>
        </Stack>
    )
}
