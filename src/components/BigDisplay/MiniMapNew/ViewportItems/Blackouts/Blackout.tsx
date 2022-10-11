import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { BlackoutEvent } from "./Blackouts"
import { PixiBlackout } from "./pixiBlackout"

interface BlackoutProps {
    blackout: BlackoutEvent
}

const propsAreEqual = (prevProps: BlackoutProps, nextProps: BlackoutProps) => {
    return prevProps.blackout.id === nextProps.blackout.id
}

export const Blackout = React.memo(function Blackout({ blackout }: BlackoutProps) {
    const { pixiMiniMapPixi, gridSizeRef, gridCellToViewportPosition } = useMiniMapPixi()
    const [pixiBlackout, setPixiBlackout] = useState<PixiBlackout>()

    // Initial setup
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiBlackout = new PixiBlackout(blackout, gridSizeRef, gridCellToViewportPosition)
        pixiMiniMapPixi.viewport.addChild(pixiBlackout.root)
        setPixiBlackout((prev) => {
            prev?.destroy()
            return pixiBlackout
        })
    }, [pixiMiniMapPixi, blackout, gridSizeRef, gridCellToViewportPosition])

    // Cleanup
    useEffect(() => {
        return () => pixiBlackout?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiBlackout])

    return null
}, propsAreEqual)
