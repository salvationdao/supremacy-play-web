import React, { useEffect, useState } from "react"
import { useGame, useMiniMapPixi } from "../../../../../containers"
import { PixiBattleZone } from "./pixiBattleZone"

export const BattleZone = React.memo(function BattleZone() {
    const { battleZone } = useGame()
    const { pixiMainItems, clientPositionToViewportPosition, gridSizeRef } = useMiniMapPixi()
    const [pixiBattleZone, setPixiBattleZone] = useState<PixiBattleZone>()

    // Initial setup
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiBattleZone = new PixiBattleZone(pixiMainItems.viewport, gridSizeRef, clientPositionToViewportPosition)
        pixiMainItems.viewport.addChild(pixiBattleZone.root)
        setPixiBattleZone((prev) => {
            prev?.destroy()
            return pixiBattleZone
        })
    }, [pixiMainItems, clientPositionToViewportPosition, gridSizeRef])

    // Cleanup
    useEffect(() => {
        return () => pixiBattleZone?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiBattleZone])

    // Update battleZone when state changes
    useEffect(() => {
        if (!pixiBattleZone) return

        pixiBattleZone.updateBattleZone(battleZone)
    }, [battleZone, pixiBattleZone])

    return null
})
