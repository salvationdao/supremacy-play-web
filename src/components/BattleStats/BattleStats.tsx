import { Stack } from "@mui/material"
import { useOverlayToggles } from "../../containers"
import { ContributorAmount } from "./ContributorAmount"
import { SpoilOfWarAmount } from "./SpoilOfWarAmount"

export const BattleStats = () => {
    const { isLiveChartOpen } = useOverlayToggles()

    return (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing="1.6rem">
            <ContributorAmount showContributionTotal={!isLiveChartOpen} showContributorAmount={!isLiveChartOpen} />
            <SpoilOfWarAmount />
        </Stack>
    )
}
