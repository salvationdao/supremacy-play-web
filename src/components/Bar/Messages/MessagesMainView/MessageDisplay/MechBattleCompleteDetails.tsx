import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../../../theme/theme"
import { SystemMessageDataMechBattleComplete } from "../../../../../types"
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

            <Stack alignItems="center" direction="row" spacing="1.4rem">
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

            <Stack direction="row" spacing="1.4rem">
                {data.mech_battle_briefs.map((mech) => (
                    <SystemMessageMech key={mech.mech_id} mech={mech} />
                ))}
            </Stack>
        </Stack>
    )
}
