import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor"
import { useToggle } from "../hooks"
import { Stream } from "../types"
import { getObjectFromArrayByKey, parseString } from "../helpers"
import { useGameServerWebsocket, useSnackbar } from "."
import { GameServerKeys } from "../keys"
import OvenPlayer from "ovenplayer"

const MAX_OPTIONS = 10

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

interface OvenPlayerInstance {
    getVersion(): string
    // getConfig(): OvenPlayerConfig
    getContainerElement(): HTMLDivElement
    getContainerId(): string
    getMseInstance(): object | null
    getProviderName(): string | null
    load(sources: OvenPlayerSource[] | OvenPlayerPlayList): void
    getMediaElement(): HTMLVideoElement
    getState(): string
    getBrowser(): object
    setTimecodeMode(mode: boolean): void
    isTimecodeMode(): boolean
    getFramerate(): number
    seekFrame(frame: number): void
    getDuration(): number
    getPosition(): number
    getVolume(): number
    setVolume(volume: number): void
    getMute(): boolean
    setMute(mute: boolean): void
    play(): void
    pause(): void
    stop(): void
    seek(position: number): void
    getPlaybackRate(): number
    setPlaybackRate(rate: number): void
    getPlaylist(): OvenPlayerPlayList
    getCurrentPlaylist(): number
    setCurrentPlaylist(index: number): void
    getSources(): OvenPlayerSource[] | OvenPlayerPlayList
    getCurrentSource(): number
    setCurrentSource(index: number): void
    getQualityLevels(): object[]
    getCurrentQuality(): number
    setCurrentQuality(index: number): void
    isAutoQuality(): boolean
    setAutoQuality(auto: boolean): void
    addCaption(track: object): void
    getCaptionList(): object[]
    getCurrentCaption(): number
    setCurrentCaption(index: number): void
    setCaption(caption: object): void
    removeCaption(index: number): void
    showControls(show: boolean): void
    toggleFullScreen(): void
    on(eventName: string, callback: OvenPlayerCallbackFunction): void
    once(eventName: string, callback: OvenPlayerCallbackFunction): void
    off(eventName: string): void
    remove(): void
}

type OvenPlayerCallbackFunction = (...args: any[]) => void

type OvenPlayerPlayList = OvenPlayerSource[][]

