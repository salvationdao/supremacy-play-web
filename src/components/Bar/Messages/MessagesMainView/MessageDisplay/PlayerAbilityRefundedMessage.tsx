import { Divider, Stack, Typography } from "@mui/material"
import { BlueprintPlayerAbility } from "../../../../../types"
import { RewardAbility } from "./Common/RewardAbility"

interface PlayerAbilityRefundedProps {
    message: string
    data: PlayerAbilityRefundedData[]
}

export interface PlayerAbilityRefundedData {
    amount: number
    player_ability: BlueprintPlayerAbility
}

export const PlayerAbilityRefundedMessage = ({ message, data }: PlayerAbilityRefundedProps) => {
    return (
        <Stack spacing=".3rem">
            <Typography variant="h6">{message}</Typography>

            <Divider sx={{ my: "1rem !important", borderColor: "#FFFFFF28" }} />

            <Stack alignItems="center" direction="row" spacing="2rem">
                {data.map((d, i) => {
                    if (!d.player_ability) return null
                    return <RewardAbility key={i} ability={d.player_ability} amount={d.amount} />
                })}
            </Stack>
        </Stack>
    )
}
