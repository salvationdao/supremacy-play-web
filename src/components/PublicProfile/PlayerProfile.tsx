import { Avatar, Box, colors, Stack, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { SafePNG, SvgCake, WarMachineIconPNG } from "../../assets"
import { camelToTitle, snakeToTitle } from "../../helpers"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { fonts, theme } from "../../theme/theme"
import { BattleMechHistory, Faction, UserRank } from "../../types"
import { ClipThing } from "../Common/ClipThing"
import { PageHeader } from "../Common/PageHeader"
import { HistoryEntry } from "../Hangar/WarMachinesHangar/WarMachineDetails/Modals/MechHistory/HistoryEntry"
// import { HistoryEntry } from "./HistoryEntry"
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
                if (typeof e === "string") {
                    setProfileError(e)
                } else if (e instanceof Error) {
                    setProfileError(e.message)
                }
                setLoading(false)
            } finally {
                setLoading(false)
            }
        },
        [send],
    )

    useEffect(() => {
        fetchProfile(playerID)
    }, [playerID])

    const faction = profile?.faction
    const primaryColor = faction?.primary_color || theme.factionTheme.primary
    const backgroundColor = faction?.background_color || theme.factionTheme.background

    // if (loading) {
    //     return (
    //         <Stack alignItems="center" sx={{ width: "13rem" }}>
    //             <CircularProgress size="1.8rem" sx={{ color: primaryColor }} />
    //         </Stack>
    //     )
    // }
    if (!profile) {
        return <div></div>
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
                    {/* Mech avatar, label, name etc */}
                    <Stack spacing=".5rem"></Stack>

                    {/* Bar stats */}
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
                            <Stack direction="row">
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "5rem" }}>{profile.player.username}</Typography>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "5rem", color: primaryColor }}>#{profile.player.gid}</Typography>
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
                            ml: "1.9rem",
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
                            <Stack sx={{ p: "1rem 1rem" }}>
                                <Stack spacing=".5rem"></Stack>

                                <Stack>
                                    <Stack direction="column" spacing=".8rem">
                                        {/* <SvgStats fill={primaryColor} size="1.6rem" /> */}
                                        <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>Battle History</Typography>
                                        <PlayerMechHistory playerID={profile.player.id} />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>

                {/* Right side */}
                <Stack padding="1.6rem" spacing="1rem" sx={{ height: "100%", flex: 1, backgroundColor: backgroundColor }}>
                    <Stack spacing="1rem" direction="row" flexWrap={"wrap"}>
                        {/* Stats box */}
                        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
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

                                        <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                                            <Box
                                                sx={{
                                                    ml: "1.9rem",
                                                    mr: ".5rem",
                                                    pr: "1.4rem",
                                                    my: "1rem",
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
                                                <Box sx={{ height: "3rem", width: "100%", position: "relative" }}>
                                                    <Typography sx={{ color: "white", fontFamily: fonts.nostromoBlack }}>
                                                        Mech Kills: {profile.stats.mech_kill_count}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ height: "3rem", width: "100%", position: "relative" }}>
                                                    <Typography sx={{ color: "white", fontFamily: fonts.nostromoBlack }}>
                                                        Abilities: {profile.stats.total_ability_triggered}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ height: "3rem", width: "100%", position: "relative" }}>
                                                    <Typography sx={{ color: "white", fontFamily: fonts.nostromoBlack }}>
                                                        Ability Kills: {profile.stats.ability_kill_count}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ height: "3rem", width: "100%", position: "relative" }}>
                                                    <Typography sx={{ color: "white", fontFamily: fonts.nostromoBlack }}>
                                                        Battles Spectated: {profile.stats.view_battle_count}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </ClipThing>
                        </Stack>
                    </Stack>

                    {/* war machines */}
                    <PublicWarmachines playerID={profile.player.id} backgroundColour={backgroundColor} primaryColour={primaryColor} />
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
