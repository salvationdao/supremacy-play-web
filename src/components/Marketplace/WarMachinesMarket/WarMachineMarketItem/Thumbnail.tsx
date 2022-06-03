import { Box, Stack, CircularProgress } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"

export const Thumbnail = ({ isGridView, avatarUrl }: { isGridView: boolean; avatarUrl: string }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: primaryColor,
                borderThickness: avatarUrl ? "0" : ".15rem",
            }}
            corners={{
                topRight: isGridView,
                topLeft: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%", position: "relative", boxShadow: "1px 2px 3px rgba(0,0,0,.5)" }}
        >
            <Box
                sx={{
                    height: isGridView ? "15rem" : "100%",
                    width: "100%",
                    overflow: "hidden",
                    background: `url(${avatarUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
                {!avatarUrl && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <CircularProgress size="2.2rem" sx={{ color: primaryColor }} />
                    </Stack>
                )}
            </Box>
        </ClipThing>
    )
}
