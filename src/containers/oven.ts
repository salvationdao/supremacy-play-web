import { useCallback, useEffect, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { useGlobalNotifications, useSupremacy } from "."
import { GetOvenStreamList } from "../fetching"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"

export interface OvenStream {
    name: string
    base_url: string
    available_resolutions: string[]
    default_resolution: string
    isBlank?: boolean
}

const blankOptionOven: OvenStream = {
    name: "No Stream",
    default_resolution: "",
    base_url: "",
    available_resolutions: [],
    isBlank: true,
}

export interface OvenPlayerSource {
    type: "webrtc" | "llhls" | "hls" | "lldash" | "dash" | "mp4"
    file: string
    label?: string
    framerate?: number
    sectionStart?: number
    sectionEnd?: number
    resolution?: string
    index?: number
}

type OvenPlayerPlayList = OvenPlayerSource[][]

type OvenPlayerCallbackFunction = (...args: unknown[]) => void

interface OvenPlayerInstance {
    getVersion(): string
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

export const OvenStreamContainer = createContainer(() => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { hasInteracted } = useSupremacy()
    const { query: queryOvenGetStreamList } = useParameterizedQuery(GetOvenStreamList)

    const ovenPlayer = useRef<OvenPlayerInstance>()

    // Stream
    const [loadedOvenStreams, setLoadedOvenStreams] = useState<OvenStream[]>([])
    const [ovenStreamOptions, setOvenStreamOptions] = useState<OvenStream[]>([])
    const [currentOvenStream, setCurrentOvenStream] = useState<OvenStream>()

    // Volume control
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(true)
    const [musicVolume, setMusicVolume] = useState(parseString(localStorage.getItem("musicVolume"), 0.3))
    const [isMusicMute, toggleIsMusicMute] = useToggle(true)

    // oven resolution control
    const [selectedOvenResolution, setSelectedOvenResolution] = useState<string>()
    const [ovenResolutions, setOvenResolutions] = useState<string[]>([])

    const [isEnlarged, toggleIsEnlarged] = useToggle((localStorage.getItem("isStreamEnlarged") || "true") === "true")

    // Unmute stream / trailers etc. after user has interacted with the site.
    // This is needed for autoplay to work
    useEffect(() => {
        toggleIsMute(localStorage.getItem("isMute") == "true")
        toggleIsMusicMute(localStorage.getItem("isMusicMute") == "true")
    }, [toggleIsMusicMute, toggleIsMute, hasInteracted])

    // Fetch stream list
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryOvenGetStreamList({})
                if (resp.error || !resp.payload) return

                setLoadedOvenStreams([blankOptionOven, ...resp.payload])
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get the list of oven streams."
                newSnackbarMessage(message, "error")
                console.error(message)
            }
        })()
    }, [newSnackbarMessage, queryOvenGetStreamList])

    useEffect(() => {
        if (hasInteracted) localStorage.setItem("isMute", isMute ? "true" : "false")
    }, [hasInteracted, isMute])

    useEffect(() => {
        if (hasInteracted) localStorage.setItem("isMusicMute", isMusicMute ? "true" : "false")
    }, [hasInteracted, isMusicMute])

    useEffect(() => {
        if (!selectedOvenResolution) return
        localStorage.setItem(`${currentOvenStream?.name}-resolution`, selectedOvenResolution.toString())
    }, [currentOvenStream?.name, selectedOvenResolution])

    useEffect(() => {
        localStorage.setItem("streamVolume", volume.toString())

        if (volume <= 0) {
            toggleIsMute(true)
            return
        }

        if (hasInteracted) toggleIsMute(false)
    }, [hasInteracted, toggleIsMute, volume])

    useEffect(() => {
        localStorage.setItem("musicVolume", musicVolume.toString())

        if (musicVolume <= 0) {
            toggleIsMusicMute(true)
            return
        }

        toggleIsMusicMute(false)
    }, [musicVolume, toggleIsMusicMute])

    const changeOvenStream = useCallback((s: OvenStream) => {
        if (!s) return
        setCurrentOvenStream(s)
        setOvenResolutions(s.available_resolutions)
        localStorage.setItem("selectedOvenStream", JSON.stringify(s))
    }, [])

    useEffect(() => {
        localStorage.setItem("isStreamEnlarged", isEnlarged.toString())
    }, [isEnlarged])

    // Build stream options for the drop down
    useEffect(() => {
        if (!loadedOvenStreams || loadedOvenStreams.length <= 0) return

        setOvenStreamOptions(loadedOvenStreams)

        // Load saved stream from local storage
        const localStream = localStorage.getItem("selectedOvenStream")
        if (localStream) {
            const savedStream = JSON.parse(localStream)
            const exists = loadedOvenStreams.find((os) => os.name === savedStream.name)
            if (exists) {
                changeOvenStream(exists)
                return
            }
        }
        changeOvenStream(loadedOvenStreams[1])
    }, [changeOvenStream, loadedOvenStreams])

    const getSourceIdx = (sources: OvenPlayerSource[], resolution: string) => {
        //  get source with index
        const src = sources.filter((s: OvenPlayerSource, i) => {
            if (s.label === resolution) {
                return { source: s, index: i }
            }
        })[0]

        return src?.index || 0
    }

    const changeResolutionSource = useCallback((resolution: string) => {
        if (ovenPlayer && ovenPlayer.current) {
            // get available sources from oven player (resolutions)
            const availSources = ovenPlayer.current.getSources()
            if (Array.isArray(availSources)) {
                const _availSources = availSources as OvenPlayerSource[]
                const idx = getSourceIdx(_availSources, resolution)

                // set new source
                ovenPlayer.current.setCurrentSource(idx)
            }
        }
    }, [])

    // watch for res changes
    useEffect(() => {
        changeResolutionSource(selectedOvenResolution || "")
    }, [selectedOvenResolution, changeResolutionSource])

    useEffect(() => {
        if (volume <= 0) return
        ovenPlayer.current?.setVolume(volume * 100)
    }, [volume])

    useEffect(() => {
        ovenPlayer.current?.setMute(isMute)
    }, [isMute])

    return {
        ovenPlayer,
        getSourceIdx,

        selectedOvenResolution,
        setSelectedOvenResolution,
        ovenResolutions,
        setOvenResolutions,

        ovenStreamOptions,
        currentOvenStream,

        changeOvenStream,

        volume,
        setVolume,
        isMute,
        toggleIsMute,
        musicVolume,
        setMusicVolume,
        isMusicMute,
        toggleIsMusicMute,
        isEnlarged,
        toggleIsEnlarged,
    }
})

export const OvenStreamProvider = OvenStreamContainer.Provider
export const useOvenStream = OvenStreamContainer.useContainer
