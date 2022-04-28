import { Box, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useState } from "react"
import { SupBackground } from "../../assets"
import { DEV_ONLY, STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useStream } from "../../containers"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { Music } from "../Music/Music"
import { Trailer } from "./Trailer"

export const Stream = () => {
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
    const { iframeDimensions } = useDimension()
    const { currentStream, isMute, vidRefCallback } = useStream()
    const { isOpen } = useTour()

    if (!watchedTrailer) {
        return <Trailer watchedTrailer={watchedTrailer} setWatchedTrailer={setWatchedTrailer} />
    }

    if (isOpen) return null

    return (
        <>
            <Stack sx={{ width: "100%", height: "100%", zIndex: siteZIndex.Stream }}>
                <video
                    key={currentStream?.stream_id}
                    id={"remoteVideo"}
                    muted={isMute}
                    ref={vidRefCallback}
                    autoPlay
                    controls={false}
                    playsInline
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        aspectRatio: STREAM_ASPECT_RATIO_W_H.toString(),
                        width: iframeDimensions.width,
                        height: iframeDimensions.height,
                        zIndex: siteZIndex.Stream,
                        background: currentStream?.stream_id ? `center url(${SupBackground}) ${colors.darkNavy}` : "unset",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                />
            </Stack>

            <NoStreamScreen />
            {DEV_ONLY && <Music />}
        </>
    )
}

// Shows a generic poster and checks wallet for sups, and toggle have sups
const NoStreamScreen = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: `center url(${SupBackground})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: siteZIndex.Stream - 1,
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
                    variant="h1"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        WebkitTextStrokeWidth: "2px",
                        "@media (max-width:1440px)": {
                            fontSize: "5vw",
                        },
                        "@media (max-width:800px)": {
                            fontSize: "6vmin",
                        },
                    }}
                >
                    Battle Arena
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        WebkitTextStrokeWidth: "1px",
                        "@media (max-width:1440px)": {
                            fontSize: "4vw",
                        },
                        "@media (max-width:800px)": {
                            fontSize: "5vmin",
                        },
                    }}
                >
                    Powered by <span style={{ color: colors.yellow, fontFamily: "inherit" }}>$SUPS</span>
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
