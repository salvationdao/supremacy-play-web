import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useState } from "react"
import { GameAbility, GameAbilityProgress } from "../../../../types"
import { ProgressBar } from "../../../Common/ProgressBar"
import { WIDTH_STAT_BAR } from "./WarMachineItemBT"

export const SkillBarBT = ({
    index,
    gameAbility,
    maxAbilityPriceMap,
    participantID,
}: {
    index: number
    gameAbility: GameAbility
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
    participantID: number
}) => {
    const { identity, colour } = gameAbility
    const [supsCost, setSupsCost] = useState(new BigNumber("0"))
    const [currentSups, setCurrentSups] = useState(new BigNumber("0"))
    const [initialTargetCost, setInitialTargetCost] = useState<BigNumber>(new BigNumber("0"))

    const [gameAbilityProgress, setGameAbilityProgress] = useState<GameAbilityProgress>()

    const progressPercent = useMemo(
        () => (initialTargetCost.isZero() ? 0 : currentSups.dividedBy(initialTargetCost).toNumber() * 100),
        [initialTargetCost, currentSups],
    )

    const costPercent = useMemo(() => (initialTargetCost.isZero() ? 0 : supsCost.dividedBy(initialTargetCost).toNumber() * 100), [initialTargetCost, supsCost])

    useEffect(() => {
        if (!gameAbilityProgress) return
        const currentSups = new BigNumber(gameAbilityProgress.current_sups).dividedBy("1000000000000000000")
        const supsCost = new BigNumber(gameAbilityProgress.sups_cost).dividedBy("1000000000000000000")
        setCurrentSups(currentSups)
        setSupsCost(supsCost)

        setInitialTargetCost((prev) => {
            if (gameAbilityProgress.should_reset || prev.isZero()) {
                // Cache max price for the popover
                maxAbilityPriceMap.current.set(identity, supsCost)
                return supsCost
            }
            return prev
        })
    }, [gameAbilityProgress, identity, maxAbilityPriceMap])

    return useMemo(
        () => (
            <Box key={index} style={{ height: "100%" }}>
                <ProgressBar
                    percent={progressPercent}
                    linePercent={costPercent}
                    color={colour}
                    backgroundColor="#FFFFFF06"
                    thickness={`${WIDTH_STAT_BAR}rem`}
                />
            </Box>
        ),
        [colour, costPercent, index, progressPercent],
    )
}
