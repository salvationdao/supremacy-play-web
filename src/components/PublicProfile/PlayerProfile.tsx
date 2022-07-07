import { Avatar, Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { SvgAbility, SvgCake, SvgDeath, SvgSkull2, SvgView, WarMachineIconPNG } from "../../assets"
import { camelToTitle, snakeToTitle } from "../../helpers"
import { useToggle } from "../../hooks"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, theme } from "../../theme/theme"
import { BattleMechHistory, Faction, UserRank } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { PageHeader } from "../Common/PageHeader"
import { HistoryEntry } from "../Hangar/WarMachinesHangar/WarMachineDetails/Modals/MechHistory/HistoryEntry"
import { PublicWarmachines } from "./PublicWarmachines"

interface Player {
    id: string
    username: string
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
}

const cakeDay = (d: Date) => {
    const now = new Date()
    const result = d.getDate() === now.getDate() && d.getMonth() === now.getMonth()
    return result
}
export const PlayerProfilePage = () => {
    const { playerID } = useParams<{ playerID: string }>()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [profileError, setProfileError] = useState<string>()
    const [profile, setProfile] = useState<PlayerProfile>()

    const [copySuccess, toggleCopySuccess] = useToggle()

    useEffect(() => {
        if (copySuccess) {
            const timeout = setTimeout(() => {
                toggleCopySuccess(false)
            }, 900)

            return () => clearTimeout(timeout)
        }
    }, [copySuccess, toggleCopySuccess])

    const { send } = useGameServerCommands("/public/commander")

    // sub to player profile
    const fetchProfile = useCallback(
        async (id: string) => {
            try {
                setLoading(true)
                const resp = await send<PlayerProfile>(GameServerKeys.PlayerProfileGet, {
                    player_gid: id,
                })

                setProfile(resp)
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
        fetchProfile(playerID)
    }, [playerID, fetchProfile])

    const faction = profile?.faction
    const primaryColor = faction?.primary_color || theme.factionTheme.primary
    const backgroundColor = faction?.background_color || theme.factionTheme.background

    if (loading) {
        return (
            <Stack alignItems="center" justifyContent={"center"} sx={{ width: "100%", height: "100%" }}>
                <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                <Typography sx={{ fontFamily: fonts.nostromoBlack, mr: "1rem" }}>Loading Profile</Typography>
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
        <Stack direction="column" sx={{ height: "100%" }}>
            {/* top part */}
            <Stack
                padding="1rem"
                sx={{
                    backgroundImage: `url(${faction?.background_url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    height: "60.5rem",
                    position: "relative",
                }}
            >
                <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                    <Stack spacing=".5rem"></Stack>
                    <Stack spacing="1.8rem">
                        <Stack>
                            <Avatar
                                src={faction?.logo_url}
                                alt={`${profile.player.username}'s Avatar`}
                                sx={{
                                    height: "7rem",
                                    width: "7rem",
                                    borderRadius: 1,
                                    border: `${primaryColor} 2px solid`,
                                    backgroundColor: primaryColor,
                                }}
                                variant="square"
                            />
                            <Stack
                                direction="row"
                                alignItems={"center"}
                                sx={{ cursor: "pointer", ":hover": { opacity: 0.8 } }}
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href).then(
                                        () => toggleCopySuccess(true),
                                        () => toggleCopySuccess(false),
                                    )
                                }}
                            >
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "5rem" }}>{profile.player.username}</Typography>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "5rem", color: primaryColor }}>#{profile.player.gid}</Typography>

                                {copySuccess && (
                                    <Typography
                                        sx={{
                                            fontFamily: fonts.nostromoBold,
                                            marginTop: ".5rem",
                                            marginLeft: "1rem",
                                            fontSize: "2rem",
                                        }}
                                    >
                                        profile link copied
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{snakeToTitle(profile.player.rank)}</Typography>

                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ fontFamily: fonts.nostromoBlack, mr: "1rem" }}>
                                Joined {profile.player.created_at.toLocaleDateString()}
                            </Typography>
                            {cakeDay(profile.player.created_at) && <SvgCake size="2.5rem" sx={{ mb: ".8rem" }} />}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            <Stack direction="row" sx={{ height: "100%", background: primaryColor }}>
                {/* left side */}
                <Stack
                    sx={{
                        backgroundColor: "rgba(0, 0, 0, .97)",

                        flexShrink: 0,
                        height: "100%",
                        width: "62rem",
                    }}
                >
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
                        <Box sx={{ direction: "ltr", height: 0 }}>
                            <Stack direction="column" spacing="1.6rem">
                                <PageHeader title="BATTLE HISTORY" description="" primaryColor={primaryColor} imageUrl={WarMachineIconPNG} />
                                <Stack sx={{ p: "1rem 1rem" }}>
                                    <PlayerMechHistory playerID={profile.player.id} />
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>

                {/* Right side */}
                <Stack direction="row" padding="1.6rem" spacing="1rem" sx={{ height: "100%", flex: 1, backgroundColor: backgroundColor }}>
                    <Stack spacing="1rem" direction="row" flexWrap={"wrap"}>
                        {/* Stats box */}
                        <Stack direction="row" spacing="1rem" sx={{ height: "100%", width: "40rem" }}>
                            <ClipThing
                                clipSize="10px"
                                border={{
                                    borderColor: primaryColor,
                                    borderThickness: ".3rem",
                                }}
                                opacity={0.7}
                                backgroundColor={backgroundColor}
                                sx={{ height: "100%", flex: 1 }}
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
                        </Stack>
                    </Stack>

                    {/* war machines */}
                    <Stack direction="row" spacing="1rem" sx={{ height: "100%", width: "100%" }}>
                        <PublicWarmachines playerID={profile.player.id} backgroundColour={backgroundColor} primaryColour={primaryColor} />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

const PlayerMechHistory = ({ playerID }: { playerID: string }) => {
    const { send } = useGameServerCommands("/public/commander")

    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    // get history
    const fetchHistory = useCallback(async () => {
        try {
            setHistoryLoading(true)
            const resp = await send<{
                total: number
                battle_history: BattleMechHistory[]
            }>(GameServerKeys.PlayerBattleMechHistoryList, {
                player_id: playerID,
            })

            setHistory(resp.battle_history)
        } catch (e) {
            if (typeof e === "string") {
                setHistoryError(e)
            } else if (e instanceof Error) {
                setHistoryError(e.message)
            }
        } finally {
            setHistoryLoading(false)
        }
    }, [playerID, send])

    useEffect(() => {
        fetchHistory()
    }, [send, fetchHistory])

    if (historyLoading) {
        return (
            <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                <CircularProgress size="2rem" sx={{ mt: "2rem", color: theme.factionTheme.primary }} />
            </Stack>
        )
    }
    if (!historyLoading && historyError) {
        return (
            <Stack sx={{ flex: 1, px: "1rem" }}>
                <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{historyError}</Typography>
            </Stack>
        )
    }

    return (
        <Stack sx={{ height: "100%" }}>
            <Stack spacing="1.6rem">
                {history.map((h, idx) => {
                    return (
                        <HistoryEntry
                            mech={h.mech}
                            key={idx}
                            mapName={camelToTitle(h.battle?.game_map?.name || "Unknown")}
                            backgroundImage={h.battle?.game_map?.image_url}
                            mechSurvived={!!h.mech_survived}
                            status={!h.battle?.battle?.ended_at ? "pending" : h.faction_won ? "won" : "lost"}
                            kills={h.kills}
                            date={h.created_at}
                        />
                    )
                })}
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
