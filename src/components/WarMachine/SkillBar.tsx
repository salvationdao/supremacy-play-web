import { Box } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useMemo, useState } from "react"
import { SlantedBar, WIDTH_PER_SLANTED_BAR, WIDTH_PER_SLANTED_BAR_ACTUAL } from ".."
import { NullUUID } from "../../constants"
import { useGameServerAuth, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { GameAbility, GameAbilityProgress } from "../../types"

export const SkillBar = ({
    index,
    gameAbility,
    maxAbilityPriceMap,
}: {
    index: number
    gameAbility: GameAbility
    maxAbilityPriceMap: React.MutableRefObject<Map<string, BigNumber>>
}) => {
    const { faction_id } = useGameServerAuth()
    const { state, subscribe, subscribeAbilityNetMessage } = useGameServerWebsocket()

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

    // DO NOT REMOVE THIS! Triggered faction ability or war machine ability price ticking
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe(GameServerKeys.TriggerFactionAbilityPriceUpdated, () => null, { ability_identity: identity })
    }, [state, subscribe, faction_id, identity])

    // Listen on current faction ability price change
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeAbilityNetMessage || !faction_id || faction_id === NullUUID) return

        return subscribeAbilityNetMessage<GameAbilityProgress | undefined>(identity, (payload) => {
            if (!payload) return
            setGameAbilityProgress(payload)
        })
    }, [identity, state, subscribeAbilityNetMessage, faction_id])

    useEffect(() => {
        if (!gameAbilityProgress) return
        const currentSups = new BigNumber(gameAbilityProgress.current_sups).dividedBy("1000000000000000000")
        const supsCost = new BigNumber(gameAbilityProgress.sups_cost).dividedBy("1000000000000000000")
        setCurrentSups(currentSups)
        setSupsCost(supsCost)

        if (gameAbilityProgress.should_reset || initialTargetCost.isZero()) {
            setInitialTargetCost(supsCost)

            // Cache max price for the popover
            maxAbilityPriceMap.current.set(identity, supsCost)
        }
    }, [gameAbilityProgress])

    return (
        <Box
            key={index}
            sx={{
                position: "absolute",
                bottom: 0,
                right: `${index * WIDTH_PER_SLANTED_BAR - index * 0.2}rem`,
                width: `${WIDTH_PER_SLANTED_BAR_ACTUAL}rem`,
                height: "100%",
                zIndex: 6,
                pointerEvents: "none",
            }}
        >
            <SlantedBar backgroundColor={colour} progressPercent={progressPercent} costPercent={costPercent} />
        </Box>
    )
}
