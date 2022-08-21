import { useCallback, useEffect, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { useGlobalNotifications } from "."
import { GetOvenStreamList, GetStreamList } from "../fetching"
import { getObjectFromArrayByKey, parseString } from "../helpers"
import { useToggle } from "../hooks"
import { Stream, StreamService } from "../types"

const MAX_OPTIONS = 10

const blankOption: Stream = {
    host: "No Stream",
    name: "No Stream",
    url: "",
    stream_id: "No Stream",
    region: "",
    resolution: "",
    bit_rates_k_bits: 0,
    user_max: 9999999,
    users_now: 0,
    active: true,
    status: "online",
    latitude: "0",
    longitude: "0",
    service: StreamService.None,
}

export interface OvenStream {
    name: string
    base_url: string
    available_resolutions: string[]
}

const blankOptionOven: OvenStream = {
    name: "No Stream",
    base_url: "",
    available_resolutions: [],
}

export const StreamContainer = createContainer(() => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { query: queryGetStreamList } = useParameterizedQuery(GetStreamList)

    const { query: queryOvenGetStreamList } = useParameterizedQuery(GetOvenStreamList)

    // Stream
    const [loadedStreams, setLoadedStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])
    const [currentStream, setCurrentStream] = useState<Stream>()
    const [currentPlayingStreamHost, setCurrentPlayingStreamHost] = useState<string>()

    // oven
    const [loadedOvenStreams, setLoadedOvenStreams] = useState<OvenStream[]>([])
    const [ovenStreamOptions, setOvenStreamOptions] = useState<OvenStream[]>([])
    const [currentOvenStream, setCurrentOvenStream] = useState<OvenStream>()
    const [currentOvenPlayingStreamHost, setCurrentOvenPlayingStreamHost] = useState<string>()

    // Volume control
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(true)
    const [musicVolume, setMusicVolume] = useState(parseString(localStorage.getItem("musicVolume"), 0.3))
    const [isMusicMute, toggleIsMusicMute] = useToggle(true)

    // Resolution control
    const [selectedResolution, setSelectedResolution] = useState<number>()
    const [resolutions, setResolutions] = useState<number[]>([])

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
                const resp = await queryGetStreamList({})
                if (resp.error || !resp.payload) return
                setLoadedStreams([blankOption, ...resp.payload])
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get the list of streams."
                newSnackbarMessage(message, "error")
                console.error(message)
            }
        })()
    }, [newSnackbarMessage, queryGetStreamList])

    // Fetch oven stream list
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryOvenGetStreamList({})

                console.log("thisi s ", resp)

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

    const changeStream = useCallback((s: Stream) => {
        if (!s) return
        setCurrentStream(s)
        setResolutions([])
        localStorage.setItem("new_stream_props", JSON.stringify(s))
    }, [])

    const changeOvenStream = useCallback((s: OvenStream) => {
        if (!s) return
        setCurrentOvenStream(s)
        setOvenResolutions(s.available_resolutions)
        // localStorage.setItem("new_stream_props", JSON.stringify(s))
    }, [])

    useEffect(() => {
        localStorage.setItem("isStreamEnlarged", isEnlarged.toString())
    }, [isEnlarged])

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
                if (usaStreams && usaStreams.length > 0) changeStream(usaStreams[0])
            }

            // Reverse the order for rendering so best is closer to user's mouse
            setStreamOptions(temp.reverse())
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    // // Build stream options for the drop down
    // useEffect(() => {
    //     if (!loadedStreams || loadedStreams.length <= 0) return

    //     // Filter for servers that have capacity and is online
    //     const availStreams = [
    //         ...loadedStreams.filter((x) => {
    //             return x.users_now < x.user_max && x.status === "online" && x.active
    //         }),
    //     ]

    //     if (availStreams.length <= 0) return

    //     // Reduce the list of options so it's not too many for the user
    //     // By default its sorted by quietest servers first
    //     const quietestStreams = availStreams.sort((a, b) => (a.users_now / a.user_max > b.users_now / b.user_max ? 1 : -1))

    //     // If the local storage stream is in the list, set as current stream
    //     const localStream = localStorage.getItem("new_stream_props")
    //     if (localStream) {
    //         const savedStream = JSON.parse(localStream)
    //         if (getObjectFromArrayByKey(availStreams, savedStream.stream_id, "stream_id")) {
    //             setCurrentStream(savedStream)
    //             setNewStreamOptions(quietestStreams, true)
    //             return
    //         }
    //     } else if (quietestStreams.length > 0) {
    //         setCurrentStream(quietestStreams[quietestStreams.length - 1])
    //     }

    //     setNewStreamOptions(quietestStreams)
    // }, [setNewStreamOptions, loadedStreams])

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
    }, [setNewStreamOptions, loadedOvenStreams])

    return {
        streamOptions,
        currentStream,
        changeStream,
        resolutions,
        setResolutions,
        selectedResolution,

        // todo replace ant medo
        selectedOvenResolution,
        setSelectedOvenResolution,
        ovenResolutions,
        setOvenResolutions,

        setCurrentOvenPlayingStreamHost,
        ovenStreamOptions,
        currentOvenStream,
        currentOvenPlayingStreamHost,

        changeOvenStream,

        setSelectedResolution,
        currentPlayingStreamHost,
        setCurrentPlayingStreamHost,

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

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
