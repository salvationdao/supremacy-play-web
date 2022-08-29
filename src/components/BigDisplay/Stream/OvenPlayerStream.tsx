import { Stack } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useEffect } from "react"
import { useGlobalNotifications } from "../../../containers"
import { OvenPlayerSource, useOvenStream } from "../../../containers/oven"
import { parseString } from "../../../helpers"
import { siteZIndex } from "../../../theme/theme"

export const OvenplayerStream = () => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { currentOvenStream, isEnlarged, ovenPlayer, isMute, setSelectedOvenResolution } = useOvenStream()

    // Load the stream when its changed
    useEffect(() => {
        if (document.getElementById("oven-player")) {
            // if already setup, then return
            if (!currentOvenStream) return

            if (ovenPlayer.current) {
                ovenPlayer.current = undefined
                return
            }

            // build sources with different resolutions
            let _sources: OvenPlayerSource[] = currentOvenStream.available_resolutions.map((ovs) => {
                const isDefault = ovs === currentOvenStream.default_resolution
                const streamURL = isDefault ? currentOvenStream.base_url : `${currentOvenStream.base_url}_${ovs}`
                return {
                    label: ovs,
                    type: "webrtc",
                    file: streamURL,
                    resolution: ovs,
                }
            })

            const prevRes = localStorage.getItem(`${currentOvenStream.name}-resolution`) || "720"
            const prevSource = _sources.find((s) => s.label === prevRes)
            if (prevSource) _sources = [prevSource, ..._sources]
            setSelectedOvenResolution(_sources[0].label)

            const newOvenPlayer = OvenPlayer.create("oven-player", {
                autoStart: true,
                controls: false,
                mute: isMute,
                volume: parseString(localStorage.getItem("streamVolume"), 0.3) * 100,
                sources: _sources,
                autoFallback: true,
                disableSeekUI: true,
            })

            newOvenPlayer.on("ready", () => {
                console.log("OvenPlayer Ready.")
            })

            newOvenPlayer.on("error", (err: Error) => {
                newSnackbarMessage(err.message, "error")
                console.error("ovenplayer error: ", err)
            })

            newOvenPlayer.play()
            ovenPlayer.current = newOvenPlayer

            return () => {
                newOvenPlayer.off("ready")
                newOvenPlayer.off("error")
                newOvenPlayer.remove()
                ovenPlayer.current = undefined
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOvenStream])

    return (
        <Stack
            key={currentOvenStream?.name}
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                zIndex: siteZIndex.Stream,
                div: {
                    height: "100% !important",
                },
                pointerEvents: "none",
                video: {
                    position: "absolute !important",
                    width: "100% !important",
                    height: "100% !important",
                    objectFit: `${isEnlarged ? "cover" : "contain"} !important`,
                    objectPosition: "50% 42% !important",
                    zIndex: siteZIndex.Stream,
                },
                ".op-ui": {
                    display: "none !important",
                },
                ".op-ratio": {
                    pb: "0 !important",
                },
            }}
        >
            <div id="oven-player" />
        </Stack>
    )
}
