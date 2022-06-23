import { Stack } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useSnackbar, useStream } from "../../containers"
import { parseString } from "../../helpers"
import { siteZIndex } from "../../theme/theme"
import { StreamService } from "../../types"

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        SLDP?: any
    }
}

export const SLPDStream = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { iframeDimensions } = useDimension()
    const { isMute, volume, currentStream, setCurrentPlayingStreamHost } = useStream()
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sldpPlayer = useRef<any>()
    const vidRef = useRef<HTMLVideoElement>()

    useEffect(() => {
        if (window.SLDP) return
        // Load the Softvelum SLDP HTML playback script
        const script = document.createElement("script")
        script.src = "https://softvelum.com/player/releases/sldp-v2.20.0.min.js"
        script.type = "text/javascript"
        script.async = true
        script.onload = () => setIsScriptLoaded(true)
        document.body.appendChild(script)
    }, [])

    useEffect(() => {
        // Script not loaded or SLDP player not already set up
        if (!isScriptLoaded || sldpPlayer.current || vidRef.current || !window.SLDP || !currentStream || currentStream.service !== StreamService.Softvelum)
            return
        sldpPlayer.current = window.SLDP.init({
            container: "sldp_player_wrapper",
            stream_url: currentStream.url,
            autoplay: true,
            controls: false,
            muted: isMute,
        })

        const videoEl = document.getElementById("sldp_player_wrapper")?.getElementsByTagName("video")
        if (videoEl && videoEl.length > 0) {
            vidRef.current = videoEl[0]
            vidRef.current.volume = parseString(localStorage.getItem("streamVolume"), 0.3)
            setCurrentPlayingStreamHost(currentStream.host)
        } else {
            newSnackbarMessage("Failed to initialize stream.", "error")
        }

        return () => sldpPlayer.current && sldpPlayer.current.destroy()
    }, [isScriptLoaded, currentStream, newSnackbarMessage, isMute, setCurrentPlayingStreamHost])

    useEffect(() => {
        if (volume <= 0) return
        if (vidRef && vidRef.current) vidRef.current.volume = volume
    }, [volume])

    useEffect(() => {
        if (vidRef && vidRef.current) vidRef.current.muted = isMute
    }, [isMute])

    return (
        <Stack
            key={currentStream?.stream_id}
            sx={{
                width: "100%",
                height: "100%",
                zIndex: siteZIndex.Stream,
                div: {
                    display: "block",
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
                    pb: "0 !important",
                },
            }}
        >
            <div id="sldp_player_wrapper"></div>
        </Stack>
    )
}
