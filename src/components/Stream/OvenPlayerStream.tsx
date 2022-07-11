import { Stack } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useEffect, useRef } from "react"
import { useSnackbar, useStream } from "../../containers"
import { parseString } from "../../helpers"
import { siteZIndex } from "../../theme/theme"
import { StreamService } from "../../types"

interface OvenPlayerSource {
    type: "webrtc" | "llhls" | "hls" | "lldash" | "dash" | "mp4"
    file: string
    label?: string
    framerate?: number
    sectionStart?: number
    sectionEnd?: number
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
    const { newSnackbarMessage } = useSnackbar()
    const { isMute, volume, currentStream, setCurrentPlayingStreamHost } = useStream()
    const ovenPlayer = useRef<OvenPlayerInstance>()

    // Load the stream when its changed
    useEffect(() => {
        if (document.getElementById("oven-player")) {
            // Uf already setup, then return
            if (!currentStream || ovenPlayer.current || currentStream.service !== StreamService.OvenMediaEngine) return

            // Load oven player
            const source: OvenPlayerSource = {
                label: currentStream.name,
                type: "webrtc",
                file: currentStream.url,
            }

            const newOvenPlayer = OvenPlayer.create("oven-player", {
                autoStart: true,
                controls: false,
                mute: isMute,
                volume: parseString(localStorage.getItem("streamVolume"), 0.3) * 100,
                sources: [source],
                autoFallback: true,
                disableSeekUI: true,
            })

            newOvenPlayer.on("ready", () => {
                console.log("ovenplayer ready")
                setCurrentPlayingStreamHost(currentStream.host)
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
    }, [currentStream, setCurrentPlayingStreamHost])

    useEffect(() => {
        if (volume <= 0) return
        ovenPlayer.current?.setVolume(volume * 100)
    }, [volume])

    useEffect(() => {
        ovenPlayer.current?.setMute(isMute)
    }, [isMute])

    return (
        <Stack
            key={currentStream?.stream_id}
            sx={{
                width: "100%",
                height: "100%",
                zIndex: siteZIndex.Stream,
                div: {
                    height: "100% !important",
                },
                video: {
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
            <div id="oven-player" />
        </Stack>
    )
}
