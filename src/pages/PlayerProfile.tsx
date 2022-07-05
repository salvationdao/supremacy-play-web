import { Avatar, Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { SvgStats } from "../assets"
import { ClipThing } from "../components"
import { PublicWarmachines } from "../components/Hangar/WarMachinesHangar/PublicWarmachines"
import { dateFormatter } from "../helpers"
import { useGameServerCommands } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { fonts, theme } from "../theme/theme"
import { Faction, UserRank } from "../types"

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

export const PlayerProfilePage = () => {
    const { playerID } = useParams<{ playerID: string }>()
    console.log("this is player id", playerID)

    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [profileError, setProfileError] = useState<string>()
    const [profile, setProfile] = useState<PlayerProfile>()

    const { send } = useGameServerCommands("/public/commander")

    // sub to player profile
    const fetchProfile = useCallback(
        async (id: string) => {
            try {
                console.log("in here")

                setLoading(true)
                const resp = await send<PlayerProfile>(GameServerKeys.PlayerProfileGet, {
                    player_gid: id,
                })

                console.log("this is resp", resp.player)

                setProfile(resp)
            } catch (e) {
                if (typeof e === "string") {
                    setProfileError(e)
                } else if (e instanceof Error) {
                    setProfileError(e.message)
                }
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

    console.log("set player", profile)

    if (!profile) {
        return <div></div>
    }

    return (
        <Stack direction="column" spacing="1rem" sx={{ height: "100%" }}>
            {/* top part */}
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: primaryColor,
                    borderThickness: ".3rem",
                }}
                corners={{
                    topRight: true,
                    bottomLeft: true,
                    bottomRight: true,
                }}
                opacity={0.7}
                backgroundColor={backgroundColor}
            >
                <Stack padding="1rem" sx={{ height: "60.5rem", position: "relative", borderBottom: `${primaryColor}50 1.5px solid` }}>
                    <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                        {/* Mech avatar, label, name etc */}

                        <Stack spacing=".5rem"></Stack>

                        {/* Bar stats */}
                        <Stack spacing=".5rem">
                            <Stack>
                                <Avatar
                                    src={faction?.logo_url}
                                    alt={`${profile.player.username}'s Avatar`}
                                    sx={{
                                        height: "7rem",
                                        width: "7rem",
                                        borderRadius: 1,
                                        border: (theme) => `${primaryColor} 2px solid`,
                                        backgroundColor: (theme) => primaryColor,
                                    }}
                                    variant="square"
                                />
                                <Typography sx={{ fontFamily: fonts.nostromoBlack, fontSize: "5rem" }}>
                                    {profile.player.username}#{profile.player.gid}
                                </Typography>
                            </Stack>
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{profile.player.rank}</Typography>
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{faction?.label}</Typography>
                            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>Joined {profile.player.created_at.toLocaleDateString()}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </ClipThing>

            <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
                {/* Left side */}
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    opacity={0.7}
                    backgroundColor={backgroundColor}
                    sx={{ flexShrink: 0, height: "100%", width: "42rem" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                ml: "1.9rem",
                                pr: "1.4rem",
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
                                <Stack spacing="1.6rem" sx={{ p: "1rem 1rem" }}>
                                    {/* Mech avatar, label, name etc */}

                                    <Stack spacing=".5rem"></Stack>

                                    {/* Bar stats */}
                                    <Stack spacing=".5rem">
                                        <Stack direction="row" spacing=".8rem" alignItems="center">
                                            <SvgStats fill={primaryColor} size="1.6rem" />
                                            <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>About Me</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </ClipThing>

                {/* Right side */}
                <ClipThing
                    innerSx={{ padding: "1rem" }}
                    clipSize="10px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    opacity={0.7}
                    backgroundColor={backgroundColor}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack spacing="1rem" direction="row" flexWrap={"wrap"}>
                        <Box sx={{ padding: "2rem", width: "60.5rem", position: "relative" }}>
                            {/* Stats */}
                            <ClipThing
                                clipSize="10px"
                                border={{
                                    borderColor: primaryColor,
                                    borderThickness: ".3rem",
                                }}
                                opacity={0.7}
                                backgroundColor={backgroundColor}
                                sx={{ padding: "2rem", height: "100%", flex: 1 }}
                            >
                                {/*  borderBottom: `${primaryColor}50 1.5px solid` */}
                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                        Mech Kills: {profile.stats.mech_kill_count}
                                    </Typography>
                                </Box>

                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                        Abilities: {profile.stats.total_ability_triggered}
                                    </Typography>
                                </Box>
                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                        Ability Kills: {profile.stats.ability_kill_count}
                                    </Typography>
                                </Box>

                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                                        Battles Spectated: {profile.stats.view_battle_count}
                                    </Typography>
                                </Box>
                            </ClipThing>
                        </Box>

                        <Box sx={{ padding: "2rem", width: "60.5rem", position: "relative" }}>
                            {/* Stats */}
                            <ClipThing
                                clipSize="10px"
                                border={{
                                    borderColor: primaryColor,
                                    borderThickness: ".3rem",
                                }}
                                opacity={0.7}
                                backgroundColor={backgroundColor}
                                sx={{ padding: "2rem", height: "100%", flex: 1 }}
                            >
                                {/*  borderBottom: `${primaryColor}50 1.5px solid` */}
                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>Mech Kills:</Typography>
                                </Box>

                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>Abilities:</Typography>
                                </Box>
                                <Box sx={{ height: "8rem", width: "100%", position: "relative" }}>
                                    <Typography sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>Ability Kills:</Typography>
                                </Box>
                            </ClipThing>
                        </Box>
                    </Stack>

                    <Stack padding={"1.6rem"}>
                        <PublicWarmachines playerID={profile.player.id} />
                    </Stack>
                </ClipThing>
            </Stack>
        </Stack>
    )
}
