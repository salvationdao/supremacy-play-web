import React, { useCallback, useEffect, useState } from "react"
import { useGlobalNotifications, useMiniMapPixi } from "../../../../../containers"
import { BlueprintPlayerAbility, GameAbility } from "../../../../../types"
import { PixiTargetHint } from "./pixiTargetHint"

export const TargetHint = React.memo(function TargetHint() {
    const { isTargeting, winner, playerAbility } = useMiniMapPixi()

    if (isTargeting && winner?.game_ability) {
        return (
            <TargetHintInner
                key={`target-hint-${winner.game_ability.id}-${winner.end_time.toDateString()}`}
                ability={winner.game_ability}
                endTime={winner.end_time}
            />
        )
    }

    if (isTargeting && playerAbility?.ability) {
        return <TargetHintInner key={`target-hint-${playerAbility.id}`} ability={playerAbility.ability} cancelable />
    }

    return null
})

interface TargetHintInnerProps {
    ability: GameAbility | BlueprintPlayerAbility
    endTime?: Date
    cancelable?: boolean
}

const propsAreEqual = (prevProps: TargetHintInnerProps, nextProps: TargetHintInnerProps) => {
    return prevProps.endTime === nextProps.endTime && prevProps.cancelable === nextProps.cancelable && prevProps.ability.id === nextProps.ability.id
}

const TargetHintInner = React.memo(function TargetHintInner({ ability, endTime, cancelable }: TargetHintInnerProps) {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { pixiMainItems, resetWinnerSelection, resetPlayerAbilitySelection, mapMousePosition, gridSizeRef, selection } = useMiniMapPixi()
    const [pixiTargetHint, setPixiTargetHint] = useState<PixiTargetHint>()

    const onCountdownExpired = useCallback(() => {
        newSnackbarMessage("Failed to submit target location on time.", "error")
        resetWinnerSelection()
    }, [newSnackbarMessage, resetWinnerSelection])

    const onCancel = useCallback(() => {
        resetPlayerAbilitySelection()
    }, [resetPlayerAbilitySelection])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiTargetHint = new PixiTargetHint(
            pixiMainItems.viewport,
            mapMousePosition,
            gridSizeRef,
            ability,
            endTime,
            onCountdownExpired,
            cancelable ? onCancel : undefined,
        )
        pixiMainItems.viewport.addChild(pixiTargetHint.viewportRoot)
        pixiMainItems.app.stage.addChild(pixiTargetHint.stageRoot)
        setPixiTargetHint((prev) => {
            prev?.destroy()
            return pixiTargetHint
        })
    }, [ability, endTime, pixiMainItems, mapMousePosition, gridSizeRef, onCountdownExpired, onCancel, cancelable])

    // Cleanup
    useEffect(() => {
        return () => {
            pixiTargetHint?.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiTargetHint])

    // If ability has an end time and selection is placed, hide the icon
    useEffect(() => {
        if (!pixiTargetHint || !endTime) return
        pixiTargetHint.showIcon(!selection)
    }, [selection, endTime, pixiTargetHint])

    return null
}, propsAreEqual)
