import { Stack } from "@mui/material"
import { ContibutorAmountProps } from "../../types/index"
import { ContributorAmount } from "./ContributorAmount"
import { SpoilOfWarAmount } from "./SpoilOfWarAmount"

export const BattleStats = (props: ContibutorAmountProps) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing="1.6rem">
            <ContributorAmount ShowContributionTotal={props.ShowContributionTotal} ShowContributorAmount={props.ShowContributorAmount} />
            <SpoilOfWarAmount />
        </Stack>
    )
}
