import { Box } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { MarketplaceBuyItem } from "../../../../types/marketplace"
import { KeycardInfo } from "./KeycardInfo"
import { Pricing } from "./Pricing"
import { SellerInfo } from "./SellerInfo"
import { Thumbnail } from "./Thumbnail"
import { Timeframe } from "./Timeframe"
import { ViewButton } from "./ViewButton"

interface KeycardMarketItemProps {
    item: MarketplaceBuyItem
    isGridView: boolean
}

export const KeycardMarketItem = ({ item, isGridView }: KeycardMarketItemProps) => {
    const theme = useTheme()

    const { id, end_at, owner, keycard } = item

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
                    <Thumbnail isGridView={isGridView} imageUrl={image_url} animationUrl={animation_url} />
                    <KeycardInfo isGridView={isGridView} label={label} description={description} />
                    <SellerInfo isGridView={isGridView} username={username} gid={gid} />
                    <Timeframe isGridView={isGridView} endAt={end_at} />
                    <Pricing isGridView={isGridView} marketItem={item} />
                    <ViewButton isGridView={isGridView} id={id} />
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
