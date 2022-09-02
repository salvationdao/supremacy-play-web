import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleComplete } from "../../../../../types"
import { MechBattleBrief } from "./Common/MechBattleBrief"
import { RewardAbility } from "./Common/RewardAbility"
import { RewardSups } from "./Common/RewardSups"

export interface MechBattleCompleteDetailsProps {
    message: string
    data: SystemMessageDataMechBattleComplete
}

export const MechBattleCompleteDetails = ({ message, data }: MechBattleCompleteDetailsProps) => {
    return (
        <Stack spacing="2rem">
            <Typography variant="h6">{message}</Typography>
            <RewardsSection data={data} />
            <MechsSection data={data} />
        </Stack>
    )
}

const RewardsSection = ({ data }: { data: SystemMessageDataMechBattleComplete }) => {
    const sups = data.rewarded_sups
    const ability = data.rewarded_player_ability

    return (
        <Stack spacing="1rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR REWARDS:</Typography>

            <Stack alignItems="center" direction="row" spacing="2rem">
                {sups && sups != "0" && <RewardSups sups={sups} />}

                {ability && <RewardAbility ability={ability} />}
            </Stack>
        </Stack>
    )
}

const MechsSection = ({ data }: { data: SystemMessageDataMechBattleComplete }) => {
    if (!data.mech_battle_briefs || data.mech_battle_briefs.length <= 0) {
        return null
    }

    return (
        <Stack spacing="1rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{`YOUR MECH${data.mech_battle_briefs.length > 1 ? "S" : ""}:`}</Typography>

            <Stack direction="row">
                {data.mech_battle_briefs.map((battleBrief) => (
                    <MechBattleBrief key={battleBrief.mech_id} battleBrief={battleBrief} />
                ))}
            </Stack>
        </Stack>
    )
}
