import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor"
import { Stack } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { SupBackground } from "../../../assets"
import { useGlobalNotifications, useStream } from "../../../containers"
import { parseString } from "../../../helpers"
import { colors, siteZIndex } from "../../../theme/theme"
import { StreamService } from "../../../types"
import { NoStreamScreen } from "./NoStreamScreen"

interface StreamInfoEntry {
    audioBitrate: number
    streamHeight: number
    streamWidth: number
    videoBitrate: number
    videoCodec: string
}

interface WebRTCCallbackObj {
    command: string
    streamId: string
    streamInfo: {
        videoBitrate: number
        streamWidth: number
        streamHeight: number
        audioBitrate: number
        videoCodec: string
    }[]
}

interface WebRTCAdaptorType {
    websocket_url: string
    mediaConstraints: {
        video: boolean
        audio: boolean
    }
    sdp_constraints: {
        OfferToReceiveAudio: boolean
        OfferToReceiveVideo: boolean
    }
    remoteVideoId: string
    isPlayMode: boolean
    debug: boolean
    candidateTypes: string[]
    callback: (info: string, obj: WebRTCCallbackObj | null) => void
    callbackError: (error: string) => void

    forceStreamQuality: (stream_id: string, quality: number) => void
    play: (stream_id: string, token_id: string) => void
    getStreamInfo: (stream_id: string) => void
    closeWebSocket: (stream_id: string) => void
}

export const AntMediaStream = () => {
    const { newSnackbarMessage } = useGlobalNotifications()
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
        isEnlarged,
    } = useStream()
    const webRtc = useRef<WebRTCAdaptorType>()
    const vidRef = useRef<HTMLVideoElement>()

    useEffect(() => {
        if (volume <= 0) return
        if (vidRef && vidRef.current) vidRef.current.volume = volume
    }, [volume])

    // Clear the ws on unmount
    useEffect(() => {
        return () => {
            if (webRtc.current && currentStream) {
                webRtc.current?.closeWebSocket(currentStream.stream_id)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // When user selects a resolution, make the change into the stream
    useEffect(() => {
        if (
            webRtc?.current &&
            selectedResolution &&
            selectedResolution > 0 &&
            resolutions &&
            resolutions.length > 0 &&
            currentStream &&
            currentStream.host === currentPlayingStreamHost
        ) {
            try {
                webRtc.current.forceStreamQuality(currentStream.stream_id, selectedResolution)
            } catch (err) {
                console.error(err)
            }
        }
    }, [selectedResolution, currentStream, resolutions, currentPlayingStreamHost])

    const vidRefCallback = useCallback(
        (vid: HTMLVideoElement) => {
            if (!currentStream || !currentStream.url || currentStream.service !== StreamService.AntMedia || !currentStream.stream_id) return
            if (!vid || !vid.parentNode) {
                vidRef.current = undefined
                return
            }
            try {
                vidRef.current = vid
                vidRef.current.volume = parseString(localStorage.getItem("streamVolume"), 0.3)

                webRtc.current = new WebRTCAdaptor({
                    websocket_url: currentStream.url,
                    mediaConstraints: { video: false, audio: false },
                    sdp_constraints: {
                        OfferToReceiveAudio: true,
                        OfferToReceiveVideo: true,
                    },
                    remoteVideoId: "remoteVideo",
                    isPlayMode: true,
                    debug: false,
                    candidateTypes: ["tcp", "udp"],
                    callback: (info: string, obj: WebRTCCallbackObj) => {
                        if (info == "initialized") {
                            if (!webRtc || !webRtc.current || !webRtc.current.play) return
                            webRtc.current.play(currentStream.stream_id, "")
                        } else if (info == "play_started") {
                            if (!webRtc || !webRtc.current || !webRtc.current.getStreamInfo) return
                            webRtc.current.getStreamInfo(currentStream.stream_id)
                        } else if (info == "streamInformation") {
                            const resolutions: number[] = []
                            obj["streamInfo"].forEach((entry: StreamInfoEntry) => {
                                // get resolutions from server response and added to an array.
                                if (!resolutions.includes(entry["streamHeight"])) {
                                    resolutions.push(entry["streamHeight"])
                                }
                            })
                            setResolutions(resolutions)
                            const prevResolution = parseInt(localStorage.getItem(`${currentStream.host}-resolution`) || "0")
                            if (prevResolution && resolutions.includes(prevResolution)) {
                                setSelectedResolution(prevResolution)
                            } else {
                                setSelectedResolution(Math.max.apply(null, resolutions))
                            }
                            setCurrentPlayingStreamHost(currentStream.host)
                        } else if (info == "closed") {
                            webRtc.current = undefined
                            if (typeof obj != "undefined") {
                                console.debug("connection closed: " + JSON.stringify(obj))
                            }
                        }
                    },
                    callbackError: (e: string) => {
                        if (e === "no_stream_exist" || e === "WebSocketNotConnected") {
                            console.error("Failed to start stream:", e)
                            newSnackbarMessage("Failed to start stream.", "error")
                        }
                    },
                })
            } catch (e) {
                console.error(e)
                webRtc.current = undefined
            }
        },
        [currentStream, newSnackbarMessage, setCurrentPlayingStreamHost, setSelectedResolution, setResolutions],
    )

    const isPlaying = resolutions && resolutions.length > 0

    return (
        <Stack
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                zIndex: siteZIndex.Stream,
                pointerEvents: "none",
            }}
        >
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
                    width: "100%",
                    height: "100%",
                    objectFit: `${isEnlarged ? "cover" : "contain"}`,
                    objectPosition: "50% 42%",
                    zIndex: siteZIndex.Stream,
                    background: isPlaying ? "unset" : `center url(${SupBackground}) ${colors.darkNavy} cover no-repeat`,
                }}
            />
        </Stack>
    )
}
