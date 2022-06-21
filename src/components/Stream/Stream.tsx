import { Box, Stack, Typography } from "@mui/material"
import { useTour } from "@reactour/tour"
import OvenPlayer from "ovenplayer"
import { useEffect } from "react"
import { SupBackground } from "../../assets"
import { DEV_ONLY, STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useStream } from "../../containers"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { Stream as StreamType, StreamService } from "../../types"
import { Music } from "../Music/Music"

export const Stream = () => {
    const { iframeDimensions } = useDimension()
    const { currentStream, isMute, streamResolutions, vidRefCallback } = useStream()
    const { isOpen } = useTour()

    if (isOpen) return null
    const isPlaying = streamResolutions && streamResolutions.length > 0

    return (
        <>
            {currentStream?.service === StreamService.OvenMediaEngine ? (
                <OutputPlayerOven stream={currentStream} iframeDimensions={iframeDimensions} />
            ) : (
                <Stack sx={{ width: "100%", height: "100%", zIndex: siteZIndex.Stream }}>
                    {!isPlaying && <NoStreamScreen />}

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
                            background: isPlaying ? "unset" : `center url(${SupBackground}) ${colors.darkNavy} cover no-repeat`,
                        }}
                    />
                </Stack>
            )}

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

// Ovenplayer
interface OvenPlayerSource {
    type: "webrtc" | "llhls" | "hls" | "lldash" | "dash" | "mp4"
    file: string
    label?: string
    framerate?: number
    sectionStart?: number
    sectionEnd?: number
}

const OutputPlayerOven = ({
    iframeDimensions,
    stream,
}: {
    stream: StreamType
    iframeDimensions: {
        width: string | number
        height: string | number
    }
}) => {
    // Load oven player
    useEffect(() => {
        if (document.getElementById("oven-player")) {
            // Load oven player
            const source: OvenPlayerSource = {
                label: stream.name,
                type: "webrtc",
                file: stream.url,
            }

            const ovenPlayer = OvenPlayer.create("oven-player", {
                autoStart: true,
                controls: false,
                mute: false,
                sources: [source],
                autoFallback: true,
            })

            ovenPlayer.on("ready", () => {
                console.log("ovenplayer ready")
            })

            ovenPlayer.on("error", (e: Error) => {
                console.error("ovenplayer error: ", e)
            })
        }
    }, [stream.name, stream.url])

    return (
        <Stack
            sx={{
                width: "100%",
                height: "100%",
                zIndex: siteZIndex.Stream,
                div: {
                    height: "100% !important",
                },
                video: {
                    position: "absolute !important",
                    top: "50% !important",
                    left: "50% !important",
                    transform: "translate(-50%, -50%) !important",
                    aspectRatio: `${STREAM_ASPECT_RATIO_W_H.toString()} !important`,
                    width: `${iframeDimensions.width}${iframeDimensions.width == "unset" ? "" : "px "} !important`,
                    height: `${iframeDimensions.height}${iframeDimensions.height == "unset" ? "" : "px "} !important`,
                    zIndex: siteZIndex.Stream,
                },
                ".op-ui": {
                    display: "none !important",
                },
                ".op-ratio": {
                    paddingBottom: "0 !important",
                },
            }}
        >
            <div id="oven-player" />
        </Stack>
    )
}
