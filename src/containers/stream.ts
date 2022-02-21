import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor"
import { useToggle } from "../hooks"
import { Stream } from "../types"

interface StreamInfoEntry {
    audioBitrate: number
    streamHeight: number
    streamWidth: number
    videoBitrate: number
    videoCodec: string
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
    callback: (info: string, obj: any) => void
    callbackError: (error: string) => void

    forceStreamQuality: (streamID: string, quality: number) => void
    play: (streamID: string, tokenID: string) => void
    getStreamInfo: (streamID: string) => void
    closeWebSocket: (streamID: string) => void
}

export interface StreamContainerType {
    webRtc: React.MutableRefObject<WebRTCAdaptorType | undefined>
    vidRef: React.MutableRefObject<HTMLVideoElement | undefined>
    vidRefCallback: (vid: HTMLVideoElement) => void
    currentStream: Stream | undefined
    setCurrentStream: React.Dispatch<React.SetStateAction<Stream | undefined>>
    selectedWsURL: string
    setSelectedWsURL: React.Dispatch<React.SetStateAction<string>>
    selectedStreamID: string
    setSelectedStreamID: React.Dispatch<React.SetStateAction<string>>
    streamResolutions: number[]
    setStreamResolutions: React.Dispatch<React.SetStateAction<number[]>>
    volume: number
    setVolume: React.Dispatch<React.SetStateAction<number>>
    isMute: boolean
    toggleIsMute: any
    currentResolution: number | undefined
    setCurrentResolution: React.Dispatch<React.SetStateAction<number | undefined>>
    defaultStreamID: string
    defaultWSURL: string
    defaultResolution: number
}

export const StreamContainer = createContainer((): StreamContainerType => {
    const defaultStreamID = "R3dvaIhZOxRr1645381571194"
    const defaultWSURL = "wss://video.ninja-cdn.com:5443/WebRTCAppEE/websocket"
    const defaultResolution = 720

    // video
    const webRtc = useRef<WebRTCAdaptorType>()
    const vidRef = useRef<HTMLVideoElement | undefined>(undefined)

    // stream
    const [currentStream, setCurrentStream] = useState<Stream>()
    const [selectedWsURL, setSelectedWsURL] = useState(defaultWSURL)
    const [selectedStreamID, setSelectedStreamID] = useState(defaultStreamID)

    // volume
    const [volume, setVolume] = useState(0.0)
    const [isMute, toggleIsMute] = useToggle(true)

    // resolution
    const [streamResolutions, setStreamResolutions] = useState<number[]>([])
    const [currentResolution, setCurrentResolution] = useState<number>()

    useEffect(() => {
        if (volume <= 0) {
            toggleIsMute(true)
            return
        }
        if (vidRef && vidRef.current && vidRef.current.volume) {
            vidRef.current.volume = volume
            toggleIsMute(false)
        }
    }, [volume])

    const vidRefCallback = useCallback(
        (vid: HTMLVideoElement) => {
            if (!vid || !vid.parentNode) {
                vidRef.current = undefined
                return
            }
            try {
                vidRef.current = vid
                webRtc.current = new WebRTCAdaptor({
                    websocket_url: selectedWsURL,
                    mediaConstraints: { video: false, audio: false },
                    sdp_constraints: {
                        OfferToReceiveAudio: true,
                        OfferToReceiveVideo: true,
                    },
                    remoteVideoId: "remoteVideo",
                    isPlayMode: true,
                    debug: false,
                    candidateTypes: ["tcp", "udp"],
                    callback: (info: string, obj: any) => {
                        if (info == "initialized") {
                            if (!webRtc || !webRtc.current || !webRtc.current.play) return
                            webRtc.current.play(selectedStreamID, "")
                        } else if (info == "play_started") {
                            if (!webRtc || !webRtc.current || !webRtc.current.getStreamInfo) return
                            webRtc.current.getStreamInfo(selectedStreamID)
                        } else if (info == "streamInformation") {
                            const resolutions: number[] = [0]
                            obj["streamInfo"].forEach((entry: StreamInfoEntry) => {
                                // get resolutions from server response and added to an array.
                                if (!resolutions.includes(entry["streamHeight"])) {
                                    resolutions.push(entry["streamHeight"])
                                }
                            })
                            setStreamResolutions(resolutions)
                        } else if (info == "closed") {
                            webRtc.current = undefined
                            if (typeof obj != "undefined") {
                                console.log("connection closed: " + JSON.stringify(obj))
                            }
                        }
                    },
                    callbackError: (error: string) => {
                        console.log(`--- ERROR ---`, error)
                    },
                })
            } catch (e) {
                console.log(e)
                webRtc.current = undefined
            }
        },
        [selectedWsURL],
    )

    return {
        webRtc,
        vidRef,
        vidRefCallback,

        currentStream,
        setCurrentStream,

        selectedWsURL,
        setSelectedWsURL,

        selectedStreamID,
        setSelectedStreamID,

        currentResolution,
        setCurrentResolution,

        streamResolutions,
        setStreamResolutions,

        volume,
        setVolume,
        isMute,
        toggleIsMute,

        defaultStreamID,
        defaultWSURL,
        defaultResolution,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
