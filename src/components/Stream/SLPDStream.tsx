import { Stack } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { useSnackbar, useStream } from "../../containers"
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
    const { isMute, volume, currentStream, setCurrentPlayingStreamHost, setResolutions, setSelectedResolution, selectedResolution, currentPlayingStreamHost } =
        useStream()
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sldpPlayer = useRef<any>()
    const vidRef = useRef<HTMLVideoElement>()

    useEffect(() => {
        if (window.SLDP) return setIsScriptLoaded(true)
        // Load the Softvelum SLDP HTML playback script
        const script = document.createElement("script")
        script.src = "https://softvelum.com/player/releases/sldp-v2.20.0.min.js"
        script.type = "text/javascript"
        script.async = true
        script.onload = () => setIsScriptLoaded(true)
        document.body.appendChild(script)
    }, [setResolutions, setSelectedResolution])

    const cleanUpStream = useCallback(() => {
        sldpPlayer.current && sldpPlayer.current.destroy()
        vidRef.current = undefined
        sldpPlayer.current = undefined
    }, [])

    useEffect(() => {
        // Script not loaded or SLDP player not already set up
        if (!isScriptLoaded || !window.SLDP || !currentStream || currentStream.service !== StreamService.Softvelum) return

        const streamUrl = `${currentStream.url}${selectedResolution ? `_${selectedResolution}p` : ""}`
        cleanUpStream()
        sldpPlayer.current = window.SLDP.init({
            container: "sldp_player_wrapper",
            // If user has selected a resolution
            stream_url: streamUrl,
            autoplay: true,
            controls: false,
            muted: isMute,
        })

        const videoEl = document.getElementById("sldp_player_wrapper")?.getElementsByTagName("video")
        if (videoEl && videoEl.length > 0) {
            vidRef.current = videoEl[0]
            vidRef.current.volume = parseString(localStorage.getItem("streamVolume"), 0.3)
            setCurrentPlayingStreamHost(currentStream.host)

            // Hard-coded resolutions for SLDP
            setResolutions((prev) => {
                if (!prev || prev.length <= 0) {
                    const resolutions = [1080, 720, 480, 360, 240]
                    const prevResolution = parseInt(localStorage.getItem(`${currentStream.host}-resolution`) || "0")
                    if (prevResolution && prevResolution in resolutions) {
                        setSelectedResolution(prevResolution)
                    } else {
                        setSelectedResolution(Math.max.apply(null, resolutions))
                    }
                    return resolutions
                }
                return prev
            })
        } else {
            newSnackbarMessage("Failed to initialize stream.", "error")
        }

        return () => cleanUpStream()
        // Can't have isMute as deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        cleanUpStream,
        currentStream,
        isScriptLoaded,
        newSnackbarMessage,
        setCurrentPlayingStreamHost,
        setResolutions,
        setSelectedResolution,
        selectedResolution,
        currentPlayingStreamHost,
    ])

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
                position: "relative",
                width: "100%",
                height: "100%",
                zIndex: siteZIndex.Stream,
                div: {
                    display: "block",
                    height: "100% !important",
                },
                video: {
                    position: "absolute !important",
                    width: "100% !important",
                    height: "100% !important",
                    objectFit: "cover !important",
                    objectPosition: "center !important",
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
