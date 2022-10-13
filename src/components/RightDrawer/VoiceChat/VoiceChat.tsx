import { Box, IconButton, Popover, Slider, Stack, Typography } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgVoice, SvgVolume, SvgVolumeMute } from "../../../assets"
import { useArena, useAuth, useChat, useGlobalNotifications, useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction, FeatureName, User } from "../../../types"
import { StyledImageText } from "../../Notifications/Common/StyledImageText"
import OvenLiveKit from "ovenlivekit"

import ConnectSound from "../../../assets/voiceChat/Connect.wav"
import DisconnectSound from "../../../assets/voiceChat/Disconnect.wav"
import { FancyButton } from "../../Common/FancyButton"
import { ConfirmModal } from "../../Common/ConfirmModal"

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
            console.log("this be listeners", payload)

            if (payload) {
                // set listeners
                setListeners(payload)
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
                newSnackbarMessage("Failed to leave listeners", "error")
                return
            }

            newSnackbarMessage("Listening", "success")
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to leave listeners"
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

    const onConnect = useCallback(
        (streams: VoiceStream[], enableSound: boolean) => {
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
        },
        [listen, startStream],
    )
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

    const onMuteMic = () => {
        if (ovenLiveKitInstance) {
            ovenLiveKitInstance.current
                .getUserMedia({
                    video: false,
                    audio: true,
                })
                .then((d: any) => {
                    const audio = d.getAudioTracks()[0]
                    audio.enabled = false
                })
        }
    }

    if (!hasFeature) {
        return <></>
    }
    return (
        <>
            <FancyButton
                ref={popoverRef}
                onClick={() => setOpen(!open)}
                clipThingsProps={{
                    clipSize: "5px",
                    backgroundColor: theme.factionTheme.primary,
                    border: { borderColor: theme.factionTheme.primary, borderThickness: "1px" },
                    sx: { position: "relative" },
                }}
                sx={{ px: "1rem", pt: 0, pb: ".1rem", minWidth: "7rem", color: "#FFFFFF" }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2" sx={{ mr: "1rem", fontFamily: fonts.nostromoBlack }}>
                        Voice Chat
                    </Typography>

                    <SvgVoice size="1.5rem" />
                </Box>
            </FancyButton>

            <Popover
                sx={{ zIndex: 400 }}
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
                <Box sx={{ width: "50rem", height: "55rem" }}>
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
                        joinListeners={joinListeners}
                        leaveListeners={leaveListeners}
                        onJoinFactionCommander={joinFactionCommander}
                        onLeaveFactionCommander={() => {
                            leaveFactionCommander()
                            onDisconnect()
                        }}
                        onVoteKick={voteKick}
                    />
                </Box>
            </Popover>

            <>
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
    // onMuteMic,
    joinListeners,
    leaveListeners,
    onJoinFactionCommander,
    onLeaveFactionCommander,
    onVoteKick,
}: {
    user: User
    faction: Faction
    hasFactionCommander: boolean
    voiceStreams: VoiceStream[]
    listeners: User[]
    connected: boolean

    onConnect: () => void
    onDisconnect: () => void
    onMuteMic: () => void
    joinListeners: () => void
    leaveListeners: () => void
    onJoinFactionCommander: () => void
    onLeaveFactionCommander: () => void
    onVoteKick: () => void
}) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])
    const isSpeaker = useMemo(() => {
        const arr = voiceStreams.filter((l) => !!l.send_url && l.user_gid == user.gid)
        return arr && arr.length > 0
    }, [voiceStreams, user.gid])

    const renderListeners = useMemo(() => {
        const arr: User[] = []
        const vsIDs = voiceStreams.map((vs) => vs.user_gid)

        listeners.forEach((t) => {
            if (!vsIDs.includes(t.gid)) {
                arr.push(t)
            }
        })

        return (
            arr &&
            arr.map((s, idx) => {
                return <ListenerItem player={s} faction={faction} key={idx} />
            })
        )
    }, [listeners, voiceStreams])

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
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.red,
                                        border: { borderColor: colors.red, borderThickness: "1px" },
                                        sx: { position: "relative" },
                                    }}
                                    sx={{ px: "1rem", pt: 0, pb: ".1rem", minWidth: "7rem", color: "#FFFFFF" }}
                                    onClick={onDisconnect}
                                >
                                    <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        Disconnect
                                    </Typography>
                                </FancyButton>
                            ) : (
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "5px",
                                        backgroundColor: colors.green,
                                        border: { borderColor: colors.green, borderThickness: "1px" },
                                        sx: { position: "relative" },
                                    }}
                                    sx={{ px: "1rem", pt: 0, pb: ".1rem", minWidth: "7rem", color: "#FFFFFF" }}
                                    onClick={onConnect}
                                >
                                    <Typography variant="subtitle2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        Connect
                                    </Typography>
                                </FancyButton>
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

                    {/* speakers */}
                    <Box
                        sx={{
                            background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                        }}
                    >
                        <Typography fontWeight="bold" p="1.2rem" pb="0" variant="h6">
                            FACTION COMMANDER & MECH OPERATORS
                        </Typography>
                        {!hasFactionCommander && <FactionCommanderJoinButton onJoinFactionCommander={onJoinFactionCommander} />}
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

                    {/* listeners */}
                    <Box
                        sx={{
                            background: `linear-gradient(${bannerColor} 26%, ${bannerColor}95)`,
                            mt: "2rem",
                        }}
                    >
                        <Typography fontWeight="bold" p="1.2rem" pb="0" variant="h6">
                            LISTENERS
                        </Typography>
                        {/* {listeners &&
                            listeners.map((s, idx) => {
                                return <ListenerItem player={s} faction={faction} key={idx} />
                            })} */}
                        {renderListeners}
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
                    {/* TODO: implement self mute */}
                </Stack>
            </Stack>
        </Stack>
    )
}

