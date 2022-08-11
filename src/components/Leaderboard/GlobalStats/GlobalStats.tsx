import { Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ClipThing } from "../.."
import { Gabs } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { fonts } from "../../../theme/theme"
import { PageHeader } from "../../Common/PageHeader"
import { LeaderboardSelect, LeaderboardTypeEnum } from "./Common/LeaderboardSelect"
import { PlayerAbilityKills } from "./PlayerAbilityKills"
import { PlayerAbilityTriggers } from "./PlayerAbilityTriggers"
import { PlayerBattlesSpectated } from "./PlayerBattlesSpectated"
import { PlayerMechKills } from "./PlayerMechKills"
import { PlayerMechsOwned } from "./PlayerMechsOwned"
import { PlayerMechSurvives } from "./PlayerMechSurvives"
import { PlayerRepairBlocks } from "./PlayerRepairBlocks"

export const GlobalStats = () => {
    const theme = useTheme()
    const [leaderboardType, setLeaderboardType] = useState<LeaderboardTypeEnum>(LeaderboardTypeEnum.PlayerAbilityKills)

    const leaderboard = useMemo(() => {
        switch (leaderboardType) {
            case LeaderboardTypeEnum.PlayerAbilityKills:
                return <PlayerAbilityKills />
            case LeaderboardTypeEnum.PlayerBattlesSpectated:
                return <PlayerBattlesSpectated />
            case LeaderboardTypeEnum.PlayerMechSurvives:
                return <PlayerMechSurvives />
            case LeaderboardTypeEnum.PlayerMechKills:
                return <PlayerMechKills />
            case LeaderboardTypeEnum.PlayerAbilityTriggers:
                return <PlayerAbilityTriggers />
            case LeaderboardTypeEnum.PlayerMechsOwned:
                return <PlayerMechsOwned />
            case LeaderboardTypeEnum.PlayerRepairBlocks:
                return <PlayerRepairBlocks />

            default:
                return null
        }
    }, [leaderboardType])

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
                    >
                        <Stack direction="row" alignItems="center" sx={{ ml: "auto !important", pr: "2rem" }}>
                            <LeaderboardSelect leaderboardType={leaderboardType} setLeaderboardType={setLeaderboardType} />
                        </Stack>
                    </PageHeader>

                    <Stack spacing="2rem" sx={{ pb: "1rem", flex: 1 }}>
                        {leaderboard}
                    </Stack>
                </Stack>
            </Stack>
        </ClipThing>
    )
}
