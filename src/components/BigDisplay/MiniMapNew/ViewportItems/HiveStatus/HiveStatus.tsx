import React, { useEffect, useState } from "react"
import { useGame, useMiniMapPixi } from "../../../../../containers"
import { PixiHiveStatus } from "./pixiHiveStatus"

const TheHiveMapName: string = "TheHive"

interface HiveStatusProps {
    hiveStatus: React.MutableRefObject<boolean[]>
}

export const HiveStatus = React.memo(function HiveStatus({ hiveStatus }: HiveStatusProps) {
    const { map } = useGame()

    if (!map || map.Name !== TheHiveMapName) {
        return null
    }

    return <HiveStatusInner hiveStatus={hiveStatus} />
})

const HiveStatusInner = React.memo(function HiveStatusInner({ hiveStatus }: HiveStatusProps) {
    const { pixiMiniMapPixi, clientPositionToViewportPosition, mapScalingRef } = useMiniMapPixi()
    const [pixiHiveStatus, setPixiHiveStatus] = useState<PixiHiveStatus>()

    // Initial setup
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        const pixiHiveStatus = new PixiHiveStatus(hiveStatus, clientPositionToViewportPosition, mapScalingRef)
        pixiMiniMapPixi.viewport.addChild(pixiHiveStatus.root)
        setPixiHiveStatus((prev) => {
            prev?.destroy()
            return pixiHiveStatus
        })
    }, [pixiMiniMapPixi, clientPositionToViewportPosition, hiveStatus, mapScalingRef])

    // Cleanup
    useEffect(() => {
        return () => pixiHiveStatus?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiHiveStatus])

    return null
})
