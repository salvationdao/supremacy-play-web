import React, { useCallback, useEffect, useState } from "react"
import { useGlobalNotifications, useMiniMapPixi } from "../../../../../containers"
import { BlueprintPlayerAbility, GameAbility } from "../../../../../types"
import { PixiTargetHint } from "./pixiTargetHint"

export const TargetHint = React.memo(function TargetHint() {
    const { isTargeting, winner, playerAbility } = useMiniMapPixi()

    const ability = winner?.game_ability || playerAbility?.ability
    const endTime = winner?.end_time

    if (!isTargeting || !ability) {
        return null
    }

    return (
        <TargetHintInner
            key={`target-hint-${ability.id}-${endTime?.toISOString()}`}
            ability={ability}
            endTime={endTime}
            cancelable={!winner?.game_ability && !!ability}
        />
    )
})

const TargetHintInner = ({ ability, endTime, cancelable }: { ability: GameAbility | BlueprintPlayerAbility; endTime?: Date; cancelable: boolean }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { pixiMainItems, resetWinnerSelection, resetPlayerAbilitySelection, mapMousePosition, gridSizeRef, selection } = useMiniMapPixi()
    const [pixiTargetHint, setPixiTargetHint] = useState<PixiTargetHint>()

    const onCountdownExpired = useCallback(() => {
        newSnackbarMessage("Failed to submit target location on time.", "error")
        resetWinnerSelection()
        resetPlayerAbilitySelection()
    }, [newSnackbarMessage, resetWinnerSelection, resetPlayerAbilitySelection])

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
        return () => pixiTargetHint?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiTargetHint])

    // If ability has an end time and selection is placed, hide the icon
    useEffect(() => {
        if (!pixiTargetHint || !endTime) return
        pixiTargetHint.showIcon(!selection)
    }, [selection, endTime, pixiTargetHint])

    return null
}
