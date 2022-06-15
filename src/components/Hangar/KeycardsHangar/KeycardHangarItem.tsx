import { Box, Stack, Typography } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { FancyButton } from "../.."
import { useTheme } from "../../../containers/theme"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { Keycard } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"

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
    const history = useHistory()
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
                            px: ".8rem",
                            py: "2rem",
                            borderRadius: 1,
                            height: "20rem",
                            boxShadow: "inset 0 0 12px 6px #00000040",
                            background: `radial-gradient(#FFFFFF20 10px, ${backgroundColor})`,
                            border: "#00000060 1px solid",
                        }}
                    >
                        <Box
                            component="video"
                            sx={{
                                height: "100%",
                                width: "100%",
                                overflow: "hidden",
                                objectFit: "contain",
                                objectPosition: "center",
                                borderRadius: 1,
                            }}
                            loop
                            muted
                            autoPlay
                            poster={`${keycard.blueprints.image_url}`}
                        >
                            {keycard.blueprints.animation_url && <source src={keycard.blueprints.animation_url} type="video/mp4" />}
                            {keycard.blueprints.card_animation_url && <source src={keycard.blueprints.animation_url} type="video/mp4" />}
                        </Box>

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
                                excludeCaret
                                onClick={() => {
                                    if (itemSaleID) {
                                        history.push(`/marketplace/${MARKETPLACE_TABS.Keycards}/${itemSaleID}${location.hash}`)
                                    } else {
                                        history.push(`/marketplace/sell?item-type=${ItemType.Keycards}&asset-id=${keycard.id}${location.hash}`)
                                    }
                                }}
                                clipThingsProps={{
                                    clipSize: "5px",
                                    backgroundColor: colors.red,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.red, borderThickness: "1.5px" },
                                    sx: { position: "relative", mt: "1rem", width: "100%" },
                                }}
                                sx={{ px: "1.6rem", py: ".6rem" }}
                            >
                                <Typography variant={"caption"} sx={{ fontFamily: fonts.nostromoBlack }}>
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
