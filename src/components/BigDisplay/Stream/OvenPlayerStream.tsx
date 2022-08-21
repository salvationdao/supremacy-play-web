import { Button, Stack } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useEffect, useRef } from "react"
import { useGlobalNotifications, useStream } from "../../../containers"
import { parseString } from "../../../helpers"
import { siteZIndex } from "../../../theme/theme"
import { StreamService } from "../../../types"

// set resoltion opts when stream base url changes
interface OvenPlayerSource {
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

export const OvenplayerStream = () => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const {
        isMute,
        volume,
        currentOvenStream,
        setCurrentOvenPlayingStreamHost,
        isEnlarged,

        selectedOvenResolution,
    } = useStream()
    const ovenPlayer = useRef<OvenPlayerInstance>()

    interface OvenStream {
        name: string
        base_url: string
        available_resolutions: string[]
    }

    const changeSource = (resolution: string) => {
        if (ovenPlayer && ovenPlayer.current) {
            const blah = ovenPlayer.current.getSources()

            if (Array.isArray(blah)) {
                const bruh = blah as OvenPlayerSource[]
                const src = bruh.filter((s: OvenPlayerSource, i) => {
                    if (s.label === resolution) {
                        return { source: s, index: i }
                    }
                })[0]

                ovenPlayer.current.setCurrentSource(src.index || 0)
            }
        }
    }

    // watch for res changes
    useEffect(() => {
        changeSource(selectedOvenResolution || "")
    }, [selectedOvenResolution])

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
            const _sources: OvenPlayerSource[] = currentOvenStream.available_resolutions.map((os) => ({
                label: os,
                type: "webrtc",
                file: `${currentOvenStream.base_url}_${os}`,
                resolution: os,
            }))

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
                console.log("ovenplayer ready")
                setCurrentOvenPlayingStreamHost(currentOvenStream.name)
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
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOvenStream, setCurrentOvenPlayingStreamHost])

    useEffect(() => {
        if (volume <= 0) return
        ovenPlayer.current?.setVolume(volume * 100)
    }, [volume])

    useEffect(() => {
        ovenPlayer.current?.setMute(isMute)
    }, [isMute])

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