enum ConfirmModalKeys {
    LeaveFactionCommander = "LeaveFactionCommander",
    JoinFactionCommander = "JoinFactionCommander",
    VoteKickFactionCommander = "VoteKickFactionCommander",
}
const PlayerItem = ({
    voiceStream,
    faction,
    currentUser,
    onLeaveFactionCommander,
    onVoteKick,
    isSpeaker,
}: {
    onLeaveFactionCommander: () => void
    onVoteKick: () => void
    currentUser: User
    voiceStream: VoiceStream
    faction: Faction
    isSpeaker: boolean
}) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])
    const player = OvenPlayer.getPlayerByContainerId(voiceStream.listen_url)
    const factionCammenderTag = voiceStream.is_faction_commander ? "(FC)" : ""
    const [confirmModal, setConfirmModal] = useState<ConfirmModalKeys | undefined>(undefined)

    const LeaveFactionCommanderButton = useMemo(() => {
        return `${currentUser.gid}` === `${voiceStream.user_gid}` && voiceStream.is_faction_commander ? (
            <>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: colors.red,
                        border: { borderColor: colors.red, borderThickness: "1px" },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1rem", pt: 0, pb: ".1rem", color: "#FFFFFF" }}
                    onClick={() => setConfirmModal(ConfirmModalKeys.LeaveFactionCommander)}
                >
                    LEAVE
                </FancyButton>

                {confirmModal === ConfirmModalKeys.LeaveFactionCommander && (
                    <ConfirmModal
                        title="LEAVE AS FACTION COMMANDER"
                        onConfirm={() => {
                            onLeaveFactionCommander()
                            setConfirmModal(undefined)
                        }}
                        onClose={() => setConfirmModal(undefined)}
                    >
                        <></>
                    </ConfirmModal>
                )}
            </>
        ) : (
            <> </>
        )
    }, [voiceStream.is_faction_commander, currentUser.gid, voiceStream.user_gid, onLeaveFactionCommander, confirmModal])

    const KickVoteButton = useMemo(() => {
        return `${currentUser.gid}` !== `${voiceStream.user_gid}` && voiceStream.is_faction_commander && isSpeaker ? (
            <>
                <FancyButton
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: colors.red,
                        border: { borderColor: colors.red, borderThickness: "1px" },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1rem", pt: 0, pb: ".1rem", color: "#FFFFFF" }}
                    innerSx={{ width: "17rem" }}
                    onClick={() => setConfirmModal(ConfirmModalKeys.VoteKickFactionCommander)}
                >
                    KICK VOTE ({voiceStream.current_kick_vote})
                </FancyButton>
                {confirmModal === ConfirmModalKeys.VoteKickFactionCommander && (
                    <ConfirmModal
                        width="55rem"
                        title="VOTE TO KICK FACTION COMMANDER"
                        onConfirm={() => {
                            onVoteKick()
                            setConfirmModal(undefined)
                        }}
                        onClose={() => setConfirmModal(undefined)}
                    >
                        <Typography variant="h6">
                            If the majority of mech owners vote to kick the faction commander, the faction commander will be banned from being faction commander
                            again for 24hrs
                        </Typography>
                    </ConfirmModal>
                )}
            </>
        ) : (
            <></>
        )
    }, [currentUser.gid, voiceStream.user_gid, voiceStream.is_faction_commander, voiceStream.current_kick_vote, onVoteKick, confirmModal, isSpeaker])

    const onMute = () => {
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
    }, [volume, isMute, player])

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
                <Box width="90%" display="flex" alignItems="center">
                    <StyledImageText
                        key={voiceStream.listen_url}
                        text={
                            <>
                                {`${voiceStream.username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${voiceStream.user_gid} ${factionCammenderTag}`}</span>
                            </>
                        }
                        color={voiceStream.is_faction_commander ? colors.yellow : "#FFF"}
                        imageUrl={faction.logo_url}
                        {...StyledImageText}
                    />

                    {/* TODO: implement oven player "playing" status */}
                    {/* {voiceStream.listen_url && player && (
                        <Box
                            sx={{
                                width: ".8rem",
                                height: ".8rem",
                                borderRadius: "50%",
                                backgroundColor: player.getState() === "playing" ? colors.green : colors.red,
                            }}
                        />
                    )} */}
                </Box>

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

                        <IconButton size="small" onClick={onMute} sx={{ opacity: 0.5, mr: "1rem", transition: "all .2s", ":hover": { opacity: 1 } }}>
                            {isMute || volume <= 0 ? <SvgVolumeMute size="2rem" sx={{ pb: 0 }} /> : <SvgVolume size="2rem" sx={{ pb: 0 }} />}
                        </IconButton>

                        {KickVoteButton}
                    </>
                )}

                {LeaveFactionCommanderButton}
            </Box>
        </>
    )
}

