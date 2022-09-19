import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { PixiMapScale } from "./pixiMapScale"

export const MapScale = React.memo(function MapScale() {
    const { pixiMainItems, gridSizeRef } = useMiniMapPixi()
    const [pixiMapScale, setPixiMapScale] = useState<PixiMapScale>()

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMapScale = new PixiMapScale(pixiMainItems.viewport, gridSizeRef)
        pixiMainItems.app.stage.addChild(pixiMapScale.root)
        setPixiMapScale(pixiMapScale)
    }, [gridSizeRef, pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiMapScale?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMapScale])

    return null
})
