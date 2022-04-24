import { Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { BattleAbilityProgressBigNum, VotingButton } from "../.."
import { SvgSupToken } from "../../../assets"
import { VOTING_OPTION_COSTS } from "../../../constants"

interface VotingButtonsProps {
    buttonColor: string
    buttonTextColor: string
    isVoting: boolean
    battleAbilityProcess: BattleAbilityProgressBigNum
    onBribe: (a: BigNumber, b: number) => void
}

export const VotingButtons = ({ buttonColor, buttonTextColor, isVoting, battleAbilityProcess, onBribe }: VotingButtonsProps) => {
    const voteCosts = useMemo(
        () =>
            VOTING_OPTION_COSTS.map((voteCost) => {
                const cost = battleAbilityProcess.sups_cost.multipliedBy(voteCost.percentage / 100)
                return {
                    cost: cost.isLessThan(voteCost.minCost) ? voteCost.minCost : cost,
                    percentage: voteCost.percentage,
                }
            }),
        [battleAbilityProcess.sups_cost],
    )

    return (
        <Stack direction="row" spacing=".4rem" sx={{ mt: ".48rem", width: "100%" }}>
            {voteCosts.map((c) => (
                <VotingButton
                    key={`battle-ability-vote-cost-button-${c.percentage}`}
                    color={buttonColor}
                    textColor={buttonTextColor}
                    percentage={c.percentage.toString()}
                    cost={c.cost.toFixed(3)}
                    isVoting={isVoting}
                    onClick={() => onBribe(c.cost, c.percentage)}
                    Prefix={<SupsToken text_colour={buttonTextColor} />}
                />
            ))}
        </Stack>
    )
}

const SupsToken = ({ text_colour }: { text_colour: string }) => <SvgSupToken size="1.5rem" fill={text_colour || "#FFFFFF"} sx={{ pb: ".2rem" }} />
