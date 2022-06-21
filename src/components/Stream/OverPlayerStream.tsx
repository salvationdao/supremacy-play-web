import { Stack } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useEffect } from "react"
import { STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useStream } from "../../containers"
import { siteZIndex } from "../../theme/theme"

interface OvenPlayerSource {
    type: "webrtc" | "llhls" | "hls" | "lldash" | "dash" | "mp4"
    file?: string
    label?: string
    framerate?: number
    sectionStart?: number
    sectionEnd?: number
}

export const OverPlayerStream = () => {
    const { iframeDimensions } = useDimension()
    const {
        isMute,
        volume,
        resolutions,
        currentStream,
        currentPlayingStreamHost,
        setCurrentPlayingStreamHost,
        selectedResolution,
        setResolutions,
        setSelectedResolution,
    } = useStream()

    // Load oven player
    useEffect(() => {
        if (document.getElementById("oven-player")) {
            // Load oven player
            const source: OvenPlayerSource = {
                label: currentStream?.name,
                type: "webrtc",
                file: currentStream?.url,
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
    }, [currentStream?.name, currentStream?.url])

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
