import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { getRarityDeets } from "../../../../helpers"
import { fonts } from "../../../../theme/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechThumbnail = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary
    const rarityDeets = useMemo(() => getRarityDeets(mech.tier || mechDetails?.tier || ""), [mech, mechDetails])
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const imageUrl = skin?.avatar_url || skin?.image_url || mech.avatar_url || mech.image_url

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: primaryColor,
                borderThickness: imageUrl ? "0" : ".15rem",
            }}
            backgroundColor={theme.factionTheme.background}
            sx={{ flex: 1, position: "relative" }}
        >
            <Typography
                sx={{
                    position: "absolute",
                    bottom: ".2rem",
                    left: ".2rem",
                    px: ".6rem",
                    py: ".3rem",
                    lineHeight: 1,
                    fontFamily: fonts.nostromoBlack,
                    color: rarityDeets.color,
                    backgroundColor: theme.factionTheme.background,
                }}
            >
                {rarityDeets.label}
            </Typography>

            <Box
                sx={{
                    height: "100%",
                    width: "16.8rem",
                    overflow: "hidden",
                    background: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                }}
            >
                {!imageUrl && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                    </Stack>
                )}
            </Box>
        </ClipThing>
    )
}
