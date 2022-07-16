import { Box, Stack, Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { Keycard } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"

interface MysteryCrateStoreItemProps {
    keycard: Keycard
    itemSaleID?: string
}

export const KeycardHangarItem = ({ keycard }: MysteryCrateStoreItemProps) => {
    return (
        <>
            {keycard.count > 0 && <KeycardHangarItemInner keycard={keycard} />}
            {keycard.item_sale_ids?.map((itemSaleID) => {
                return <KeycardHangarItemInner key={itemSaleID} keycard={keycard} itemSaleID={itemSaleID} />
            })}
        </>
    )
}

export const KeycardHangarItemInner = ({ keycard, itemSaleID }: MysteryCrateStoreItemProps) => {
    const location = useLocation()
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const backgroundColor = theme.factionTheme.background

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                transition: "all .15s",
                ":hover": {
                    transform: "translateY(-.4rem)",
                },
            }}
        >
            <ClipThing
                clipSize="12px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".2rem",
                }}
                opacity={0.9}
                backgroundColor={backgroundColor}
                sx={{ height: "100%" }}
            >
                <Stack spacing={"1.5rem"} justifyContent="center" sx={{ height: "100%", p: "1.5rem" }}>
                    <Box
                        sx={{
                            position: "relative",
                            height: "20rem",
                        }}
                    >
                        <MediaPreview
                            imageUrl={keycard.blueprints.image_url}
                            videoUrls={[keycard.blueprints.animation_url, keycard.blueprints.card_animation_url]}
                        />

                        {!itemSaleID && (
                            <Box sx={{ position: "absolute", top: ".6rem", right: ".8rem" }}>
                                <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                                    {keycard.count}x
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Stack spacing=".4rem" sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                        <Typography variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                            {keycard.blueprints.label}
                        </Typography>

                        <Typography variant="h6">{keycard.blueprints.description}</Typography>

                        <Stack alignItems="center" sx={{ mt: "auto !important", pt: ".8rem", alignSelf: "stretch" }}>
                            <FancyButton
                                to={
                                    itemSaleID
                                        ? `/marketplace/${MARKETPLACE_TABS.Keycards}/${itemSaleID}${location.hash}`
                                        : `/marketplace/sell?itemType=${ItemType.Keycards}&assetID=${keycard.id}${location.hash}`
                                }
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: itemSaleID ? backgroundColor : colors.red,
                                    opacity: 1,
                                    border: { isFancy: !itemSaleID, borderColor: colors.red, borderThickness: "1.5px" },
                                    sx: { position: "relative", mt: "1rem", width: "100%" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem", color: itemSaleID ? colors.red : "#FFFFFF" }}
                            >
                                <Typography variant={"caption"} sx={{ fontFamily: fonts.nostromoBlack, color: itemSaleID ? colors.red : "#FFFFFF" }}>
                                    {itemSaleID ? "VIEW LISTING" : "SELL ITEM"}
                                </Typography>
                            </FancyButton>
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}

export const KeycardCommonArea = ({ isGridView, label, description }: { isGridView: boolean; label: string; description: string }) => {
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
