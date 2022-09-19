import { Box, Stack, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useMiniMapPixi } from "../../../../../containers"
import { GAME_CLIENT_TILE_SIZE } from "../../../../../types"
import { PixiMapMech } from "../../ViewportItems/MapMechs/pixiMapMech"
import { PixiMapScale } from "./pixiMapScale"

export const MapScale = React.memo(function MapScale() {
    const { pixiMainItems, gridSizeRef, mapScalingRef } = useMiniMapPixi()
    const [pixiMapScale, setPixiMapScale] = useState<PixiMapScale>()

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!pixiMainItems) return
        const pixiMapScale = new PixiMapScale(pixiMainItems.viewport, gridSizeRef, mapScalingRef)
        pixiMainItems.app.stage.addChild(pixiMapScale.root)
        setPixiMapScale(pixiMapScale)
    }, [gridSizeRef, mapScalingRef, pixiMainItems])

    // Cleanup
    useEffect(() => {
        return () => pixiMapScale?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMapScale])

    return null
})
