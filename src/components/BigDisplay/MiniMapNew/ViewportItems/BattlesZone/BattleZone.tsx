import React, { useEffect, useState } from "react"
import { useGame, useMiniMapPixi } from "../../../../../containers"
import { BattleZoneStruct } from "../../../../../types"
import { PixiBattleZone } from "./pixiBattleZone"

export const BattleZone = React.memo(function BattleZone() {
    const { battleZone } = useGame()

    if (!battleZone) {
        return null
    }

    return <BattleZoneInner battleZone={battleZone} />
})

const BattleZoneInner = React.memo(function BattleZone({ battleZone }: { battleZone: BattleZoneStruct }) {
    const { pixiMainItems, clientPositionToViewportPosition, gridSizeRef } = useMiniMapPixi()
    const [pixiBattleZone, setPixiBattleZone] = useState<PixiBattleZone>()

    // Initial setup
    useEffect(() => {
        if (!pixiMainItems || pixiBattleZone) return
        const pbz = new PixiBattleZone(pixiMainItems.viewport, gridSizeRef, clientPositionToViewportPosition, battleZone)
        pixiMainItems.viewport.addChild(pbz.root)
        setPixiBattleZone((prev) => {
            prev?.destroy()
            return pbz
        })
    }, [pixiMainItems, clientPositionToViewportPosition, gridSizeRef, pixiBattleZone, battleZone])

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
