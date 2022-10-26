import { Box, Stack, Typography } from "@mui/material"
import { SupBackground } from "../../../../assets"
import { useUI } from "../../../../containers"
import { colors, fonts, siteZIndex } from "../../../../theme/theme"

export const NoStreamScreen = () => {
    const { isStreamBigDisplay } = useUI()

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                background: `center url(${SupBackground})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: siteZIndex.Stream + 1,
            }}
        >
            <Stack
                sx={{
                    position: "relative",
                    alignItems: "center",
                    textAlign: "center",
                    WebkitTextStrokeColor: "black",
                    textShadow: "1px 3px black",
                    zIndex: 2,
                }}
            >
                <Typography
                    variant={isStreamBigDisplay ? "h1" : "h5"}
                    sx={{ fontFamily: fonts.nostromoHeavy, WebkitTextStrokeWidth: isStreamBigDisplay ? "2px" : "unset" }}
                >
                    Battle Arena
                </Typography>

                <Typography
                    variant={isStreamBigDisplay ? "h3" : "body2"}
                    sx={{ fontFamily: fonts.nostromoBlack, WebkitTextStrokeWidth: isStreamBigDisplay ? "1px" : "unset" }}
                >
                    Powered by <span style={{ color: colors.yellow }}>$SUPS</span>
                </Typography>
            </Stack>

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(5,12,18,0.4)",
                    zIndex: 1,
                }}
            />
        </Box>
    )
}
