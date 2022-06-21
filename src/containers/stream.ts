import { useCallback, useEffect, useState } from "react"
import { useParameterizedQuery } from "react-fetching-library"
import { createContainer } from "unstated-next"
import { GetStreamList } from "../fetching"
import { getObjectFromArrayByKey, parseString } from "../helpers"
import { useToggle } from "../hooks"
import { Stream, StreamService } from "../types"

const testData: Stream[] = [
    {
        host: "https://stream2.supremacy.game:3334/app/stream2",
        name: "Experimental 🌟",
        url: "wss://stream2.supremacy.game:3334/app/stream2",
        stream_id: "Experimental",
        region: "au",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 1000,
        users_now: 100,
        active: true,
        status: "online",
        latitude: "1.3521000146865845",
        longitude: "103.8198013305664",
        service: StreamService.OvenMediaEngine,
    },
    {
        host: "https://video-us-az.ninja-cdn.com/WebRTCAppEE/player.html?name=C09fbFLgzraO1655181891921",
        name: "STAGING",
        url: "wss://video-us-az.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "C09fbFLgzraO1655181891921",
        region: "us",
        resolution: "1920x1080",
        bit_rates_k_bits: 6000,
        user_max: 1000,
        users_now: 40,
        active: true,
        status: "online",
        latitude: "34.048927",
        longitude: "-111.093735",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-au-syd.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "AUS SYD",
        url: "wss://video-au-syd.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "au",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 150,
        users_now: 50,
        active: false,
        status: "offline",
        latitude: "-33.865143",
        longitude: "151.2099",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-sg-sin.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "SG SIN",
        url: "wss://video-sg-sin.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "se-asia",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 150,
        users_now: 50,
        active: false,
        status: "offline",
        latitude: "1.3521000146865845",
        longitude: "103.8198013305664",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-jp-tyo.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "JP TYO",
        url: "wss://video-jp-tyo.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "jp",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 150,
        users_now: 50,
        active: false,
        status: "offline",
        latitude: "35.652832",
        longitude: "139.839478",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-de-fra.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "DE FRA",
        url: "wss://video-de-fra.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "eu",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 300,
        users_now: 100,
        active: false,
        status: "offline",
        latitude: "10.451499938964844",
        longitude: "51.16569900512695",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-us-la.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "USA LA",
        url: "wss://video-us-la.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "us",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 1000,
        users_now: 100,
        active: false,
        status: "offline",
        latitude: "34.052235",
        longitude: "-118.243683",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-us-ny.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "USA NY",
        url: "wss://video-us-ny.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "us",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 3000,
        users_now: 100,
        active: false,
        status: "offline",
        latitude: "40.712776",
        longitude: "-74.005974",
        service: StreamService.AntMedia,
    },
    {
        host: "http://23.250.14.154:5080/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "USA NY",
        url: "ws://23.250.14.154:5080/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "us",
        resolution: "1920x1080",
        bit_rates_k_bits: 6000,
        user_max: 400,
        users_now: 40,
        active: false,
        status: "online",
        latitude: "40.712776",
        longitude: "-74.005974",
        service: StreamService.AntMedia,
    },
    {
        host: "https://video-us-ny2.ninja-cdn.com/WebRTCAppEE/player.html?name=kKS7qgSpuaVb1645817767607",
        name: "USA NY2",
        url: "wss://video-us-ny2.ninja-cdn.com/WebRTCAppEE/websocket",
        stream_id: "kKS7qgSpuaVb1645817767607",
        region: "us",
        resolution: "1920x1080",
        bit_rates_k_bits: 4000,
        user_max: 2000,
        users_now: 100,
        active: false,
        status: "online",
        latitude: "40.712776",
        longitude: "-74.005974",
        service: StreamService.AntMedia,
    },
]

const MAX_OPTIONS = 10

const blankOption: Stream = {
    host: "No Stream",
    name: "No Stream",
    url: "",
    stream_id: "No Stream",
    region: "",
    resolution: "",
    bit_rates_k_bits: 0,
    user_max: 999999,
    users_now: 0,
    active: true,
    status: "online",
    latitude: "0",
    longitude: "0",
    service: StreamService.None,
}

export const StreamContainer = createContainer(() => {
    const { query: queryGetStreamList } = useParameterizedQuery(GetStreamList)

    // Stream
    const [loadedStreams, setLoadedStreams] = useState<Stream[]>([])
    const [streamOptions, setStreamOptions] = useState<Stream[]>([])
    const [currentStream, setCurrentStream] = useState<Stream>()
    const [currentPlayingStreamHost, setCurrentPlayingStreamHost] = useState<string>()

    // Volume control
    const [volume, setVolume] = useState(parseString(localStorage.getItem("streamVolume"), 0.3))
    const [isMute, toggleIsMute] = useToggle(localStorage.getItem("isMute") == "true")
    const [musicVolume, setMusicVolume] = useState(parseString(localStorage.getItem("musicVolume"), 0.3))
    const [isMusicMute, toggleIsMusicMute] = useToggle(localStorage.getItem("isMusicMute") == "true")

    // Resolution control
    const [selectedResolution, setSelectedResolution] = useState<number>()
    const [resolutions, setResolutions] = useState<number[]>([])

    // Fetch stream list
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await queryGetStreamList({})
                if (resp.error || !resp.payload) return
                // setLoadedStreams([blankOption, ...resp.payload])
                setLoadedStreams(testData)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [queryGetStreamList])

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

    const changeStream = useCallback((s: Stream) => {
        if (!s) return
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
