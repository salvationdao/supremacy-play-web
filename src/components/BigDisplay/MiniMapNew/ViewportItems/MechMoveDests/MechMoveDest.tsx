import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { FactionMechCommand } from "./MechMoveDests"
import { PixiMechMoveDest } from "./pixiMechMoveDest"

export const MechMoveDest = React.memo(function MechMoveDests({ moveCommand }: { moveCommand: FactionMechCommand }) {
    const { pixiMiniMapPixi, gridSizeRef, gridCellToViewportPosition, mapItemMinSize } = useMiniMapPixi()
    const [pixiMechMoveDest, setPixiMechMoveDest] = useState<PixiMechMoveDest>()

    // Initial setup
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiMechMoveDest = new PixiMechMoveDest(moveCommand, gridSizeRef, gridCellToViewportPosition, mapItemMinSize)
        pixiMiniMapPixi.viewport.addChild(pixiMechMoveDest.root)
        setPixiMechMoveDest((prev) => {
            prev?.destroy()
            return pixiMechMoveDest
        })
    }, [gridCellToViewportPosition, gridSizeRef, moveCommand, pixiMiniMapPixi, mapItemMinSize])

    // Cleanup
    useEffect(() => {
        return () => pixiMechMoveDest?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMechMoveDest])

    return null
})
