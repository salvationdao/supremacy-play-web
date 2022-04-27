import { Stack } from "@mui/material"
import BigNumber from "bignumber.js"
import { useMemo } from "react"
import { VotingButton } from "../.."
import { SvgSupToken } from "../../../assets"
import { VOTING_OPTION_COSTS } from "../../../constants"

interface VotingButtonsProps {
    colour: string
    text_colour: string
    isVoting: boolean
    supsCost: BigNumber
    onContribute: (c: BigNumber, p: number) => void
}

export const VotingButtons = ({ colour, text_colour, isVoting, supsCost, onContribute }: VotingButtonsProps) => {
    const voteCosts = useMemo(
        () =>
            VOTING_OPTION_COSTS.map((voteCost) => {
                const cost = supsCost.multipliedBy(voteCost.percentage)

                if (cost.isLessThan(voteCost.minCost)) {
                    const minCostPercentage = +voteCost.minCost.dividedBy(supsCost) * 100
                    return {
                        cost: voteCost.minCost,
                        percentage: voteCost.percentage * 100,
                        displayPercentage: minCostPercentage,
                    }
                }

                return {
                    cost,
                    percentage: voteCost.percentage * 100,
                    displayPercentage: voteCost.percentage * 100,
                }
            }),
        [supsCost],
    )

    return (
        <Stack direction="row" spacing=".6rem" sx={{ mt: ".48rem", width: "100%" }}>
            {voteCosts.map((c) => (
                <VotingButton
                    key={`faction-ability-vote-cost-button-${c.percentage}`}
                    color={colour}
                    textColor={text_colour || "#FFFFFF"}
                    percentage={c.percentage.toString()}
                    displayPercentage={c.displayPercentage.toFixed(2)}
                    cost={c.cost.toFixed(3)}
                    isVoting={isVoting}
                    onClick={() => onContribute(c.cost, c.percentage)}
                    Prefix={<SupsToken text_colour={text_colour} />}
                />
            ))}
        </Stack>
    )
}

const SupsToken = ({ text_colour }: { text_colour: string }) => <SvgSupToken size="1.5rem" fill={text_colour || "#FFFFFF"} sx={{ pb: ".2rem" }} />
