import { Box, Button, IconButton, Slider, Stack, Typography } from "@mui/material"
import OvenLiveKit from "ovenlivekit"
import OvenPlayer from "ovenplayer"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useArena, useAuth, useChat, useSupremacy, VoiceStream } from "../../../containers"
import { OvenPlayerInstance } from "../../../containers/oven"
import { useTheme } from "../../../containers/theme"
import { acronym, shadeColor } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { Faction, User } from "../../../types"
import { StyledImageText } from "../../Notifications/Common/StyledImageText"
import { useToggle } from "../../../hooks"
import { SvgVolume, SvgVolumeMute } from "../../../assets"

export const VoiceChat = ({
    onListen,
    listenStreams,
    user,
    faction,
}: {
    onListen: (s: VoiceStream[]) => void
    listenStreams: VoiceStream[]
    user: User
    faction: Faction
}) => {
    return (
        <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
            <Content listenStreams={listenStreams} onListen={onListen} faction={faction} user={user} activePlayers={[]} />
        </Stack>
    )
}

const Content = ({
    faction,
    user,
    activePlayers,
    listenStreams,
    onListen,
}: {
    faction: Faction
    user: User
    activePlayers: User[]
    listenStreams: VoiceStream[] | undefined
    onListen: (stream: VoiceStream[]) => void
}) => {
    const { onDisconnect, connected } = useArena()

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
                            <Button onClick={onDisconnect}>Disconnect</Button>
                        ) : (
                            <Button
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
                        background: (theme) => theme.factionTheme.primary,
                    },
                }}
            >
                <Box sx={{ height: 0 }}>
                    {listenStreams &&
                        listenStreams.map((s, idx) => {
                            return <PlayerItem voiceStream={s} faction={faction} key={idx} />
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
                            //
                        }}
                        sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                    >
                        <SvgVolume size="2rem" sx={{ pb: 0 }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => {
                            //
                        }}
                        sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                    >
                        <SvgVolume size="2rem" sx={{ pb: 0 }} />
                    </IconButton>{" "}
                    <IconButton
                        size="small"
                        onClick={() => {
                            //
                        }}
                        sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}
                    >
                        <SvgVolume size="2rem" sx={{ pb: 0 }} />
                    </IconButton>
                </Stack>
            </Stack>
        </Stack>
    )
}

const PlayerItem = ({ voiceStream, faction }: { voiceStream: VoiceStream; faction: Faction }) => {
    const [isMute, toggleIsMute] = useToggle(false)
    const [volume, setVolume] = useState(100)

    const handleVolumeChange = useCallback(
        (_: Event, newValue: number | number[]) => {
            setVolume(newValue as number)
        },
        [setVolume],
    )

    useEffect(() => {
        if (!voiceStream.ovenPlayer) return
        if (isMute) {
            voiceStream.ovenPlayer.setVolume(0)
            return
        }

        voiceStream.ovenPlayer.setVolume(volume * 100)
    }, [volume, isMute])

    return (
        <Box ml="1.5rem" mt="1rem" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box width="15rem">
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
                            backgroundColor: voiceStream.ovenPlayer.getState() === "playing" ? colors.green : colors.red,
                        }}
                    />
                )}
            </Box>

            {!voiceStream.send_url && (
                <>
                    <Slider
                        // disabled={ }
                        size="small"
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label="Volume"
                        value={isMute ? 0 : volume}
                        onChange={handleVolumeChange}
                        sx={{
                            ml: "1.2rem",
                            color: (theme) => theme.factionTheme.primary,
                        }}
                    />
                    <IconButton size="small" onClick={() => toggleIsMute()} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                        {isMute || volume <= 0 ? <SvgVolumeMute size="2rem" sx={{ pb: 0 }} /> : <SvgVolume size="2rem" sx={{ pb: 0 }} />}
                    </IconButton>
                </>
            )}
        </Box>
    )
}
