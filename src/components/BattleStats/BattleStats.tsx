import { Stack } from "@mui/material"
import { ContributorAmount } from "./ContributorAmount"
import { SpoilOfWarAmount } from "./SpoilOfWarAmount"

export const BattleStats = () => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing="1.6rem">
            <ContributorAmount />
            <SpoilOfWarAmount />
        </Stack>
    )
}
