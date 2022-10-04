import React, { useEffect, useState } from "react"
import { useMiniMapPixi, WinnerStruct } from "../../../../../containers"
import { PlayerAbility } from "../../../../../types"
import { PixiMapScale } from "./pixiMapScale"

export const MapScale = React.memo(function MapScale() {
    const { pixiMainItems, gridSizeRef, onAbilityUseCallbacks, mapMousePosition } = useMiniMapPixi()
    const [pixiMapScale, setPixiMapScale] = useState<PixiMapScale>()

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMapScale = new PixiMapScale(pixiMainItems.viewport, gridSizeRef, mapMousePosition)
        pixiMainItems.app.stage.addChild(pixiMapScale.root)
        setPixiMapScale(pixiMapScale)
    }, [gridSizeRef, pixiMainItems, mapMousePosition])

    // Cleanup
    useEffect(() => {
        return () => pixiMapScale?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMapScale])

    // When targeting, dont show the scale
    useEffect(() => {
        if (!pixiMapScale) return

        onAbilityUseCallbacks.current[`map-scale`] = (wn: WinnerStruct | undefined, pa: PlayerAbility | undefined) => {
            pixiMapScale.updateVisibility(!(wn || pa))
        }
    }, [onAbilityUseCallbacks, pixiMapScale])

    return null
})