const ListenerItem = ({ player, faction }: { player: User; faction: Faction }) => {
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
                <Box width="90%" display="flex" alignItems="center">
                    <StyledImageText
                        key={player.gid}
                        text={
                            <>
                                {`${player.username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${player.gid}`}</span>
                            </>
                        }
                        color="#FFF"
                        imageUrl={faction.logo_url}
                        {...StyledImageText}
                    />
                </Box>
            </Box>
        </>
    )
}

const FactionCommanderJoinButton = ({ onJoinFactionCommander }: { onJoinFactionCommander: () => void }) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])
    const [confirmModal, setConfirmModal] = useState(false)

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
                    <Typography sx={{ textTransfrom: "uppercase" }}>FACTION COMMANDER VACANT</Typography>

                    <FancyButton
                        clipThingsProps={{
                            clipSize: "5px",
                            backgroundColor: colors.green,
                            border: { borderColor: colors.green, borderThickness: "1px" },
                            sx: { position: "relative" },
                        }}
                        sx={{ px: "1rem", pt: 0, pb: ".1rem", color: "#FFFFFF" }}
                        innerSx={{}}
                        onClick={() => setConfirmModal(true)}
                    >
                        become faction commander
                    </FancyButton>
                </Stack>
            </Box>

            {confirmModal && (
                <ConfirmModal
                    title="BECOME FACTION COMMANDER"
                    onConfirm={() => {
                        onJoinFactionCommander()
                        setConfirmModal(false)
                    }}
                    onClose={() => setConfirmModal(false)}
                >
                    <Typography variant="h6">
                        Becoming the Faction Commander will allow you to speak in the voice chat along side the mech opperators.
                        <br />
                        The active mech operators will have the choice to: vote to kick you as Faction Commander, which will result in a 24hr ban from becoming
                        Faction Commander again.
                    </Typography>
                </ConfirmModal>
            )}
        </>
    )
}
