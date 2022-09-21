import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerSubscription } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { Arena, ArenaStatus, ArenaType } from "../types"
import OvenLiveKit from "ovenlivekit"
import { OvenPlayerInstance } from "./oven"

export const ArenaContainer = createContainer(() => {
    const [arenaList, setArenaList] = useState<Arena[]>([])
    const [currentArena, setCurrentArena] = useState<Arena>()
    const [listenStreams, setListenStreams] = useState<VoiceStream[]>()
    const [connected, setConnected] = useState(false)

    const currentArenaID = currentArena?.id || ""

    const onListen = useCallback((listenStreams: VoiceStream[]) => {
        listenStreams?.map((l) => {
            if (l.send_url) {
                startStream(l, l.send_url)
            }
            listen(l)
        })
        setConnected(true)
    }, [])

    // listen stream
    // const ovenPlayer = useRef<OvenPlayerInstance>()

    const listen = useCallback((stream: VoiceStream) => {
        if (document.getElementById(stream.listen_url)) {
            const newOvenPlayer = OvenPlayer.create(stream.listen_url, {
                autoStart: true,
                controls: true,
                volume: 100,
                sources: [
                    {
                        type: "webrtc",
                        file: stream.listen_url,
                    },
                ],
                autoFallback: true,
                disableSeekUI: true,
            })

            newOvenPlayer.on("ready", () => {
                console.log("voice chat ready Ready.")
            })

            newOvenPlayer.on("error", (err: any) => {
                if (!connected) return
                if (err.code === 501) {
                    console.log("501: failed to connnect attempting to recconnect", err)
                } else {
                    console.error("voice chat error: ", err)
                }

                setTimeout(() => {
                    listen(stream)
                }, 1000)
            })

            newOvenPlayer.play()
            stream.ovenPlayer = newOvenPlayer
            // ovenPlayer.current = newOvenPlayer

            return () => {
                newOvenPlayer.off("ready")
                newOvenPlayer.off("error")
                newOvenPlayer.remove()
                // ovenPlayer.current = undefined
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onDisconnect = () => {
        console.log("discoonnecting")

        if (listenStreams) {
            listenStreams.map((l) => {
                if (l.ovenPlayer) {
                    l.ovenPlayer?.remove()
                }
                console.log("live kit obj", l.liveKit)

                if (l.liveKit) {
                    l.liveKit?.remove()
                    l.liveKit = undefined

                    // const constraints = { video: false, audio: true }

                    // l.liveKit.getUserMedia(constraints).then(function (d: any) {
                    //     console.log("live kit obj2", l.liveKit)

                    //     l.liveKit.stopStreaming()
                    // })
                }
                setConnected(false)
            })
        }
    }

    useEffect(() => {
        if (connected && listenStreams) {
            onListen(listenStreams)
            return
        }
        onDisconnect()
    }, [connected, listenStreams])

    const startStream = useCallback((stream: VoiceStream, url: string) => {
        if (!url) {
            return
        }
        const config = {
            callbacks: {
                error: function (error: any) {
                    console.log("voice chat error", error)
                },
                connected: function (event: any) {
                    console.log("voice chat event", event)
                },
            },
        }

        const liveKit = OvenLiveKit.create(config)
        const constraints = { video: false, audio: true }
        liveKit.getUserMedia(constraints).then(function (d: any) {
            liveKit.startStreaming(url)
        })

        stream.liveKit = liveKit
    }, [])

    return {
        arenaList,
        setArenaList,
        currentArena,
        setCurrentArena,
        currentArenaID,

        // voice chat
        listenStreams,
        setListenStreams,
        onListen,
        connected,

        onDisconnect,
    }
})

export const ArenaProvider = ArenaContainer.Provider
export const useArena = ArenaContainer.useContainer

export interface VoiceStream {
    listen_url: string
    send_url: string
    is_faction_fommander: boolean
    username: string
    user_gid: string
    ovenPlayer: OvenPlayerInstance | undefined
    liveKit: any
}

export const ArenaListener = () => {
    const { setArenaList, currentArenaID, setCurrentArena } = useArena()

    useGameServerSubscription<Arena[]>(
        {
            URI: "/public/arena_list",
            key: GameServerKeys.SubBattleArenaList,
        },
        (payload) => {
            if (!payload || payload.length === 0) {
                setArenaList([])
                setCurrentArena(undefined)
                return
            }

            // NOTE: temporary default arena to the first one
            const storyArena = payload.find((arena) => arena.type === ArenaType.Story)
            if (storyArena) {
                setCurrentArena(storyArena)
            } else {
                setCurrentArena(undefined)
            }
            // above code will be refactor when players are able to select arena

            setArenaList(payload)
        },
    )

    useGameServerSubscription<ArenaStatus>(
        {
            URI: `/public/arena/${currentArenaID}/status`,
            key: GameServerKeys.SubArenaStatus,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return
            setCurrentArena((prev) => {
                if (!prev) return

                return {
                    ...prev,
                    status: payload,
                }
            })
        },
    )

    useGameServerSubscription<boolean>(
        {
            URI: `/public/arena/${currentArenaID}/closed`,
            key: GameServerKeys.SubBattleArenaClosed,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return
            setCurrentArena(undefined)
        },
    )
    return null
}
