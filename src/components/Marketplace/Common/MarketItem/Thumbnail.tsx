import { Box, Stack, CircularProgress } from "@mui/material"
import { ClipThing } from "../../.."
import { useTheme } from "../../../../containers/theme"

export const Thumbnail = ({ isGridView, imageUrl, animationUrl }: { isGridView: boolean; imageUrl: string; animationUrl?: string }) => {
    const theme = useTheme()
    const primaryColor = theme.factionTheme.primary

    return (
        <ClipThing
            clipSize="8px"
            border={{
                borderColor: primaryColor,
                borderThickness: imageUrl ? "0" : ".15rem",
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
                key={imageUrl}
                component="video"
                sx={{
                    height: isGridView ? "15rem" : "100%",
                    width: "100%",
                    overflow: "hidden",
                    objectFit: "cover",
                    objectPosition: "center",
                    border: "#FFFFFF18 1px solid",
                    borderRadius: 1,
                    boxShadow: "inset 0 0 12px 6px #00000040",
                    background: `radial-gradient(#FFFFFF20 10px, #00000080)`,
                }}
                loop
                muted
                autoPlay
                poster={`${imageUrl}`}
            >
                <source src={animationUrl} type="video/mp4" />
            </Box>

            {/* <Box
                sx={{
                    height: isGridView ? "15rem" : "100%",
                    width: "100%",
                    overflow: "hidden",
                    background: `url(${imageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            /> */}
        </ClipThing>
    )
}
