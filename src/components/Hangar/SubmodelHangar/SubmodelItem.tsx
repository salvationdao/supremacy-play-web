import { Box, Stack, Typography } from "@mui/material"
import { FancyButton } from "../.."
import { IS_TESTING_MODE } from "../../../constants"
import { useTheme } from "../../../containers/theme"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { Keycard, MechSkin, Submodel, WeaponSkin } from "../../../types"
import { ItemType } from "../../../types/marketplace"
import { ClipThing } from "../../Common/ClipThing"
import { MediaPreview } from "../../Common/MediaPreview/MediaPreview"

interface SubmodelItemProps {
    submodel: Submodel
    isGridView: boolean
}

export const SubmodelItem = ({ submodel, isGridView }: SubmodelItemProps) => {
    return <>{submodel && <KeycardHangarItemInner submodel={submodel} isGridView={isGridView} />}</>
}

export const KeycardHangarItemInner = ({ submodel, isGridView }: SubmodelItemProps) => {
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
                        <MediaPreview imageUrl={submodel.image_url ?? ""} videoUrls={[submodel.animation_url, submodel.card_animation_url]} />
                    </Box>

                    <Stack spacing=".4rem" sx={{ flex: 1, px: ".4rem", py: ".3rem" }}>
                        <Typography variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                            {submodel.label}
                        </Typography>
                    </Stack>
                </Stack>
            </ClipThing>
        </Box>
    )
}
