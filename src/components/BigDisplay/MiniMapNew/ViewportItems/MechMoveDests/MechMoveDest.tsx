import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { FactionMechCommand } from "./MechMoveDests"
import { PixiMechMoveDest } from "./pixiMechMoveDest"

export const MechMoveDest = React.memo(function MechMoveDests({ moveCommand }: { moveCommand: FactionMechCommand }) {
    const { pixiMainItems, gridSizeRef, gridCellToViewportPosition } = useMiniMapPixi()
    const [pixiMechMoveDest, setPixiMechMoveDest] = useState<PixiMechMoveDest>()

    // Initial setup
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMechMoveDest = new PixiMechMoveDest(moveCommand, gridSizeRef, gridCellToViewportPosition)
        pixiMainItems.viewport.addChild(pixiMechMoveDest.root)
        setPixiMechMoveDest((prev) => {
            prev?.destroy()
            return pixiMechMoveDest
        })
    }, [gridCellToViewportPosition, gridSizeRef, moveCommand, pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiMechMoveDest?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMechMoveDest])

    return null
})
