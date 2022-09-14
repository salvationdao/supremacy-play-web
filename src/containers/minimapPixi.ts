import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { Dimension } from "../types"
import { useArena } from "./arena"
import { useAuth } from "./auth"
import { useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"

export const MiniMapPixiContainer = createContainer(() => {
    const { bribeStage, map, isBattleStarted } = useGame()
    const { factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Map
    const gridSize: Dimension = useMemo(() => (map ? { width: map.Width / map.Cells_X, height: map.Height / map.Cells_Y } : { width: 50, height: 50 }), [map])

    // Pixi stuff
    const [isPixiSetup, setIsPixiSetup] = useState(false)
    const pixiApp = useRef<PIXI.Application>()
    const pixiViewport = useRef<Viewport>()

    return { isPixiSetup, setIsPixiSetup, pixiViewport, pixiApp }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
