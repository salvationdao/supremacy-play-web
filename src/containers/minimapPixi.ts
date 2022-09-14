import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { Dimension } from "../types"
import { useArena } from "./arena"
import { useAuth } from "./auth"
import { useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"

interface PixiMainItems {
    app: PIXI.Application
    viewport: Viewport
}

export const MiniMapPixiContainer = createContainer(() => {
    const { bribeStage, map, isBattleStarted } = useGame()
    const { factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Pixi stuff
    const [pixiMainItems, setPixiMainItems] = useState<PixiMainItems>()

    // Map
    const gridSize: Dimension = useMemo(() => (map ? { width: map.Width / map.Cells_X, height: map.Height / map.Cells_Y } : { width: 50, height: 50 }), [map])

    return { pixiMainItems, setPixiMainItems }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
