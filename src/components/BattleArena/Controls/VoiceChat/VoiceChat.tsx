import { Box, IconButton, Stack, Typography } from "@mui/material"
import OvenLiveKit from "ovenlivekit"
import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgMicrophone, SvgMicrophoneMute, SvgUserDiamond, SvgVoice } from "../../../../assets"
import ConnectSound from "../../../../assets/voiceChat/Connect.wav"
import DisconnectSound from "../../../../assets/voiceChat/Disconnect.wav"
import { useArena, useAuth, useGlobalNotifications, useSupremacy } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { acronym } from "../../../../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { FactionWithPalette, FeatureName, User } from "../../../../types"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { NicePopover } from "../../../Common/Nice/NicePopover"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"
import { FactionCommanderJoinButton } from "./FactionCommanderJoinButton"
import { ListenerItem } from "./ListenerItem"
import { PlayerItem } from "./PlayerItem"

export interface VoiceStream {
    listen_url: string
    send_url: string
    is_faction_commander: boolean
    username: string
    user_gid: number
    current_kick_vote: number
}

export const VoiceChat = () => {
    const [open, setOpen] = useState(false)
    const theme = useTheme()
    const popoverRef = useRef(null)
    const { newSnackbarMessage } = useGlobalNotifications()

    const { getFaction } = useSupremacy()
    const { user, factionID, userHasFeature } = useAuth()
    const { currentArenaID } = useArena()

    const [voiceStreams, setVoiceStreams] = useState<VoiceStream[]>()
    const [listeners, setListeners] = useState<User[]>()
    const [hasFactionCommander, setHasFactionCommander] = useState<boolean>(false)
    const [connected, setConnected] = useState(false)

    const { send } = useGameServerCommandsFaction("/faction_commander")

    const hasFeature = userHasFeature(FeatureName.voiceChat)

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const ovenLiveKitInstance = useRef<any>()

    const startStream = useCallback((url: string) => {
        const constraints = { video: false, audio: true }

        if (ovenLiveKitInstance && ovenLiveKitInstance.current) {
            ovenLiveKitInstance.current.remove()
            ovenLiveKitInstance.current = undefined
        }
        const liveKit = OvenLiveKit.create()
        liveKit.getUserMedia(constraints).then(() => {
            liveKit.startStreaming(url)
        })

        ovenLiveKitInstance.current = liveKit
    }, [])

    const stopStream = () => {
        if (ovenLiveKitInstance && ovenLiveKitInstance.current) {
            ovenLiveKitInstance.current.remove()
            ovenLiveKitInstance.current = undefined
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
            // get updated listeners
            getVoiceStreamListeners()

            if (payload) {
                // put faction commander on top
                const sorted = payload.sort((x, y) => Number(y.is_faction_commander) - Number(x.is_faction_commander))
                const factionCommander = payload.filter((v) => v.is_faction_commander)
                setVoiceStreams(sorted)
                setHasFactionCommander(!!(factionCommander && factionCommander.length > 0))

                if (!connected) return
                onConnect(sorted, false)
            }
        },
    )

    useGameServerSubscriptionSecuredUser<User[]>(
        {
            URI: `/arena/${currentArenaID}/listeners`,
            key: GameServerKeys.SubPlayerVoiceStreamListeners,
            ready: !!(currentArenaID && factionID),
        },
        (payload: User[]) => {
            if (payload) {
                setListeners(payload)
            }
        },
    )

    const getVoiceStreamListeners = useCallback(async () => {
        try {
            const resp = await send<User[]>(GameServerKeys.GetPlayerVoiceStreamListeners, {
                arena_id: currentArenaID,
            })
            if (!resp) {
                return
            }

            setListeners(resp)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get listeners"
            newSnackbarMessage(message, "error")
        }
    }, [currentArenaID, newSnackbarMessage, send])

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
    }, [currentArenaID, newSnackbarMessage, send])

    const joinListeners = useCallback(async () => {
        try {
            const resp = await send<{ success: boolean }>(GameServerKeys.VoiceChatConnect, {
                arena_id: currentArenaID,
            })

            if (!resp) {
                newSnackbarMessage("Failed to join listeners", "error")
                return
            }
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to join listeners"
            newSnackbarMessage(message, "error")
        }
    }, [currentArenaID, newSnackbarMessage, send])

    const leaveListeners = useCallback(async () => {
        try {
            const resp = await send<{ success: boolean }>(GameServerKeys.VoiceChatDisconnect, {
                arena_id: currentArenaID,
            })

            if (!resp) {
                newSnackbarMessage("Failed to leave", "error")
                return
            }
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to leave"
            newSnackbarMessage(message, "error")
        }
    }, [currentArenaID, newSnackbarMessage, send])

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
    }, [currentArenaID, newSnackbarMessage, send])

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
    }, [currentArenaID, newSnackbarMessage, send])

    const playSound = (url: string) => {
        const audio = new Audio(url)
        audio.play()
    }

    // listen stream
    const listen = useCallback((stream: VoiceStream) => {
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
                if (newOvenPlayer) {
                    newOvenPlayer.play()
                }
            })

            newOvenPlayer.on("destroy", () => {
                if (newOvenPlayer) {
                    newOvenPlayer.off("ready")
                    newOvenPlayer.off("error")
                }
            })

            newOvenPlayer.on("error", (err: { code: number }) => {
                if (err.code === 501) {
                    console.log("501: failed to connnect attempting to recconnect", err)
                } else {
                    console.error("voice chat error: ", err)
                }

                // try reconnect on error
                setTimeout(() => {
                    listen(stream)
                }, 5000)
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
    }, [])

    const onConnect = (streams: VoiceStream[], enableSound: boolean) => {
        streams?.map((l) => {
            if (l.send_url) {
                startStream(l.send_url)
            }
            listen(l)
        })

        // play sound: connect
        if (enableSound) {
            playSound(ConnectSound)
        }
        setConnected(true)
        joinListeners()
    }

    const onDisconnect = () => {
        stopStream()

        // remove listen streams
        if (voiceStreams) {
            voiceStreams.map((l) => {
                const player = OvenPlayer.getPlayerByContainerId(l.listen_url)
                if (player) {
                    player.off("ready")
                    player.off("error")
                    player.remove()
                }
            })
        }

        leaveListeners()
        // play sound here: disconnect
        playSound(DisconnectSound)
        setConnected(false)
    }

    useEffect(() => {
        if (!connected) return
        onConnect(voiceStreams || [], false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceStreams])

    const onMuteMic = (mute: boolean) => {
        if (ovenLiveKitInstance) {
            ovenLiveKitInstance.current.stream.getTracks()[0].enabled = mute
        }
    }

    if (!hasFeature) {
        return <></>
    }
    return (
        <>
            <NiceButton
                ref={popoverRef}
                buttonColor={theme.factionTheme.primary}
                sx={{ position: "relative", minWidth: "7rem", px: "1rem", py: ".1rem" }}
                onClick={() => setOpen((prev) => !prev)}
            >
                <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                    <SvgVoice inline size="1.5rem" /> Voice Chat
                </Typography>
            </NiceButton>

            <NicePopover
                id="voice-chat"
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={popoverRef.current}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <VoiceChatInner
                    user={user}
                    faction={getFaction(user.faction_id)}
                    hasFactionCommander={hasFactionCommander}
                    voiceStreams={voiceStreams || []}
                    listeners={listeners || []}
                    connected={connected}
                    onConnect={() => onConnect(voiceStreams || [], true)}
                    onDisconnect={onDisconnect}
                    onMuteMic={onMuteMic}
                    onJoinFactionCommander={joinFactionCommander}
                    onLeaveFactionCommander={() => {
                        leaveFactionCommander()
                        onDisconnect()
                    }}
                    onVoteKick={voteKick}
                />
            </NicePopover>

            {voiceStreams &&
                voiceStreams.map((s) => {
                    return (
                        <Box key={s.username + s.user_gid} sx={{ display: "none" }}>
                            <div id={s.listen_url} key={s.username + s.user_gid} />
                            <div style={{ fontSize: "2rem", color: "white" }}>user: {s.username}</div>
                        </Box>
                    )
                })}
        </>
    )
}

