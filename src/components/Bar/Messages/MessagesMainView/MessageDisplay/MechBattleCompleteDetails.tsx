import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../../../theme/theme"
import { BattleReward, SystemMessageDataMechBattleComplete, SystemMessageMechStruct } from "../../../../../types"
import { RewardAbility } from "./Common/RewardAbility"
import { RewardSups } from "./Common/RewardSups"
import { SystemMessageMech } from "./Common/SystemMessageMech"

export interface MechBattleCompleteDetailsProps {
    message: string
    data: SystemMessageDataMechBattleComplete
}

export const MechBattleCompleteDetails = ({ message, data }: MechBattleCompleteDetailsProps) => {
    return (
        <Stack spacing="3rem" sx={{ px: "1rem", pt: "1rem", pb: "3rem" }}>
            <Typography variant="h6">{message}</Typography>
            {data.battle_reward && <RewardsSection data={data.battle_reward} />}
            {data.mech_battle_briefs && data.mech_battle_briefs.length > 0 && <MechsSection data={data.mech_battle_briefs} />}
        </Stack>
    )
}

const RewardsSection = ({ data }: { data: BattleReward }) => {
    const sups = data.rewarded_sups
    const supsBonus = data.rewarded_sups_bonus
    const ability = data.rewarded_player_ability

    if (!sups && !supsBonus && !ability) {
        return null
    }

    return (
        <Stack spacing="1rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>YOUR REWARDS:</Typography>

            <Stack alignItems="center" direction="row" spacing="2rem">
                {sups && sups != "0" && <RewardSups sups={sups} />}
                {supsBonus && supsBonus != "0" && <RewardSups sups={supsBonus} label="BONUS" />}
                {ability && <RewardAbility ability={ability} />}
            </Stack>
        </Stack>
    )
}

const MechsSection = ({ data }: { data: SystemMessageMechStruct[] }) => {
    return (
        <Stack spacing="1rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{`YOUR MECH${data.length > 1 ? "S" : ""}:`}</Typography>

            <Stack direction="row" spacing="1.4rem">
                {data.map((mech) => (
                    <SystemMessageMech key={mech.mech_id} mech={mech} />
                ))}
            </Stack>
        </Stack>
    )
}
