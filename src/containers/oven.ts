import { useCallback, useEffect, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { useGlobalNotifications } from "."
import { GetOvenStreamList } from "../fetching"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"

export interface OvenStream {
    name: string
    base_url: string
    available_resolutions: string[]
    isBlank?: boolean
}

const blankOptionOven: OvenStream = {
    name: "No Stream",
    base_url: "",
    available_resolutions: [],
    isBlank: true,
}

export const OvenStreamContainer = createContainer(() => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { query: queryOvenGetStreamList } = useParameterizedQuery(GetOvenStreamList)

    // Stream
    const [loadedOvenStreams, setLoadedOvenStreams] = useState<OvenStream[]>([])
    const [ovenStreamOptions, setOvenStreamOptions] = useState<OvenStream[]>([])
    const [currentOvenStream, setCurrentOvenStream] = useState<OvenStream>()
    const [currentOvenPlayingStreamHost, setCurrentOvenPlayingStreamHost] = useState<string>()

    // Volume control
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(true)
    const [musicVolume, setMusicVolume] = useState(parseString(localStorage.getItem("musicVolume"), 0.3))
    const [isMusicMute, toggleIsMusicMute] = useToggle(true)

    // oven resolution control
    const [selectedOvenResolution, setSelectedOvenResolution] = useState<string>()
    const [ovenResolutions, setOvenResolutions] = useState<string[]>([])

    const [isEnlarged, toggleIsEnlarged] = useToggle((localStorage.getItem("isStreamEnlarged") || "true") === "true")
    const hasInteracted = useRef(false)

    // Unmute stream / trailers etc. after user has interacted with the site.
    // This is needed for autoplay to work
    useEffect(() => {
        const resetMute = () => {
            toggleIsMute(localStorage.getItem("isMute") == "true")
            toggleIsMusicMute(localStorage.getItem("isMusicMute") == "true")
            hasInteracted.current = true
        }

        document.addEventListener("mousedown", resetMute, { once: true })
    }, [toggleIsMusicMute, toggleIsMute])

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
        if (hasInteracted.current) localStorage.setItem("isMute", isMute ? "true" : "false")
    }, [isMute])

    useEffect(() => {
        if (hasInteracted.current) localStorage.setItem("isMusicMute", isMusicMute ? "true" : "false")
    }, [isMusicMute])

    useEffect(() => {
        localStorage.setItem("streamVolume", volume.toString())

        if (volume <= 0) {
            toggleIsMute(true)
            return
        }

        if (hasInteracted.current) toggleIsMute(false)
    }, [toggleIsMute, volume])

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
        // localStorage.setItem("new_stream_props", JSON.stringify(s))
    }, [])

    useEffect(() => {
        localStorage.setItem("isStreamEnlarged", isEnlarged.toString())
    }, [isEnlarged])

    // Build stream options for the drop down
    useEffect(() => {
        if (!loadedOvenStreams || loadedOvenStreams.length <= 0) return

        // Filter for servers that have capacity and is online
        const availStreams = loadedOvenStreams

        if (availStreams.length <= 0) return

        // Reduce the list of options so it's not too many for the user
        // By default its sorted by quietest servers first
        const quietestStreams = availStreams

        if (quietestStreams.length > 0) {
            setCurrentOvenStream(quietestStreams[1])
        }

        setOvenStreamOptions(quietestStreams)
    }, [loadedOvenStreams])

    return {
        selectedOvenResolution,
        setSelectedOvenResolution,
        ovenResolutions,
        setOvenResolutions,

        setCurrentOvenPlayingStreamHost,
        ovenStreamOptions,
        currentOvenStream,
        currentOvenPlayingStreamHost,

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