interface OvenPlayerSource {
    type: "webrtc" | "llhls" | "hls" | "lldash" | "dash" | "mp4"
    file: string
    label?: string
    framerate?: number
    sectionStart?: number
    sectionEnd?: number
}
export const StreamContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, subscribe } = useGameServerWebsocket()
    const defaultResolution = 720

    // video
    const webRtc = useRef<WebRTCAdaptorType>()
    const vidRef = useRef<HTMLVideoElement | undefined>(undefined)
    const [currentPlayingStreamHost, setCurrentPlayingStreamHost] = useState<string>()

    // stream
    const [streams, setStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])
    const [currentStream, setCurrentStream] = useState<Stream>()

    // volume
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(localStorage.getItem("isMute") == "true")
    const [musicVolume, setMusicVolume] = useState(parseString(localStorage.getItem("musicVolume"), 0.3))
    const [isMusicMute, toggleIsMusicMute] = useToggle(localStorage.getItem("isMusicMute") == "true")

    // resolution
    const [selectedResolution, setSelectedResolution] = useState<number>()
    const [streamResolutions, setStreamResolutions] = useState<number[]>([])
    const [, setFailedToChangeRed] = useState(false)

    // When user selects a resolution, make the change into the stream
    useEffect(() => {
        if (
            webRtc?.current &&
            selectedResolution &&
            selectedResolution > 0 &&
            streamResolutions &&
            streamResolutions.length > 0 &&
            currentStream &&
            currentStream.host === currentPlayingStreamHost
        ) {
            try {
                webRtc.current.forceStreamQuality(currentStream.stream_id, selectedResolution)
                setFailedToChangeRed(false)
            } catch {
                setFailedToChangeRed(true)
            }
        }
    }, [selectedResolution, currentStream, streamResolutions, currentPlayingStreamHost])

    useEffect(() => {
        if (localStorage.getItem("isMute") == "true") setVolume(0)
        if (localStorage.getItem("isMusicMute") == "true") setMusicVolume(0)
    }, [])

    useEffect(() => {
        localStorage.setItem("isMute", isMute ? "true" : "false")
    }, [isMute])

    useEffect(() => {
        localStorage.setItem("isMusicMute", isMusicMute ? "true" : "false")
    }, [isMusicMute])

    useEffect(() => {
        localStorage.setItem("streamVolume", volume.toString())

        if (volume <= 0) {
            toggleIsMute(true)
            return
        }

        if (vidRef && vidRef.current) {
            vidRef.current.volume = volume
        }
        toggleIsMute(false)
    }, [toggleIsMute, volume])

    useEffect(() => {
        localStorage.setItem("musicVolume", musicVolume.toString())

        if (musicVolume <= 0) {
            toggleIsMusicMute(true)
            return
        }

        toggleIsMusicMute(false)
    }, [musicVolume, toggleIsMusicMute])

    // Subscribe to list of streams
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<Stream[]>(GameServerKeys.SubStreamList, (payload) => {
            if (!payload) return
            setStreams([blankOption, ...payload])
        })
    }, [state, subscribe])

    const changeStream = useCallback((s: Stream) => {
        if (!s) return

        const _source: OvenPlayerSource = {
            type: "webrtc",
            file: s.url,
        }
        setCurrentStream(s)
        localStorage.setItem("new_stream_props", JSON.stringify(s))
    }, [])

    const setNewStreamOptions = useCallback(
        (newStreamOptions: Stream[], dontChangeCurrentStream?: boolean) => {
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

            const stream2 = {
                host: "straem2",
                name: "stream2",
                url: "wss://stream2.supremacy.game:3334/app/stream2",
                stream_id: "stream2",
                region: "",
                resolution: "",
                bit_rates_kbits: 100,
                user_max: 100,
                users_now: 100,
                active: true,
                status: "",
                latitude: 100,
                longitude: 100,
                distance: 100,
            }
            // Reverse the order for rendering so best is closer to user's mouse
            setStreamOptions([...temp.reverse(), stream2])
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    // Build stream options for the drop down
    useEffect(() => {
        if (!streams || streams.length <= 0) return

        // Filter for servers that have capacity and is onlnine
        const availStreams = streams.filter((x) => {
            return x.users_now < x.user_max && x.status === "online" && x.active
        })

        if (availStreams.length <= 0) return

        // Reduce the list of options so it's not too many for the user
        // By default its sorted by quietest servers first
        const quietestStreams = availStreams.sort((a, b) => (a.users_now / a.user_max > b.users_now / b.user_max ? 1 : -1))

        // If the local storage stream is in the list, set as current stream
        const localStream = localStorage.getItem("new_stream_props")
        if (localStream) {
            const savedStream = JSON.parse(localStream)
            if (getObjectFromArrayByKey(availStreams, savedStream.stream_id, "stream_id")) {
                setCurrentStream(savedStream)
                setNewStreamOptions(quietestStreams, true)
                return
            }
        }

        setNewStreamOptions(quietestStreams)
    }, [setNewStreamOptions, streams])

    const vidRefCallback = useCallback(
        (vid: HTMLVideoElement) => {
            if (!currentStream || !currentStream.url || !currentStream.stream_id) return
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
                            setStreamResolutions(resolutions)
                            setSelectedResolution(Math.max.apply(null, resolutions))
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
                            console.debug("Failed to start stream:", e)
                            newSnackbarMessage("Failed to start stream.", "error")
                        }
                    },
                })
            } catch (e) {
                console.debug(e)
                webRtc.current = undefined
            }
        },
        [currentStream, newSnackbarMessage],
    )

    return {
        webRtc,
        vidRef,
        vidRefCallback,

        streamOptions,

        currentStream,
        changeStream,

        streamResolutions,
        selectedResolution,
        setSelectedResolution,

        volume,
        setVolume,
        isMute,
        toggleIsMute,

        musicVolume,
        setMusicVolume,
        isMusicMute,
        toggleIsMusicMute,

        defaultResolution,
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
