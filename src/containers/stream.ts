import { useCallback, useEffect, useRef, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { useSnackbar } from "."
import { GetStreamList } from "../fetching"
import { getObjectFromArrayByKey, parseString } from "../helpers"
import { useToggle } from "../hooks"
import { Stream, StreamService } from "../types"

const MAX_OPTIONS = 10

const experimental1: Stream = {
    host: "wss://stream2.supremacy.game:3334/app/stream2",
    name: "Experimental 🌟",
    url: "wss://stream2.supremacy.game:3334/app/stream2",
    stream_id: "oven-player-experimental",
    region: "",
    resolution: "",
    bit_rates_k_bits: 0,
    user_max: 2,
    users_now: 1,
    active: true,
    status: "online",
    latitude: "0",
    longitude: "0",
    service: StreamService.OvenMediaEngine,
}

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

export const StreamContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { query: queryGetStreamList } = useParameterizedQuery(GetStreamList)

    // Stream
    const [loadedStreams, setLoadedStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])
    const [currentStream, setCurrentStream] = useState<Stream>()
    const [currentPlayingStreamHost, setCurrentPlayingStreamHost] = useState<string>()

    // Volume control
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(true)
    const [musicVolume, setMusicVolume] = useState(parseString(localStorage.getItem("musicVolume"), 0.3))
    const [isMusicMute, toggleIsMusicMute] = useToggle(true)

    // Resolution control
    const [selectedResolution, setSelectedResolution] = useState<number>()
    const [resolutions, setResolutions] = useState<number[]>([])

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
                // setLoadedStreams([blankOption, ...resp.payload])
                setLoadedStreams([blankOption, ...resp.payload, experimental1]) // TODO Remove hard-coded experimental
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get the list of streams."
                newSnackbarMessage(message, "error")
                console.error(message)
            }
        })()
    }, [newSnackbarMessage, queryGetStreamList])

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

    // Build stream options for the drop down
    useEffect(() => {
        if (!loadedStreams || loadedStreams.length <= 0) return

        // Filter for servers that have capacity and is online
        const availStreams = [
            ...loadedStreams.filter((x) => {
                return x.users_now < x.user_max && x.status === "online" && x.active
            }),
        ]

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
    }, [setNewStreamOptions, loadedStreams])

    return {
        streamOptions,
        currentStream,
        changeStream,
        resolutions,
        setResolutions,
        selectedResolution,
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
    }
})

export const StreamProvider = StreamContainer.Provider
export const useStream = StreamContainer.useContainer
