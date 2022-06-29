import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useState } from "react"
import { useGameServerSubscriptionAbilityFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { GameAbility, GameAbilityProgress } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { WIDTH_STAT_BAR } from "./WarMachineItem"

export const SkillBar = ({
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

    // Listen on current faction ability price change
    useGameServerSubscriptionAbilityFaction<GameAbilityProgress | undefined>(
        {
            URI: `/mech/${participantID}`,
            key: GameServerKeys.SubAbilityProgress,
            ready: !!participantID,
        },
        (payload) => {
            if (!payload || payload.id !== identity) return
            setGameAbilityProgress(payload)
        },
    )

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
            <Box
                key={index}
                style={{
                    width: `${WIDTH_STAT_BAR}rem`,
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 6,
                }}
            >
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
