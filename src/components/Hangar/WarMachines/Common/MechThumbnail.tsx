import { Box, CircularProgress, Stack } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"
import { MechBasic, MechDetails } from "../../../../types"

export const MechThumbnail = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    const theme = useTheme()

    const primaryColor = theme.factionTheme.primary
    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: primaryColor,
                borderThickness: mechDetails ? "0" : ".15rem",
            }}
            backgroundColor={theme.factionTheme.background}
        >
            <Box
                sx={{
                    height: "100%",
                    width: "16.8rem",
                    overflow: "hidden",
                    background: `url(${skin?.avatar_url || skin?.image_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                    backgroundSize: "cover",
                }}
            >
                {!mechDetails && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                    </Stack>
                )}
            </Box>
        </ClipThing>
    )
}
