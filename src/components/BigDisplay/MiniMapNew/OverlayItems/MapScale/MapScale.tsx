import React, { useEffect, useState } from "react"
import { useMiniMapPixi, WinnerStruct } from "../../../../../containers"
import { PlayerAbility } from "../../../../../types"
import { PixiMapScale } from "./pixiMapScale"

export const MapScale = React.memo(function MapScale() {
    const { pixiMiniMapPixi, gridSizeRef, onAbilityUseCallbacks, mapMousePosition } = useMiniMapPixi()
    const [pixiMapScale, setPixiMapScale] = useState<PixiMapScale>()

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiMapScale = new PixiMapScale(pixiMiniMapPixi.viewport, gridSizeRef, mapMousePosition)
        pixiMiniMapPixi.app.stage.addChild(pixiMapScale.root)
        setPixiMapScale(pixiMapScale)
    }, [gridSizeRef, pixiMiniMapPixi, mapMousePosition])

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
