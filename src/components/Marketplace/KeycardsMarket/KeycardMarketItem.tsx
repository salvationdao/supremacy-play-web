import { Stack, Typography } from "@mui/material"
import { useTheme } from "../../../containers/theme"
import { MARKETPLACE_TABS } from "../../../pages"
import { fonts } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface KeycardMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const KeycardMarketItem = ({ item, isGridView }: KeycardMarketItemProps) => {
    const { keycard } = item

    if (!keycard) return null

    const { label, image_url, animation_url, card_animation_url, description } = keycard

    return (
        <MarketItem
            item={item}
            imageUrl={image_url}
            animationUrl={animation_url}
            cardAnimationUrl={card_animation_url}
            isGridView={isGridView}
            linkSubPath={MARKETPLACE_TABS.Keycards}
        >
            <KeycardInfo isGridView={isGridView} label={label} description={description} />
        </MarketItem>
    )
}

const KeycardInfo = ({ isGridView, label, description }: { isGridView: boolean; label: string; description: string }) => {
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
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
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
