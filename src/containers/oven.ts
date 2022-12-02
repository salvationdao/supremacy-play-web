import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useSupremacy } from "."
import { parseString } from "../helpers"
import { useToggle } from "../hooks"

export interface OvenStream {
    name: string
    base_url: string
    available_resolutions: string[]
    default_resolution: string
    isBlank?: boolean
}

export const blankOptionOven: OvenStream = {
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

export interface OvenPlayerInstance {
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
    const { hasInteracted } = useSupremacy()

    const ovenPlayer = useRef<OvenPlayerInstance>()

    // Stream
    const [currentOvenStream, setCurrentOvenStream] = useState<OvenStream>(blankOptionOven)
    const [ovenStreamOptions, setCurrentStreamOptions] = useState<OvenStream[]>([])

    // Volume control
    const [volume, setVolume] = useState(0)
    const [isMute, toggleIsMute] = useToggle(true)

    // Oven resolution control
    const [selectedOvenResolution, setSelectedOvenResolution] = useState<string>()
    const [ovenResolutions, setOvenResolutions] = useState<string[]>([])

    const [isEnlarged, toggleIsEnlarged] = useToggle((localStorage.getItem("isStreamEnlarged") || "true") === "true")

    // Unmute stream / trailers etc. after user has interacted with the site.
    // This is needed for autoplay to work
    useEffect(() => {
        setVolume(parseString(localStorage.getItem("streamVolume"), 0.28))
        toggleIsMute(localStorage.getItem("isMute") == "true")
    }, [toggleIsMute, hasInteracted])

    useEffect(() => {
        if (hasInteracted) localStorage.setItem("isMute", isMute ? "true" : "false")
    }, [hasInteracted, isMute])

    useEffect(() => {
        if (!selectedOvenResolution) return
        localStorage.setItem(`${currentOvenStream?.name}-resolution`, selectedOvenResolution.toString())
    }, [currentOvenStream?.name, selectedOvenResolution])

    useEffect(() => {
        if (hasInteracted) localStorage.setItem("streamVolume", volume.toString())

        if (volume <= 0) {
            toggleIsMute(true)
            return
        }

        if (hasInteracted) toggleIsMute(false)
    }, [hasInteracted, toggleIsMute, volume])

    const changeOvenStream = useCallback((s: OvenStream) => {
        if (!s) return
        setCurrentOvenStream(s)
        setOvenResolutions(s.available_resolutions)
        localStorage.setItem("selectedOvenStream", JSON.stringify(s))
    }, [])

    useEffect(() => {
        localStorage.setItem("isStreamEnlarged", isEnlarged.toString())
    }, [isEnlarged])

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
        setCurrentStreamOptions,
        currentOvenStream,

        changeOvenStream,

        volume,
        setVolume,
        isMute,
        toggleIsMute,
        isEnlarged,
        toggleIsEnlarged,
    }
})

export const OvenStreamProvider = OvenStreamContainer.Provider
export const useOvenStream = OvenStreamContainer.useContainer
