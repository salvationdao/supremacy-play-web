import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { ClipThing } from "../.."
import { Gabs } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { LeaderboardRound } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { LeaderboardSelect, LeaderboardTypeEnum } from "./Common/LeaderboardSelect"
import { RoundSelect } from "./Common/RoundSelect"
import { PlayerAbilityKills } from "./PlayerAbilityKills"
import { PlayerAbilityTriggers } from "./PlayerAbilityTriggers"
import { PlayerBattlesSpectated } from "./PlayerBattlesSpectated"
import { PlayerMechKills } from "./PlayerMechKills"
import { PlayerMechsOwned } from "./PlayerMechsOwned"
import { PlayerMechSurvives } from "./PlayerMechSurvives"
import { PlayerRepairBlocks } from "./PlayerRepairBlocks"

export const GlobalStats = () => {
    const theme = useTheme()
    const { send } = useGameServerCommands("/public/commander")
    const [roundOptions, setRoundOptions] = useState<LeaderboardRound[]>()
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardTypeEnum>(LeaderboardTypeEnum.PlayerAbilityKills)
    const [selectedRound, setSelectedRound] = useState<LeaderboardRound>()

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<LeaderboardRound[]>(GameServerKeys.GetLeaderboardRounds)

                if (!resp) return
                setRoundOptions(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [send])

    const leaderboard = useMemo(() => {
        switch (leaderboardType) {
            case LeaderboardTypeEnum.PlayerAbilityKills:
                return <PlayerAbilityKills selectedRound={selectedRound} />
            case LeaderboardTypeEnum.PlayerBattlesSpectated:
                return <PlayerBattlesSpectated selectedRound={selectedRound} />
            case LeaderboardTypeEnum.PlayerMechSurvives:
                return <PlayerMechSurvives selectedRound={selectedRound} />
            case LeaderboardTypeEnum.PlayerMechKills:
                return <PlayerMechKills selectedRound={selectedRound} />
            case LeaderboardTypeEnum.PlayerAbilityTriggers:
                return <PlayerAbilityTriggers selectedRound={selectedRound} />
            case LeaderboardTypeEnum.PlayerMechsOwned:
                return <PlayerMechsOwned />
            case LeaderboardTypeEnum.PlayerRepairBlocks:
                return <PlayerRepairBlocks selectedRound={selectedRound} />

            default:
                return null
        }
    }, [leaderboardType, selectedRound])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.9}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ position: "relative", height: "100%" }}>
                <Stack sx={{ flex: 1 }}>
                    <PageHeader
                        title={
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                GLOBAL LEADERBOARD
                            </Typography>
                        }
                        description={
                            <Typography sx={{ fontSize: "1.85rem" }}>
                                GABS monitors all players in Supremacy, explore the ranks and see who is on top.
                            </Typography>
                        }
                        imageUrl={Gabs}
                    ></PageHeader>

                    <Stack
                        spacing="2.6rem"
                        direction="row"
                        alignItems="center"
                        sx={{ p: ".8rem 1.8rem", borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid` }}
                    >
                        <Stack spacing="1rem" direction="row" alignItems="center">
                            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                LEADERBOARD:
                            </Typography>
                            <LeaderboardSelect leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
                        </Stack>

                        {roundOptions && leaderboardType !== LeaderboardTypeEnum.PlayerMechsOwned && (
                            <Stack spacing="1rem" direction="row" alignItems="center">
                                <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    EVENT:
                                </Typography>
                                <RoundSelect roundOptions={roundOptions} selectedRound={selectedRound} setSelectedRound={setSelectedRound} />
                            </Stack>
                        )}
                    </Stack>

                    <Stack spacing="2rem" sx={{ pb: "1rem", flex: 1 }}>
                        {leaderboard}
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
