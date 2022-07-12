import { Avatar, Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { SvgAbility, SvgCake, SvgDeath, SvgSkull2, SvgView, WarMachineIconPNG } from "../../assets"
import { useAuth, useSnackbar } from "../../containers"
import { getUserRankDeets, snakeToTitle, timeSince } from "../../helpers"
import { useGameServerCommands, useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, theme } from "../../theme/theme"
import { Faction, UserRank } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { PageHeader } from "../Common/PageHeader"
import { AboutMe } from "./ProfileAboutMe"
import { ProfileMechHistory } from "./ProfileBattleHistory"
import { Username } from "./ProfileUsername"
import { ProfileWarmachines } from "./ProfileWarmachines"

interface Player {
    id: string
    username: string
    about_me: string
    avatar_id: string
    faction_id: string
    gid: number
    mobile_number?: string
    rank: UserRank
    created_at: Date
}

interface Stats {
    view_battle_count: number
    ability_kill_count: number
    total_ability_triggered: number
    mech_kill_count: number
}
interface PlayerProfile {
    player: Player
    stats: Stats
    faction?: Faction
    active_log?: {
        active_at: Date
    }
}

const cakeDay = (d: Date) => {
    const now = new Date()
    const result = d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    return result
}

const getOnlineStatus = (time: Date): { status: string; colour: string } => {
    const { days, minutes, hours } = timeSince(time, new Date())

    // online less then 5 mins ago
    if (hours < 1 && minutes <= 5) {
        return { status: "Online", colour: colors.green }
    }

    // online between 5 mins and 15 mins ago
    if (hours < 1 && minutes > 5 && minutes <= 15) {
        return { status: "Online 10 minutes ago", colour: colors.orange }
    }

    // online between 15 mins and 30 mins ago
    if (hours < 1 && minutes > 15 && minutes <= 30) {
        return { status: "Online 30 minutes ago", colour: colors.orange }
    }

    // online between 30 mins and 60 mins ago
    if (minutes > 30 && minutes <= 60) {
        return { status: "Online 1 hour ago", colour: colors.orange }
    }

    // offline for more than an hour
    if (hours >= 1 && hours <= 24) {
        return { status: `Online ${hours} hour(s) ago`, colour: colors.red }
    }

    return { status: `Online ${days} day(s) ago`, colour: colors.red }
}

export const PlayerProfilePage = () => {
    const { playerGID } = useParams<{ playerGID: string }>()
    const { user } = useAuth()
    const history = useHistory()
    const [loading, setLoading] = useState(false)

    const [profileError, setProfileError] = useState<string>()

    const [profile, setProfile] = useState<PlayerProfile>()
    const [username, setUsername] = useState<string>()
    const [aboutMe, setAboutMe] = useState<string>()

    const { send } = useGameServerCommands("/public/commander")
    const { send: userSend } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useSnackbar()
    const isMe = `${user?.gid}` === playerGID

    const rankDeets = useMemo(() => (profile?.player.rank ? getUserRankDeets(profile?.player.rank, "1.6rem", "1.6rem") : undefined), [profile?.player.rank])

    const onlineStatus = useMemo(
        () => (profile?.active_log?.active_at ? getOnlineStatus(profile?.active_log?.active_at) : undefined),
        [profile?.active_log?.active_at],
    )

    // username
    const updateUsername = useCallback(
        async (newUsername: string) => {
            try {
                const resp = await userSend<{ Username: string }>(GameServerKeys.PlayerProfileUpdateUsername, {
                    player_id: profile?.player.id,
                    new_username: newUsername,
                })
                setUsername(resp.Username)
                newSnackbarMessage("username updated successfully.", "success")
            } catch (e) {
                let errorMessage = ""
                if (typeof e === "string") {
                    errorMessage = e
                } else if (e instanceof Error) {
                    errorMessage = e.message
                }
                newSnackbarMessage(errorMessage, "error")
            }
        },
        [userSend, profile?.player.id, newSnackbarMessage],
    )

    // about me
    const updateAboutMe = useCallback(
        async (newAboutMe: string) => {
            try {
                const resp = await userSend<{ about_me: string }>(GameServerKeys.PlayerProfileUpdateAboutMe, {
                    player_id: profile?.player.id,
                    about_me: newAboutMe,
                })
                setAboutMe(resp.about_me)
                newSnackbarMessage("about me updated successfully.", "success")
            } catch (e) {
                let errorMessage = ""
                if (typeof e === "string") {
                    errorMessage = e
                } else if (e instanceof Error) {
                    errorMessage = e.message
                }
                newSnackbarMessage(errorMessage, "error")
            }
        },
        [userSend, profile?.player.id, newSnackbarMessage],
    )

    // sub to player profile
    const fetchProfile = useCallback(
        async (id: string) => {
            try {
                setLoading(true)
                const resp = await send<PlayerProfile>(GameServerKeys.PlayerProfileGet, {
                    player_gid: id,
                })
                setProfile(resp)
                setUsername(resp.player.username)
                setAboutMe(resp.player.about_me)
                setLoading(false)
            } catch (e) {
                let errorMessage = ""
                if (typeof e === "string") {
                    errorMessage = e
                } else if (e instanceof Error) {
                    errorMessage = e.message
                }
                setProfileError(errorMessage)
                setLoading(false)

                // push to /404 if player doesnt exist
                if (errorMessage.toLowerCase() === "sql: no rows in result set") {
                    history.push("/404")
                }
            } finally {
                setLoading(false)
            }
        },
        [send, history],
    )

    useEffect(() => {
        fetchProfile(playerGID)
    }, [playerGID, fetchProfile])

    const faction = profile?.faction
    const primaryColor = faction?.primary_color || theme.factionTheme.primary
    const backgroundColor = faction?.background_color || theme.factionTheme.background

    if (loading) {
        return (
            <Stack alignItems="center" justifyContent={"center"} sx={{ width: "100%", height: "100%" }}>
                <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                <Typography sx={{ fontFamily: fonts.nostromoBlack, mr: "1rem", mt: "3rem" }}>Loading Profile</Typography>
            </Stack>
        )
    }
    if ((!loading && profileError) || !profile) {
        return (
            <Stack sx={{ flex: 1, px: "1rem" }}>
                <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{profileError}</Typography>
            </Stack>
        )
    }

    return (
        <Stack
            direction="column"
            sx={{
                height: "100%",
                "@media (max-width:1300px)": {
                    overflowY: "auto",
                },
            }}
        >
            {/* top part */}
            <Stack
                padding="1rem"
                sx={{
                    backgroundImage: `url(${faction?.wallpaper_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    height: "55.5rem",
                    position: "relative",
                }}
            >
                <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                    <Stack spacing=".5rem"></Stack>
                    <Stack spacing="1.8rem">
                        <Stack>
                            <Stack direction={"row"}>
                                <Avatar
                                    src={faction?.logo_url}
                                    alt={`${profile.player.username}'s Avatar`}
                                    sx={{
                                        mr: "1rem",
                                        height: "7rem",
                                        width: "7rem",
                                        borderRadius: 1,
                                        border: `${primaryColor} 2px solid`,
                                        backgroundColor: primaryColor,
                                    }}
                                    variant="square"
                                />
                                {isMe && (
                                    <Typography sx={{ WebkitTextStroke: "1px black", fontFamily: fonts.nostromoBlack, fontSize: "5rem", color: primaryColor }}>
                                        my profile
                                    </Typography>
                                )}
                            </Stack>

                            <Stack direction="row" alignItems={"center"}>
                                <Username
                                    hide={!isMe}
                                    userID={profile.player.id}
                                    updateUsername={async (name: string) => {
                                        updateUsername(name)
                                    }}
                                    primaryColour={primaryColor}
                                    gid={profile.player.gid}
                                    username={username || ""}
                                />
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing="1rem">
                            {rankDeets?.icon}
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{snakeToTitle(profile.player.rank)}</Typography>
                        </Stack>

                        {profile.active_log?.active_at && (
                            <Stack direction="row" spacing="1rem" alignItems={"center"}>
                                <Box
                                    width="1rem"
                                    height="1rem"
                                    ml="3px"
                                    sx={{
                                        borderRadius: "100%",
                                        backgroundColor: onlineStatus?.colour,
                                    }}
                                />
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{onlineStatus?.status}</Typography>
                            </Stack>
                        )}
                        <Stack direction="row" spacing="1rem">
                            {cakeDay(profile.player.created_at) && <SvgCake size="1.9rem" sx={{ mb: "2rem" }} />}
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Joined {profile.player.created_at.toLocaleDateString()}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Stack
                direction="row"
                sx={{
                    height: "100%",
                    background: primaryColor,

                    "@media (max-width:1300px)": {
                        flexDirection: "column",
                    },
                }}
            >
                {/* left side */}
                <Stack
                    direction="row"
                    sx={{
                        backgroundColor: "rgba(0, 0, 0, .97)",

                        flexShrink: 0,
                        height: "100%",
                        width: "62rem",
                        "@media (max-width:1300px)": {
                            width: "100%",
                            height: "50%",
                        },
                    }}
                >
                    {/* About me */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            mt: ".4rem",
                            mb: ".8rem",
                            direction: "ltr",
                            scrollbarWidth: "none",
                            "::-webkit-scrollbar": {
                                width: ".4rem",
                            },
                            "::-webkit-scrollbar-track": {
                                background: "#FFFFFF15",
                                borderRadius: 3,
                            },
                            "::-webkit-scrollbar-thumb": {
                                background: primaryColor,
                                borderRadius: 3,
                            },
                        }}
                    >
                        <Box sx={{ direction: "ltr", height: 0, width: "100%" }}>
                            <Stack direction="column" spacing="1.6rem">
                                <PageHeader title="ABOUT ME" description="" primaryColor={primaryColor} imageUrl={WarMachineIconPNG} />
                                <Stack sx={{ p: "1rem 3rem" }}>
                                    <AboutMe
                                        hide={!isMe}
                                        updateAboutMe={async (name: string) => {
                                            updateAboutMe(name)
                                        }}
                                        aboutMe={aboutMe || ""}
                                    />
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>

                {/* Right side */}
                <Stack
                    direction="row"
                    padding="1.6rem"
                    alignItems="flex-start"
                    spacing="1rem"
                    sx={{
                        flex: 1,
                        backgroundColor: backgroundColor,
                        "@media (max-width:900px)": {
                            flexDirection: "column",
                        },
                    }}
                >
                    <Stack
                        direction="column"
                        spacing="1rem"
                        sx={{
                            alignItems: "stretch",
                            justifyContent: "flex-start",
                            width: "45rem",
                            "@media (max-width:900px)": {
                                width: "100%",
                                pt: "1rem !important",
                            },
                        }}
                    >
                        <ClipThing
                            clipSize="10px"
                            border={{
                                borderColor: primaryColor,
                                borderThickness: ".3rem",
                            }}
                            opacity={0.7}
                            backgroundColor={backgroundColor}
                            sx={{ flex: 1 }}
                        >
                            <Stack sx={{ position: "relative", height: "100%" }}>
                                <Stack sx={{ flex: 1 }}>
                                    <PageHeader title="Stats" description="" primaryColor={primaryColor} imageUrl={WarMachineIconPNG} />
                                    <Stack sx={{ flex: 1 }}>
                                        <Stack
                                            sx={{
                                                flex: 1,
                                                overflowY: "auto",
                                                overflowX: "hidden",
                                                direction: "ltr",

                                                "::-webkit-scrollbar": {
                                                    width: ".4rem",
                                                },
                                                "::-webkit-scrollbar-track": {
                                                    background: "#FFFFFF15",
                                                    borderRadius: 3,
                                                },
                                                "::-webkit-scrollbar-thumb": {
                                                    background: primaryColor,
                                                    borderRadius: 3,
                                                },
                                            }}
                                        >
                                            <StatItem
                                                label="Abilities"
                                                value={profile.stats.total_ability_triggered}
                                                icon={<SvgAbility size="1.7rem" sx={{ pb: ".4rem" }} />}
                                            />
                                            <StatItem
                                                label="Mech Kills"
                                                value={profile.stats.mech_kill_count}
                                                icon={<SvgSkull2 size="1.7rem" sx={{ pb: ".4rem" }} />}
                                            />
                                            <StatItem
                                                label="Ability Kills"
                                                value={profile.stats.ability_kill_count}
                                                icon={<SvgDeath size="1.7rem" sx={{ pb: ".4rem" }} />}
                                            />
                                            <StatItem
                                                label="Spectated"
                                                value={profile.stats.view_battle_count}
                                                icon={<SvgView size="1.7rem" sx={{ pb: ".4rem" }} />}
                                            />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ClipThing>

                        <ClipThing
                            clipSize="10px"
                            border={{
                                borderColor: primaryColor,
                                borderThickness: ".3rem",
                            }}
                            opacity={0.7}
                            backgroundColor={backgroundColor}
                            sx={{ flex: 1 }}
                        >
                            <Stack sx={{ position: "relative" }}>
                                <Stack sx={{ flex: 1 }}>
                                    <PageHeader title="Battle History" description="" primaryColor={primaryColor} imageUrl={WarMachineIconPNG} />
                                    <Stack sx={{ flex: 1 }}>
                                        <Stack
                                            spacing="1rem"
                                            sx={{
                                                maxHeight: "40rem",
                                                px: "1rem",
                                                flex: 1,

                                                overflowY: "auto",
                                                overflowX: "hidden",
                                                direction: "ltr",

                                                "::-webkit-scrollbar": {
                                                    width: ".4rem",
                                                },
                                                "::-webkit-scrollbar-track": {
                                                    background: "#FFFFFF15",
                                                    borderRadius: 3,
                                                },
                                                "::-webkit-scrollbar-thumb": {
                                                    background: primaryColor,
                                                    borderRadius: 3,
                                                },
                                            }}
                                        >
                                            <ProfileMechHistory playerID={profile.player.id} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ClipThing>
                    </Stack>

                    {/* war machines */}
                    <Stack
                        direction="row"
                        spacing="1rem"
                        sx={{
                            height: "100%",
                            width: "100%",
                            "@media (max-width:900px)": {
                                marginTop: "1rem !important",
                                marginLeft: "0 !important",
                                height: "60rem",
                            },
                        }}
                    >
                        <ProfileWarmachines playerID={profile.player.id} backgroundColour={backgroundColor} primaryColour={primaryColor} />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

interface StatItemProps {
    label: string
    value: number
    icon: React.ReactNode
}

export const StatItem = ({ label, value, icon }: StatItemProps) => {
    const statusColor = colors.grey

    return (
        <ClipThing
            clipSize="10px"
            border={{
                isFancy: true,
                borderColor: statusColor,
                borderThickness: ".2rem",
            }}
            corners={{}}
            opacity={0.7}
            backgroundColor="#000000"
            sx={{ flexShrink: 0 }}
        >
            <Stack
                spacing="2rem"
                direction="row"
                sx={{
                    position: "relative",
                    p: "1rem 1.6rem",
                }}
            >
                <Stack
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: `linear-gradient(60deg, rgba(0, 0, 0, 0.6) 30%, ${statusColor}60)`,
                        zIndex: -1,
                    }}
                />

                <Stack
                    alignContent={"space-between"}
                    sx={{
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        opacity: 0.2,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        zIndex: -2,
                    }}
                />

                {icon}

                <Box>
                    <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>
                </Box>

                <Stack alignItems="flex-end" alignSelf="center" sx={{ ml: "auto" }}>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: colors.lightGrey,
                        }}
                    >
                        {value}
                    </Typography>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
