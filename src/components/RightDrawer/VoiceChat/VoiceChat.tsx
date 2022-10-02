import { Box, Button, IconButton, Popover, Slider, Stack, Typography } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgHeadphone, SvgMicrophone, SvgVolume, SvgVolumeMute } from "../../../assets"
import { useArena, useAuth, useGlobalNotifications, useSupremacy, VoiceStream } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import { StyledImageText } from "../../Notifications/Common/StyledImageText"
import OvenLiveKit from "ovenlivekit"

import ConnectSound from "../../../assets/voiceChat/Connect.wav"
import DisconnectSound from "../../../assets/voiceChat/Disconnect.wav"

export const VoiceChat = () => {
    const [open, setOpen] = useState(false)
    const popoverRef = useRef(null)
    const { newSnackbarMessage } = useGlobalNotifications()

    const { getFaction } = useSupremacy()
    const { user, factionID } = useAuth()
    const { currentArenaID } = useArena()

    const [listenStreams, setListenStreams] = useState<VoiceStream[]>()
    const [hasFactionCommander, setHasFactionCommander] = useState<boolean>(false)
    const [connected, setConnected] = useState(false)
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const ovenLiveKitInstance = useRef<any>()

    const startStream = useCallback((url: string) => {
        if (!url) {
            return
        }

        const liveKit = OvenLiveKit.create()
        const constraints = { video: false, audio: true }
        liveKit.getUserMedia(constraints).then(() => {
            liveKit.startStreaming(url)
        })

        ovenLiveKitInstance.current = liveKit
    }, [])

    const stopStream = () => {
        if (ovenLiveKitInstance && ovenLiveKitInstance.current) {
            ovenLiveKitInstance.current.remove()
            ovenLiveKitInstance.current = undefined
            OvenLiveKit.getDevices().then((d: any) => {
                console.log(d)
            })
        }
    }

    // ws
    useGameServerSubscriptionSecuredUser<VoiceStream[]>(
        {
            URI: `/arena/${currentArenaID}`,
            key: GameServerKeys.SubPlayerVoiceStream,
            ready: !!(currentArenaID && factionID),
        },
        (payload: VoiceStream[]) => {
            setListenStreams(payload)

            if (payload) {
                const factionCommander = payload.filter((v) => v.is_faction_commander)
                setHasFactionCommander(!!(factionCommander && factionCommander.length > 0))
            }
        },
    )

    const leaveFactionCommander = useCallback(async () => {
        try {
            const resp = await send<{ success: boolean }>(GameServerKeys.LeaveFactionCommander, {
                arena_id: currentArenaID,
            })

            if (!resp) {
                newSnackbarMessage("Failed to leave as faction commmander", "error")
                return
            }

            stopStream()
            newSnackbarMessage("Successfully left as faction commander", "success")
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to leave as faction commmander"
            newSnackbarMessage(message, "error")
        }
    }, [currentArenaID])

    const joinFactionCommander = useCallback(async () => {
        try {
            const resp = await send<{ success: boolean }>(GameServerKeys.JoinFactionCommander, {
                arena_id: currentArenaID,
            })

            if (!resp) {
                newSnackbarMessage("Failed to update faction commmander", "error")
                return
            }

            newSnackbarMessage("You are now faction commander", "success")
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to update faction commmander"
            newSnackbarMessage(message, "error")
        }
    }, [currentArenaID])

    const voteKick = useCallback(async () => {
        try {
            const resp = await send<{ success: boolean }>(GameServerKeys.VoiceChatVoteKick, {
                arena_id: currentArenaID,
            })

            if (!resp) {
                newSnackbarMessage("Failed to vote to kick faction commmander", "error")
                return
            }

            newSnackbarMessage("Voted to kick faction commander", "success")
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to vote to kick faction commmander"
            newSnackbarMessage(message, "error")
        }
    }, [currentArenaID])

    const playSound = (url: string) => {
        const audio = new Audio(url)
        audio.play()
    }

    // listen stream
    const listen: any = useCallback(
        (stream: VoiceStream) => {
            if (document.getElementById(stream.listen_url)) {
                let newOvenPlayer = OvenPlayer.getPlayerByContainerId(stream.listen_url)

                if (newOvenPlayer) {
                    newOvenPlayer.remove()
                    newOvenPlayer = null

                    listen(stream)
                    return
                }

                if (!newOvenPlayer) {
                    newOvenPlayer = OvenPlayer.create(stream.listen_url, {
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
                }

                newOvenPlayer.on("ready", () => {
                    console.log("voice chat ready Ready.")
                })

                newOvenPlayer.on("error", (err: { code: number }) => {
                    if (connected) {
                        if (err.code === 501) {
                            console.log("501: failed to connnect attempting to recconnect", err)
                        } else {
                            console.error("voice chat error: ", err)
                        }

                        // try reconnect on error
                        setTimeout(() => {
                            listen(stream)
                        }, 5000)
                    }
                })

                newOvenPlayer.play()

                return () => {
                    if (newOvenPlayer) {
                        newOvenPlayer.off("ready")
                        newOvenPlayer.off("error")
                        newOvenPlayer.remove()
                    }
                }
            }
        },
        [connected],
    )
    const onListen = useCallback(
        (s: VoiceStream[]) => {
            s?.map((l) => {
                if (l.send_url) {
                    startStream(l.send_url)
                }
                listen(l)
            })

            // play sound: connect
            playSound(ConnectSound)
            setConnected(true)
        },
        [listenStreams, listen, startStream],
    )

    useEffect(() => {
        if (connected) {
            listenStreams?.map((l) => {
                if (l.send_url) {
                    startStream(l.send_url)
                }
                listen(l)
            })
        }
    }, [listenStreams, connected, listen, startStream])

    const onDisconnect = () => {
        stopStream()

        // remove listen streams
        if (listenStreams) {
            listenStreams.map((l) => {
                const player = OvenPlayer.getPlayerByContainerId(l.listen_url)
                if (player) {
                    player.off("ready")
                    player.off("error")
                    player.remove()
                }
            })
        }

        // play sound here: disconnect
        playSound(DisconnectSound)
        setConnected(false)
    }

    return (
        <>
            {/* open button */}
            <Button ref={popoverRef} onClick={() => setOpen(!open)}>
                Voice Chat
            </Button>

            <Popover
                id={"voice-chat"}
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={popoverRef.current}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Box sx={{ width: "40rem", height: "55rem" }}>
                    {
                        <VoiceChatInner
                            hasFactionCommander={hasFactionCommander}
                            connected={connected}
                            onDisconnect={onDisconnect}
                            faction={getFaction(user.faction_id)}
                            listenStreams={listenStreams || []}
                            onListen={onListen}
                            onJoinFactionCommander={joinFactionCommander}
                            onLeaveFactionCommander={leaveFactionCommander}
                            onVoteKick={voteKick}
                            user={user}
                        />
                    }
                </Box>
            </Popover>

            <>
                {listenStreams &&
                    listenStreams.map((s) => {
                        return (
                            <Box key={s.username + s.user_gid} sx={{ width: "30rem", height: "30rem" }}>
                                <div id={s.listen_url} key={s.username + s.user_gid} />
                                <div style={{ fontSize: "2rem", color: "white" }}>user: {s.username}</div>
                            </Box>
                        )
                    })}
            </>
        </>
    )
}

export const VoiceChatInner = ({
    user,
    faction,
    onListen,
    onDisconnect,
    onJoinFactionCommander,
    onLeaveFactionCommander,
    onVoteKick,
    connected,
    listenStreams,

    hasFactionCommander,
}: {
    onListen: (s: VoiceStream[]) => void
    onDisconnect: () => void
    onJoinFactionCommander: () => void
    onLeaveFactionCommander: () => void
    onVoteKick: () => void

    connected: boolean
    listenStreams: VoiceStream[]
    hasFactionCommander: boolean

    user: User
    faction: Faction
}) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])

    return (
        <Stack direction="row" width="100%" height="100%">
            <Stack sx={{ flex: 1 }}>
                <Stack
                    direction="row"
                    spacing=".96rem"
                    alignItems="center"
                    sx={{
                        zIndex: 3,
                        px: "2.2rem",
                        pl: "2.2rem",
                        height: "7rem",
                        boxShadow: 1.5,
                        background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {user.faction_id && (
                        <Box
                            sx={{
                                width: "3rem",
                                height: "3rem",
                                flexShrink: 0,
                                mb: ".16rem",
                                backgroundImage: `url(${faction.logo_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                backgroundColor: (theme) => theme.factionTheme.primary,
                                borderRadius: 0.5,
                                border: (theme) => `${theme.factionTheme.primary} solid 1px`,
                            }}
                        />
                    )}
                    <Stack width="100%" spacing=".1rem" direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                            {user.faction_id && `${acronym(faction.label)} VOICE CHAT`}
                        </Typography>

                        <Box>
                            {connected ? (
                                <Button
                                    sx={{
                                        color: colors.red,
                                        fontSize: "1.2rem",
                                        border: "1px solid " + colors.red,
                                    }}
                                    onClick={onDisconnect}
                                >
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    sx={{
                                        color: colors.green,
                                        fontSize: "1.2rem",
                                        border: "1px solid " + colors.green,
                                    }}
                                    onClick={() => {
                                        onListen(listenStreams || [])
                                    }}
                                >
                                    Connect
                                </Button>
                            )}
                        </Box>
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
                        postion: "relative",

                        "::-webkit-scrollbar": {
                            width: "1rem",
                        },
                        "::-webkit-scrollbar-track": {
                            background: "#FFFFFF15",
                        },
                        "::-webkit-scrollbar-thumb": {
                            background: (theme: any) => theme.factionTheme.primary,
                        },
                    }}
                >
                    {!connected && (
                        <Box sx={{ left: 0, top: 0, height: "100%", width: "100%", background: "#000", opacity: 0.6, position: "absolute", zIndex: 2 }}></Box>
                    )}

                    <Box>
                        {!hasFactionCommander && <FactionCommanderJoinButton onJoinFactionCommander={onJoinFactionCommander} />}
                        {listenStreams &&
                            listenStreams &&
                            listenStreams.map((s, idx) => {
                                return (
                                    <PlayerItem
                                        currentUser={user}
                                        onLeaveFactionCommander={onLeaveFactionCommander}
                                        onVoteKick={onVoteKick}
                                        voiceStream={s}
                                        faction={faction}
                                        key={idx}
                                    />
                                )
                            })}
                    </Box>
                </Box>

                <Stack
                    p="1.5rem"
                    sx={{
                        background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        zIndex: 3,
                    }}
                >
                    <StyledImageText
                        textSx={{
                            color: "#FFF",
                        }}
                        text={
                            <>
                                {`${user.username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.8, color: "#FFF" }}>{`#${user.gid}`}</span>
                            </>
                        }
                        color={faction.primary_color}
                        imageUrl={faction.logo_url}
                        {...StyledImageText}
                    />
                    <Stack
                        sx={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={() => {
                                // TODO
                                console.log("implement self mute/unmute")
                            }}
                            sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                        >
                            <SvgMicrophone size="2rem" sx={{ pb: 0 }} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => {
                                console.log("implement deafen")
                            }}
                            sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                        >
                            <SvgHeadphone size="2rem" sx={{ pb: 0 }} />
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

const PlayerItem = ({
    voiceStream,
    faction,
    currentUser,
    onLeaveFactionCommander,
    onVoteKick,
}: {
    onLeaveFactionCommander: () => void
    onVoteKick: () => void
    currentUser: User
    voiceStream: VoiceStream
    faction: Faction
}) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])
    const player = OvenPlayer.getPlayerByContainerId(voiceStream.listen_url)
    const factionCammenderTag = voiceStream.is_faction_commander ? "(FC)" : ""

    const LeaveFactionCommanderButton = useMemo(() => {
        return `${currentUser.gid}` === `${voiceStream.user_gid}` && voiceStream.is_faction_commander ? (
            <Button onClick={onLeaveFactionCommander}>Leave</Button>
        ) : (
            <></>
        )
    }, [voiceStream.is_faction_commander, currentUser.gid])

    const KickVoteButton = useMemo(() => {
        return `${currentUser.gid}` !== `${voiceStream.user_gid}` && voiceStream.is_faction_commander ? <Button onClick={onVoteKick}>Vote</Button> : <></>
    }, [currentUser.gid])

    const onMute = () => {
        // get oven player via id
        if (player) {
            if (!isMute) {
                setVolume(0)
                toggleIsMute(true)
            } else {
                setVolume(0.5)
                toggleIsMute(false)
            }
        }
    }

    const [isMute, toggleIsMute] = useToggle(false)
    const [volume, setVolume] = useState(1)

    const handleVolumeChange = useCallback(
        (_: Event, newValue: number | number[]) => {
            setVolume(newValue as number)
        },
        [setVolume],
    )

    useEffect(() => {
        if (player) {
            if (isMute) {
                player.setVolume(0)
                return
            }

            player.setVolume(volume * 100)
        }
    }, [volume, isMute])

    return (
        <>
            <Box
                mt="1rem"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "1.2rem",

                    background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                }}
            >
                <Box width="90%">
                    <StyledImageText
                        key={voiceStream.listen_url}
                        text={
                            <>
                                {`${voiceStream.username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${voiceStream.user_gid} ${factionCammenderTag}`}</span>
                            </>
                        }
                        color={faction.primary_color}
                        imageUrl={faction.logo_url}
                        {...StyledImageText}
                    />
                    {voiceStream.listen_url && voiceStream.ovenPlayer && (
                        <Box
                            sx={{
                                width: ".8rem",
                                height: ".8rem",
                                borderRadius: "50%",
                                backgroundColor: voiceStream.ovenPlayer.current.getState() === "playing" ? colors.green : colors.red,
                            }}
                        />
                    )}
                </Box>
                {KickVoteButton}
                {LeaveFactionCommanderButton}

                {!voiceStream.send_url && (
                    <>
                        <Slider
                            size="small"
                            min={0}
                            max={1}
                            step={0.01}
                            aria-label="Volume"
                            value={isMute ? 0 : volume}
                            onChange={handleVolumeChange}
                            sx={{
                                ml: "1rem",
                                mr: "1rem",
                                width: "10rem",
                                color: (theme) => theme.factionTheme.primary,
                            }}
                        />

                        <IconButton size="small" onClick={onMute} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                            {isMute || volume <= 0 ? <SvgVolumeMute size="2rem" sx={{ pb: 0 }} /> : <SvgVolume size="2rem" sx={{ pb: 0 }} />}
                        </IconButton>
                    </>
                )}
            </Box>
        </>
    )
}

const FactionCommanderJoinButton = ({ onJoinFactionCommander }: { onJoinFactionCommander: () => void }) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])

    return (
        <>
            <Box
                mt="1rem"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: "1.2rem",

                    background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                }}
            >
                <Stack width="100%" direction={"row"} justifyContent="space-between" alignItems="center">
                    <Typography sx={{ textTransfrom: "uppercase" }}>NO FACTION COMMANDER</Typography>

                    <Button
                        sx={{
                            color: colors.green,
                            fontSize: "1.2rem",
                            border: "1px solid " + colors.green,
                        }}
                        onClick={() => {
                            onJoinFactionCommander()
                        }}
                    >
                        ICON
                    </Button>
                </Stack>
            </Box>
        </>
    )
}
