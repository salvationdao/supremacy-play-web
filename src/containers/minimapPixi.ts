import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useDebounce } from "../hooks"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { Dimension, GameAbility, GAME_CLIENT_TILE_SIZE, Map, PlayerAbility, Vector2i } from "../types"
import { useArena } from "./arena"
import { useAuth } from "./auth"
import { useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"
import { MapSelection } from "./minimap"

interface WinnerStruct {
    game_ability: GameAbility
    end_time: Date
}

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

    // Gameplay related
    const [winner, setWinner] = useState<WinnerStruct>()
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()
    const [isTargeting, setIsTargeting] = useState(false)
    const [highlightedMechParticipantID, setHighlightedMechParticipantID] = useState<number>()
    const [selection, setSelectionDebounced, selectionInstant, setSelection] = useDebounce<MapSelection | undefined>(undefined, 320)

    // Pixi stuff
    const [pixiMainItems, setPixiMainItems] = useState<PixiMainItems>()

    // Cache map related values into ref so it can be used within subscription callbacks
    const mapRef = useRef<Map>()
    const mapScalingRef = useRef<Vector2i>({ x: 0, y: 0 }) // Map co-ordinate from server * mapScaling.x = position in viewport
    const gridSizeRef = useRef<Dimension>({ width: 50, height: 50 })

    // Update cached map values
    useEffect(() => {
        if (!map || !pixiMainItems) return
        mapRef.current = map
        mapScalingRef.current = { x: pixiMainItems.viewport.worldWidth / map.Width, y: pixiMainItems.viewport.worldHeight / map.Height }
        gridSizeRef.current = { width: (mapScalingRef.current.x * map.Width) / map.Cells_X, height: (mapScalingRef.current.y * map.Height) / map.Cells_Y }
    }, [map, pixiMainItems])

    const getViewportPosition = useRef((x: number, y: number) => {
        return {
            x: (x - (map?.Pixel_Left || 0)) * (gridSizeRef.current.width / GAME_CLIENT_TILE_SIZE),
            y: (y - (map?.Pixel_Top || 0)) * (gridSizeRef.current.height / GAME_CLIENT_TILE_SIZE),
        }
    })

    return {
        pixiMainItems,
        setPixiMainItems,
        mapScalingRef,
        gridSizeRef,
        getViewportPosition,

        highlightedMechParticipantID,
        isTargeting,
        selection,
        selectionInstant,
        winner,
        playerAbility,
    }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
