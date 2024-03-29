import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../../containers"
import { useLocalStorage } from "../../../../../../hooks/useLocalStorage"
import { PixiGrid } from "./pixiGrid"

export const Grid = React.memo(function Grid() {
    const { pixiMiniMapPixi, gridSizeRef, mapMousePosition } = useMiniMapPixi()
    const [pixiGrid, setPixiGrid] = useState<PixiGrid>()
    const [showGrid, setShowGrid] = useLocalStorage<boolean>("minimap-show-grid", false)

    // Initial setup
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiGrid = new PixiGrid(pixiMiniMapPixi.viewport, gridSizeRef, mapMousePosition)
        pixiMiniMapPixi.viewport.addChild(pixiGrid.root)
        setPixiGrid((prev) => {
            prev?.destroy()
            return pixiGrid
        })

        const btn = document.getElementById("minimap-show-grid-button")
        if (btn) {
            btn.addEventListener("pointerup", () => {
                setShowGrid((prev) => !prev)
            })
        }
    }, [gridSizeRef, pixiMiniMapPixi, setShowGrid, mapMousePosition])

    // Cleanup
    useEffect(() => {
        return () => pixiGrid?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiGrid])

    // Do the toggle
    useEffect(() => {
        if (!pixiGrid) return
        pixiGrid.showGrid(showGrid)

        // Change button opacity
        const btn = document.getElementById("minimap-show-grid-button")
        if (btn) btn.style.opacity = showGrid ? "1" : " 0.4"
    }, [pixiGrid, showGrid])

    return null
})
