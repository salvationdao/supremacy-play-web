import { Box, Button, IconButton, Popover, Slider, Stack, Typography } from "@mui/material"
import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgHeadphone, SvgMicrophone, SvgVolume, SvgVolumeMute } from "../../../assets"
import { useArena, useAuth, useSupremacy, VoiceStream } from "../../../containers"
import { OvenPlayerInstance } from "../../../containers/oven"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import { StyledImageText } from "../../Notifications/Common/StyledImageText"

export const VoiceChat = () => {
    const [open, setOpen] = useState(false)
    const popoverRef = useRef(null)

    const { getFaction } = useSupremacy()
    const { user, factionID } = useAuth()
    const { currentArenaID, setListenStreams, listenStreams, onListen, onDisconnect, connected } = useArena()

    // player voice chat data
    useGameServerSubscriptionSecuredUser<VoiceStream[]>(
        {
            URI: `/arena/${currentArenaID}`,
            key: GameServerKeys.SubPlayerVoiceStream,
            ready: !!(currentArenaID && factionID),
        },
        (payload: VoiceStream[]) => {
            setListenStreams(undefined)
            setListenStreams(payload)
        },
    )

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
                            connected={connected}
                            onDisconnect={onDisconnect}
                            faction={getFaction(user.faction_id)}
                            listenStreams={listenStreams || []}
                            onListen={onListen}
                            user={user}
                        />
                    }
                </Box>
            </Popover>

            <>
                {listenStreams &&
                    listenStreams.map((s) => {
                        return (
                            <Box
                                key={s.username + s.user_gid}
                                height="20rem"
                                width="20rem"
                                sx={{
                                    top: 0,
                                    // backgroundColor: "red",
                                    zIndex: 999,
                                }}
                            >
                                <div
                                    style={{
                                        width: "30rem !important",
                                        height: "30rem !important",
                                    }}
                                    id={s.listen_url}
                                    key={s.username + s.user_gid}
                                />
                            </Box>
                        )
                    })}
            </>
        </>
    )
}

const OvenStream = ({ voiceStream }: { voiceStream: VoiceStream }) => {
    // const {} = useArena()
    const ovenPlayer = useRef<OvenPlayerInstance>()

    const startStream = () => {
        if (document.getElementById(voiceStream.listen_url)) {
            const newOvenPlayer = OvenPlayer.create(voiceStream.listen_url, {
                autoStart: true,
                controls: true,
                volume: 100,
                sources: [
                    {
                        type: "webrtc",
                        file: voiceStream.listen_url,
                    },
                ],
                autoFallback: true,
                disableSeekUI: true,
            })

            newOvenPlayer.on("ready", () => {
                console.log("voice chat ready Ready.")
            })

            newOvenPlayer.on("error", (err: { code: number }) => {
                // if (!connected) return
                // if (err.code === 501) {
                //     console.log("501: failed to connnect attempting to recconnect", err)
                // } else {
                //     console.error("voice chat error: ", err)
                // }
                // try reconnect on error
                // setTimeout(() => {
                //     listen(stream)
                // }, 1000)
            })

            newOvenPlayer.play()
            ovenPlayer.current = newOvenPlayer

            return () => {
                newOvenPlayer.off("ready")
                newOvenPlayer.off("error")
                newOvenPlayer.remove()
            }
        }
    }

    const onMute = () => {
        console.log("muting", ovenPlayer)

        ovenPlayer.current?.setVolume(0)
    }
    useEffect(() => {
        startStream()
    }, [])

    return (
        <Box>
            <h1>{voiceStream.username}</h1>
            <Button onClick={onMute}>Mute</Button>
        </Box>
    )
}

export const VoiceChatInner = ({
    user,
    faction,
    onListen,
    onDisconnect,
    connected,
    listenStreams,
}: {
    onListen: (s: VoiceStream[]) => void
    onDisconnect: () => void
    connected: boolean
    listenStreams: VoiceStream[]
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
                                    Listen
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
                    <Box sx={{ height: 0 }}>
                        {listenStreams &&
                            listenStreams &&
                            listenStreams.map((s, idx) => {
                                return <PlayerItem user={user} voiceStream={s} faction={faction} key={idx} />
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

const PlayerItem = ({ voiceStream, user, faction }: { voiceStream: VoiceStream; user: User; faction: Faction }) => {
    const theme = useTheme()
    const bannerColor = useMemo(() => shadeColor(theme.factionTheme.primary, -70), [theme.factionTheme.primary])

    const { onMute } = useArena()

    // console.log("ov players", ovenPlayers)

    const [isMute, toggleIsMute] = useToggle(false)

    // const handleVolumeChange = useCallback(
    //     (_: Event, newValue: number | number[]) => {
    //         setVolume(newValue as number)
    //     },
    //     [setVolume],
    // )

    // useEffect(() => {
    //     if (!voiceStream.ovenPlayer) return
    //     if (isMute) {
    //         voiceStream.ovenPlayer.current.setVolume(0)
    //         return
    //     }
    //     console.log("vol: ", volume * 100)
    //     console.log("oven player volume ", voiceStream.ovenPlayer.current.getVolume())
    //     console.log("this is voice stream", voiceStream)

    //     voiceStream.ovenPlayer.current.setVolume(volume)
    // }, [volume, isMute])

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
                {/* <Box width="90%">
                    <StyledImageText
                        key={voiceStream.listen_url}
                        text={
                            <>
                                {`${voiceStream.username}`}
                                <span style={{ marginLeft: ".2rem", opacity: 0.8 }}>{`#${voiceStream.user_gid}`}</span>
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
                </Box> */}

                {/* {!voiceStream.send_url && (
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
                    <IconButton
                        size="small"
                        onClick={() => onMute(voiceStream.listen_url)}
                        sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                    >
                        {isMute || volume <= 0 ? <SvgVolumeMute size="2rem" sx={{ pb: 0 }} /> : <SvgVolume size="2rem" sx={{ pb: 0 }} />}
                    </IconButton>
                    </>
                )} */}
            </Box>
            <OvenStream voiceStream={voiceStream} />
        </>
    )
}
