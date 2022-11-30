import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { fonts } from "../../theme/theme"
import { LeaderboardRound } from "../../types"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { PlayerAbilityKills } from "./PlayerAbilityKills"
import { PlayerAbilityTriggers } from "./PlayerAbilityTriggers"
import { PlayerBattlesSpectated } from "./PlayerBattlesSpectated"
import { PlayerMechKills } from "./PlayerMechKills"
import { PlayerMechsOwned } from "./PlayerMechsOwned"
import { PlayerMechSurvives } from "./PlayerMechSurvives"
import { PlayerRepairBlocks } from "./PlayerRepairBlocks"

export enum LeaderboardTypeEnum {
    PlayerAbilityKills = "PlayerAbilityKills",
    PlayerBattlesSpectated = "PlayerBattlesSpectated",
    PlayerMechSurvives = "PlayerMechSurvives",
    PlayerMechKills = "PlayerMechKills",
    PlayerAbilityTriggers = "PlayerAbilityTriggers",
    PlayerMechsOwned = "PlayerMechsOwned",
    PlayerRepairBlocks = "PlayerRepairBlocks",
}

const sortOptions = [
    { label: "Player Ability Kills", value: LeaderboardTypeEnum.PlayerAbilityKills },
    { label: "Player Battles Spectated", value: LeaderboardTypeEnum.PlayerBattlesSpectated },
    { label: "Player Mech Survives", value: LeaderboardTypeEnum.PlayerMechSurvives },
    { label: "Player Mech Kills", value: LeaderboardTypeEnum.PlayerMechKills },
    { label: "Player Ability Triggers", value: LeaderboardTypeEnum.PlayerAbilityTriggers },
    { label: "Player Mechs Owned", value: LeaderboardTypeEnum.PlayerMechsOwned },
    { label: "Player Blocks Repaired", value: LeaderboardTypeEnum.PlayerRepairBlocks },
]

export const Leaderboard = () => {
    const { send } = useGameServerCommands("/public/commander")

    const [roundOptions, setRoundOptions] = useState<Map<string, LeaderboardRound>>(new Map())
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardTypeEnum>(LeaderboardTypeEnum.PlayerAbilityKills)
    const [selectedRound, setSelectedRound] = useState<LeaderboardRound>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<LeaderboardRound[]>(GameServerKeys.GetLeaderboardRounds)

                if (!resp) return
                setRoundOptions(new Map(resp.map((r) => [r.id, r])))
            } catch (err) {
                console.error(err)
            }
        })()
    }, [send])

    const { leaderboard, leaderboardTitle } = useMemo(() => {
        switch (leaderboardType) {
            case LeaderboardTypeEnum.PlayerAbilityKills:
                return {
                    leaderboard: <PlayerAbilityKills selectedRound={selectedRound} />,
                    leaderboardTitle: "MOST ABILITY KILLS",
                }
            case LeaderboardTypeEnum.PlayerBattlesSpectated:
                return {
                    leaderboard: <PlayerBattlesSpectated selectedRound={selectedRound} />,
                    leaderboardTitle: "MOST BATTLES SPECTATED",
                }
            case LeaderboardTypeEnum.PlayerMechSurvives:
                return {
                    leaderboard: <PlayerMechSurvives selectedRound={selectedRound} />,
                    leaderboardTitle: "MOST MECH SURVIVES",
                }
            case LeaderboardTypeEnum.PlayerMechKills:
                return {
                    leaderboard: <PlayerMechKills selectedRound={selectedRound} />,
                    leaderboardTitle: "MOST MECH KILLS",
                }
            case LeaderboardTypeEnum.PlayerAbilityTriggers:
                return {
                    leaderboard: <PlayerAbilityTriggers selectedRound={selectedRound} />,
                    leaderboardTitle: "MOST ABILITY TRIGGERS",
                }
            case LeaderboardTypeEnum.PlayerMechsOwned:
                return {
                    leaderboard: <PlayerMechsOwned />,
                    leaderboardTitle: "MOST MECHS OWNED",
                }
            case LeaderboardTypeEnum.PlayerRepairBlocks:
                return {
                    leaderboard: <PlayerRepairBlocks selectedRound={selectedRound} />,
                    leaderboardTitle: "MOST BLOCKS REPAIRED",
                }
            default:
                return {
                    leaderboard: null,
                    leaderboardTitle: "LEADERBOARD",
                }
        }
    }, [leaderboardType, selectedRound])

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                maxWidth: "190rem",
            }}
        >
            <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden", flex: 1, width: "100%" }}>
                <Typography variant="h2" sx={{ fontFamily: fonts.nostromoBlack }}>
                    {leaderboardTitle}
                </Typography>
                <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                    <NiceSelect
                        label="Display:"
                        options={sortOptions}
                        selected={leaderboardType}
                        onSelected={(value) => setLeaderboardType(value as LeaderboardTypeEnum)}
                        sx={{ minWidth: "26rem" }}
                    />
                    {roundOptions.size > 0 && leaderboardType !== LeaderboardTypeEnum.PlayerMechsOwned && (
                        <NiceSelect
                            label="Round:"
                            options={Array.from(roundOptions).map(([key, v]) => ({
                                value: key,
                                label: v.name,
                            }))}
                            selected={selectedRound?.id || Array.from(roundOptions)[0][0]}
                            onSelected={(value) => setSelectedRound(roundOptions.get(value))}
                            sx={{ minWidth: "26rem" }}
                        />
                    )}
                </Stack>
                <Box sx={{ flex: 1, overflowY: "auto" }}>{leaderboard}</Box>
            </Stack>
        </Stack>
    )
}
