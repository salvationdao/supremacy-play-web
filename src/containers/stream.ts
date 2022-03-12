import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor"
import { useToggle } from "../hooks"
import { Stream } from "../types"
import { getObjectFromArrayByKey, parseString } from "../helpers"
import { useGameServerWebsocket } from "."
import { GameServerKeys } from "../keys"

const MAX_OPTIONS = 10

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

    forceStreamQuality: (stream_id: string, quality: number) => void
    play: (stream_id: string, token_id: string) => void
    getStreamInfo: (stream_id: string) => void
    closeWebSocket: (stream_id: string) => void
}

const blankOption: Stream = {
    host: "No Stream",
    name: "No Stream",
    url: "",
    stream_id: "No Stream",
    region: "",
    resolution: "",
    bit_rates_kbits: 0,
    user_max: 999999,
    users_now: 0,
    active: true,
    status: "online",
    latitude: 0,
    longitude: 0,
    distance: 0,
}

export const StreamContainer = createContainer(() => {
    const { state, subscribe } = useGameServerWebsocket()
    const defaultResolution = 720

    // video
    const webRtc = useRef<WebRTCAdaptorType>()
    const vidRef = useRef<HTMLVideoElement | undefined>(undefined)

    // stream
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])
    const [currentStream, setCurrentStream] = useState<Stream>()

    // volume
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(true)

    // resolution
    const [streamResolutions, setStreamResolutions] = useState<number[]>([])
    const [currentResolution, setCurrentResolution] = useState<number>()

    // no stream error
    const [noStreamExist, setNoStreamExist] = useState(false)

    useEffect(() => {
        localStorage.setItem("streamVolume", volume.toString())

        if (volume <= 0) {
            toggleIsMute(true)
            return
        }
        if (vidRef && vidRef.current && vidRef.current.volume) {
            vidRef.current.volume = volume
        }
        toggleIsMute(false)
    }, [volume])

    const changeStream = (s: Stream) => {
        if (!s) return
        setCurrentStream(s)
        localStorage.setItem("new_stream_props", JSON.stringify(s))
    }

    // Subscribe to list of streams
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<Stream[]>(GameServerKeys.GetStreamList, (payload) => {
            if (!payload) return
            setStreams([blankOption, ...payload])
        })
    }, [state, subscribe])

    // Build stream options for the drop down
    useEffect(() => {
        if (!streams || streams.length <= 0) return

        // Filter for servers that have capacity and is onlnine
        const availStreams = streams.filter((x) => {
            return x.users_now < x.user_max && x.status === "online"
        })

        if (availStreams.length <= 0) return

        // Reduce the list of options so it's not too many for the user
        // By default its sorted by quietest servers first
        const quietestStreams = availStreams.sort((a, b) =>
            a.users_now / a.user_max > b.users_now / b.user_max ? 1 : -1,
        )

        // If the local storage stream is in the list, set as current stream
        const localStream = localStorage.getItem("new_stream_props")
        if (localStream) {
            const savedStream = JSON.parse(localStream)
            if (getObjectFromArrayByKey(availStreams, savedStream.stream_id, "stream_id")) {
                setCurrentStream(savedStream)
                SetNewStreamOptions(quietestStreams, true)
                return
            }
        }

        SetNewStreamOptions(quietestStreams)
    }, [streams])

    const SetNewStreamOptions = (newStreamOptions: Stream[], dontChangeCurrentStream?: boolean) => {
        // Limit to only a few for the dropdown and include our current selection if not already in the list
        const temp = newStreamOptions.slice(0, MAX_OPTIONS)
        if (currentStream && !getObjectFromArrayByKey(temp, currentStream.stream_id, "stream_id")) {
            newStreamOptions[newStreamOptions.length - 1] = currentStream
        }

        // If there is no current stream selected then pick the US one (for now)
        if (!dontChangeCurrentStream && !currentStream && newStreamOptions && newStreamOptions.length > 0) {
            const usaStreams = newStreamOptions.filter((s) => s.name == "USA AZ")
            if (usaStreams && usaStreams.length > 0) {
                changeStream(usaStreams[0])
            }
        }

        // Reverse the order for rendering so best is closer to user's mouse
        setStreamOptions(temp.reverse())
    }

    const vidRefCallback = useCallback(
        (vid: HTMLVideoElement) => {
            if (!currentStream || !currentStream.url || !currentStream.stream_id) return
            if (!vid || !vid.parentNode) {
                vidRef.current = undefined
                return
            }
            try {
                vidRef.current = vid
                if (vidRef.current.volume) vidRef.current.volume = volume

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
                    callback: (info: string, obj: any) => {
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
                            setStreamResolutions(resolutions)
                        } else if (info == "closed") {
                            webRtc.current = undefined
                            if (typeof obj != "undefined") {
                                console.log("connection closed: " + JSON.stringify(obj))
                            }
                        }
                    },
                    callbackError: (error: string) => {
                        if (error === "no_stream_exist" || error === "WebSocketNotConnected") {
                            console.log(`--- ERROR ---`, error)
                        }
                    },
                })
            } catch (e) {
                console.log(e)
                webRtc.current = undefined
            }
        },
        [currentStream],
    )

    return {
        webRtc,
        vidRef,
        vidRefCallback,

        streamOptions,

        currentStream,
        changeStream,

        currentResolution,
        setCurrentResolution,
        streamResolutions,

        volume,
        setVolume,
        isMute,
        toggleIsMute,

        defaultResolution,

        noStreamExist,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
