import { Box, Button, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { PlayerListContent } from "../.."
import { useArena, useAuth, useChat, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import OvenLiveKit from "ovenlivekit"
import { useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { OvenPlayerInstance, OvenPlayerSource, OvenStream } from "../../../containers/oven"
import OvenPlayer from "ovenplayer"
import { GameServerKeys } from "../../../keys"

interface VoiceStreamResp {
    listen_url: string
    send_url: string
    isFactionCommander: boolean
}

export const PlayerList = () => {
    const { getFaction } = useSupremacy()
    const { user, factionID } = useAuth()
    const { activePlayers } = useChat()
    const { currentArenaID } = useArena()

    const [ready, setReady] = useState(false)
    const [listenStreams, setListenStreams] = useState<string[]>()
    const [voiceChats, setVoiceChats] = useState<VoiceStreamResp[]>()

    // player voice chat data
    useGameServerSubscriptionSecuredUser<VoiceStreamResp[]>(
        {
            URI: `/arena/${currentArenaID}`,
            key: GameServerKeys.SubPlayerVoiceStream,
            ready: !!(currentArenaID && factionID),
        },
        (payload: VoiceStreamResp[]) => {
            setListenStreams(undefined)
            setReady(false)
            setVoiceChats(payload)
        },
    )

    useEffect(() => {
        voiceChats?.map((v) => {
            if (v.send_url) {
                startStream(v.send_url)
            }

            if (!v.send_url && v.listen_url) {
                setListenStreams((ls) => [...(ls || ""), v.listen_url])
            }
        })

        setReady(true)
    }, [voiceChats])

    useEffect(() => {
        if (!ready) return
        listenStreams?.map((l) => {
            listen(l)
        })
    }, [ready])

    // Load the stream when its changed
    const ovenPlayer = useRef<OvenPlayerInstance>()
    const listen = useCallback((stream: string) => {
        if (document.getElementById(stream)) {
            const newOvenPlayer = OvenPlayer.create(stream, {
                autoStart: true,
                controls: true,
                volume: 100,
                sources: [
                    {
                        type: "webrtc",
                        file: stream,
                    },
                ],
                autoFallback: true,
                disableSeekUI: true,
            })

            newOvenPlayer.on("ready", () => {
                console.log("voice chat ready Ready.")
            })

            newOvenPlayer.on("error", (err: Error) => {
                console.error("voice chat error: ", err)
            })

            newOvenPlayer.play()
            ovenPlayer.current = newOvenPlayer

            return () => {
                newOvenPlayer.off("ready")
                newOvenPlayer.off("error")
                newOvenPlayer.remove()
                ovenPlayer.current = undefined
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const startStream = useCallback((url: string) => {
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
    }, [])

    return (
        <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
            <Content streams={listenStreams} getFaction={getFaction} user={user} activePlayers={activePlayers} />
        </Stack>
    )
}

const Content = ({
    getFaction,
    user,
    activePlayers,
    streams,
}: {
    getFaction: (factionID: string) => Faction
    user: User
    activePlayers: User[]
    streams: string[] | undefined
}) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -60), [theme.factionTheme.primary])

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack
                direction="row"
                spacing=".96rem"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: "2.2rem",
                    pr: "4.8rem",
                    height: `${5}rem`,
                    background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                    boxShadow: 1.5,
                }}
            >
                {user.faction_id && (
                    <Box
                        sx={{
                            width: "3rem",
                            height: "3rem",
                            flexShrink: 0,
                            mb: ".16rem",
                            backgroundImage: `url(${getFaction(user.faction_id).logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundColor: (theme) => theme.factionTheme.primary,
                            borderRadius: 0.5,
                            border: (theme) => `${theme.factionTheme.primary} solid 1px`,
                        }}
                    />
                )}
                <Stack spacing=".1rem">
                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {user.faction_id ? `${acronym(getFaction(user.faction_id).label)} ACTIVE PLAYERS` : "ACTIVE PLAYERS"}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="1.3rem">
                        <Stack direction="row" alignItems="center" spacing=".4rem">
                            <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: colors.green }} />
                            <Typography variant="body2" sx={{ lineHeight: 1 }}>
                                <strong>Active: </strong>
                                {activePlayers.length}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Box
                sx={{
                    flex: 1,
                    ml: ".8rem",
                    mr: ".3rem",
                    pr: ".5rem",
                    my: "1rem",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",

                    "::-webkit-scrollbar": {
                        width: "1rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: (theme) => theme.factionTheme.primary,
                    },
                }}
            >
                <Box sx={{ height: 0 }}>
                    <PlayerListContent activePlayers={activePlayers} />
                </Box>
            </Box>

            <Button>Listen</Button>
            {streams &&
                streams.map((s) => {
                    return <video id={s} key={s} />
                })}
        </Stack>
    )
}
