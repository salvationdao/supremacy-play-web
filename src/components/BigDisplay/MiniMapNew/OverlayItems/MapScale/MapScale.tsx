import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { PlayerAbility, PlayerSupporterAbility } from "../../../../../types"
import { PixiMapScale } from "./pixiMapScale"

export const MapScale = React.memo(function MapScale() {
    const { pixiMainItems, gridSizeRef, onAnyAbilityUseCallbacks, mapMousePosition } = useMiniMapPixi()
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

    // When targeting, don't show the scale
    useEffect(() => {
        if (!pixiMapScale) return

        onAnyAbilityUseCallbacks.current[`map-scale`] = (pa: PlayerAbility | undefined, sa: PlayerSupporterAbility | undefined) => {
            pixiMapScale.updateVisibility(!(pa || sa))
        }
    }, [onAnyAbilityUseCallbacks, pixiMapScale])

    return null
})
