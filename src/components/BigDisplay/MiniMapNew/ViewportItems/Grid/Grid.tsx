import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { useToggle } from "../../../../../hooks"
import { PixiGrid } from "./pixiGrid"

export const Grid = React.memo(function Grid() {
    const { pixiMainItems, gridSizeRef } = useMiniMapPixi()
    const [pixiGrid, setPixiGrid] = useState<PixiGrid>()
    const [showGrid, toggleShowGrid] = useToggle(localStorage.getItem("minimap-show-grid") === "true")

    // Initial setup
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiGrid = new PixiGrid(pixiMainItems.viewport, gridSizeRef)
        pixiMainItems.viewport.addChild(pixiGrid.root)
        setPixiGrid((prev) => {
            prev?.destroy()
            return pixiGrid
        })

        const btn = document.getElementById("minimap-show-grid-button")
        if (btn) {
            btn.addEventListener("pointerup", () => {
                toggleShowGrid()
            })
        }
    }, [gridSizeRef, pixiMainItems, toggleShowGrid])

    // Cleanup
    useEffect(() => {
        return () => pixiGrid?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiGrid])

    useEffect(() => {
        if (!pixiGrid) return
        localStorage.setItem("minimap-show-grid", showGrid.toString())
        pixiGrid.showGrid(showGrid)
    }, [pixiGrid, showGrid])

    return null
})