export const VoiceChatInner = ({
    user,
    faction,
    hasFactionCommander,
    voiceStreams,
    listeners,
    connected,

    onConnect,
    onDisconnect,
    onMuteMic,
    onJoinFactionCommander,
    onLeaveFactionCommander,
    onVoteKick,
}: {
    user: User
    faction: FactionWithPalette
    hasFactionCommander: boolean
    voiceStreams: VoiceStream[]
    listeners: User[]
    connected: boolean

    onConnect: () => void
    onDisconnect: () => void
    onMuteMic: (b: boolean) => void
    onJoinFactionCommander: () => void
    onLeaveFactionCommander: () => void
    onVoteKick: () => void
}) => {
    const [micMuted, setMicMuted] = useState(false)
    const theme = useTheme()

    const isSpeaker = useMemo(() => {
        const arr = voiceStreams.filter((l) => !!l.send_url && l.user_gid == user.gid)
        return arr && arr.length > 0
    }, [voiceStreams, user.gid])

    const renderListeners = useMemo(() => {
        const arr: User[] = []
        const vsIDs = voiceStreams.map((vs) => vs.user_gid)

        listeners.forEach((t) => {
            if (!vsIDs.includes(t.gid) && t.faction_id == user.faction_id) {
                arr.push(t)
            }
        })

        return (
            arr &&
            arr.map((s, idx) => {
                return <ListenerItem player={s} faction={faction} key={idx} />
            })
        )
    }, [listeners, voiceStreams, faction, user.faction_id])

    return (
        <Stack sx={{ width: "50rem", height: "55rem" }}>
            {/* Top part, connect and disconnect button */}
            <Stack
                direction="row"
                spacing="1rem"
                alignItems="center"
                sx={{
                    p: "1.5rem 2.2rem",
                    backgroundColor: theme.factionTheme.s700,
                    boxShadow: 1.5,
                }}
            >
                {user.faction_id && (
                    <Box
                        sx={{
                            width: "3.4rem",
                            height: "3.4rem",
                            flexShrink: 0,
                            backgroundImage: `url(${faction.logo_url})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                        }}
                    />
                )}

                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {user.faction_id && `${acronym(faction.label)} VOICE CHAT`}
                </Typography>

                <Box flex={1} />

                <Box>
                    {connected ? (
                        <NiceButton buttonColor={colors.red} sx={{ p: ".3rem 1rem", minWidth: "7rem" }} onClick={onDisconnect}>
                            <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                Disconnect
                            </Typography>
                        </NiceButton>
                    ) : (
                        <NiceButton buttonColor={colors.green} sx={{ p: ".3rem 1rem", minWidth: "7rem" }} onClick={onConnect}>
                            <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                Connect
                            </Typography>
                        </NiceButton>
                    )}
                </Box>
            </Stack>

            {/* Middle part */}
            <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
                <Box sx={{ overflowY: "auto", overflowX: "hidden" }}>
                    {/* If not connected, show dark overlay */}
                    {!connected && (
                        <Box
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                right: 0,
                                background: "#000000",
                                opacity: 0.8,
                                zIndex: 9,
                            }}
                        ></Box>
                    )}

                    {/* Speakers */}
                    <Box>
                        <Typography variant="body2" fontFamily={fonts.nostromoBlack} sx={{ p: ".8rem 1.2rem", backgroundColor: theme.factionTheme.s500 }}>
                            FACTION COMMANDER & MECH OPERATORS
                        </Typography>

                        {!hasFactionCommander && (
                            <FactionCommanderJoinButton
                                onJoinFactionCommander={() => {
                                    onJoinFactionCommander()
                                    onConnect()
                                }}
                            />
                        )}

                        {voiceStreams &&
                            voiceStreams.map((s, idx) => {
                                return (
                                    <PlayerItem
                                        currentUser={user}
                                        isSpeaker={isSpeaker}
                                        onLeaveFactionCommander={onLeaveFactionCommander}
                                        onVoteKick={onVoteKick}
                                        voiceStream={s}
                                        faction={faction}
                                        key={idx}
                                    />
                                )
                            })}
                    </Box>

                    {/* Listeners */}
                    <Box>
                        <Typography variant="body2" fontFamily={fonts.nostromoBlack} sx={{ p: ".8rem 1.2rem", backgroundColor: theme.factionTheme.s500 }}>
                            LISTENERS
                        </Typography>

                        {renderListeners}
                    </Box>
                </Box>
            </Box>

            {/* Bottom part, mute and stuff */}
            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    p: "1rem 2.2rem",
                    backgroundColor: theme.factionTheme.s700,
                    zIndex: 3,
                }}
            >
                <TypographyTruncated>
                    <SvgUserDiamond inline /> {user.username}#{user.gid}
                </TypographyTruncated>

                <Box flex={1} />

                <IconButton
                    size="small"
                    sx={{ opacity: 0.8, ":hover": { opacity: 0.6 } }}
                    onClick={() => {
                        onMuteMic(micMuted)
                        setMicMuted(!micMuted)
                    }}
                >
                    {micMuted ? <SvgMicrophoneMute size="1.8rem" /> : <SvgMicrophone size="1.6rem" />}
                </IconButton>
            </Stack>
        </Stack>
    )
}
