import React, { useCallback, useEffect, useState } from "react"
import { useGlobalNotifications, useMiniMapPixi } from "../../../../../containers"
import { BlueprintPlayerAbility, GameAbility } from "../../../../../types"
import { PixiTargetHint } from "./pixiTargetHint"

export const TargetHint = React.memo(function TargetHint() {
    const { isTargeting, winner, playerAbility } = useMiniMapPixi()

    const ability = winner?.game_ability || playerAbility?.ability
    const endTime = winner?.end_time

    console.log({ winner, playerAbility })

    if (!isTargeting || !ability) {
        return null
    }

    return <TargetHintInner ability={ability} endTime={endTime} />
})

const TargetHintInner = ({ ability, endTime }: { ability: GameAbility | BlueprintPlayerAbility; endTime?: Date }) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { pixiMainItems, gridSizeRef, resetWinnerSelection } = useMiniMapPixi()
    const [pixiTargetHint, setPixiTargetHint] = useState<PixiTargetHint>()

    const onCountdownExpired = useCallback(() => {
        newSnackbarMessage("Failed to submit target location on time.", "error")
        resetWinnerSelection()
    }, [newSnackbarMessage, resetWinnerSelection])

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiTargetHint = new PixiTargetHint(pixiMainItems.viewport, ability, endTime, onCountdownExpired)
        pixiMainItems.app.stage.addChild(pixiTargetHint.root)
        setPixiTargetHint((prev) => {
            prev?.destroy()
            return pixiTargetHint
        })
    }, [ability, endTime, gridSizeRef, onCountdownExpired, pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiTargetHint?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiTargetHint])

    return null
}
