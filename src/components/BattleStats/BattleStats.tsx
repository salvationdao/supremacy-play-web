import { Stack } from "@mui/material"
import { ContributorAmountProps, ContributorAmount } from "./ContributorAmount"
import { SpoilOfWarAmount } from "./SpoilOfWarAmount"

export const BattleStats = (props: ContributorAmountProps) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing="1.6rem">
            <ContributorAmount {...props} />
            <SpoilOfWarAmount />
        </Stack>
    )
}
