import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { PixiMiniMapPixi } from "../components/BigDisplay/MiniMapNew/MiniMapPixi/pixiMiniMapPixi"
import { deepEqual } from "../helpers"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { AnyAbility, BattleState, Dimension, GAME_CLIENT_TILE_SIZE, LocationSelectType, Map, Position, Vector2i } from "../types"
import { useArena } from "./arena"
import { useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"
import { RecordType, useHotkey } from "./hotkeys"

export const pixiViewportZIndexes = {
    hiveStatus: 10,
    mapAbilitiesBelowMechs: 15,
    mapMech: 30,
    mechMoveDests: 60,
    battleZone: 70,
    mapAbilitiesAboveMechs: 80,
    blackouts: 150,
    targetSelect: 200,
    grid: 300,
}

export const pixiStageZIndexes = {
    mapScale: 20,
    targetSelect: 50,
    mechAbilities: 20,
}

export interface MapSelection {
    position?: Position
    mechHash?: string
}

export const MiniMapPixiContainer = createContainer(() => {
    const { map, battleState } = useGame()
    const { currentArenaID } = useArena()
    const { addToHotkeyRecord } = useHotkey()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // ***************************************
    // ********** Generic stuff **********
    // ***************************************
    const [highlightedMechParticipantID, setHighlightedMechParticipantID] = useState<number>()

    // ************************************
    // ********** PIXI map stuff **********
    // ************************************
    const [pixiMiniMapPixi, setPixiMiniMapPixi] = useState<PixiMiniMapPixi>()
    const mapMousePosition = useRef<Position>()
    // Cache map related values into ref, so it can be used within subscription callbacks
    const mapRef = useRef<Map>()
    const mapScalingRef = useRef<Vector2i>({ x: 0, y: 0 }) // Map co-ordinate from server * mapScaling.x = position in viewport
    const gridSizeRef = useRef<Dimension>({ width: 50, height: 50 })
    const mapItemMinSize = useRef(20) // Use this when necessary, min size 1% of the map width

    // Update cached map values
    useEffect(() => {
        mapRef.current = map
        if (!map || !pixiMiniMapPixi) return
        mapScalingRef.current = { x: pixiMiniMapPixi.viewport.worldWidth / map.Width, y: pixiMiniMapPixi.viewport.worldHeight / map.Height }
        gridSizeRef.current = { width: (mapScalingRef.current.x * map.Width) / map.Cells_X, height: (mapScalingRef.current.y * map.Height) / map.Cells_Y }
        mapItemMinSize.current = Math.max(gridSizeRef.current.width, 0.03 * map.Width * mapScalingRef.current.x)
    }, [map, pixiMiniMapPixi])

    // Converts game client position (x, y) to (x, y) that fits into the viewport (viewport position)
    const clientPositionToViewportPosition = useRef((x: number, y: number) => {
        return {
            x: (x - (mapRef.current?.Pixel_Left || 0)) * (gridSizeRef.current.width / GAME_CLIENT_TILE_SIZE),
            y: (y - (mapRef.current?.Pixel_Top || 0)) * (gridSizeRef.current.height / GAME_CLIENT_TILE_SIZE),
        }
    })

    // Converts x and y cell to viewport position. E.g. grid cell (3, 5) may convert to x: 200, y: 516
    const gridCellToViewportPosition = useRef((xCell: number, yCell: number) => {
        return {
            x: xCell * gridSizeRef.current.width,
            y: yCell * gridSizeRef.current.height,
        }
    })

    // Converts viewport position to grid cell x and y, opposite of gridCellToViewportPosition.
    const viewportPositionToGridCell = useRef((x: number, y: number) => {
        return {
            x: x / gridSizeRef.current.width,
            y: y / gridSizeRef.current.height,
        }
    })

    // ***************************************
    // ********** Ability use stuff **********
    // ***************************************
    const anyAbility = useRef<AnyAbility | undefined>()
    const selection = useRef<MapSelection | undefined>()

    const onAnyAbilityUseCallbacks = useRef<{
        [name: string]: (anyAbility: AnyAbility | undefined) => void
    }>({})

    const onSelectMapPositionCallbacks = useRef<{
        [name: string]: (mapPos: MapSelection | undefined, anyAbility: AnyAbility | undefined) => void
    }>({})

    const useAnyAbility = useRef((aa: AnyAbility | undefined) => {
        const prevValue = anyAbility.current
        anyAbility.current = aa
        selectMapPosition.current(undefined)

        // Only run if something was changed
        if (prevValue !== aa || (prevValue && aa && !deepEqual(prevValue, aa))) {
            Object.values(onAnyAbilityUseCallbacks.current).forEach((cb) => cb(aa))
        }
    })

    const selectMapPosition = useRef((mapPos: MapSelection | undefined) => {
        const prevValue = selection.current
        selection.current = mapPos

        // Only run if something was changed
        if (prevValue !== mapPos || (prevValue && mapPos && !deepEqual(prevValue, mapPos))) {
            Object.values(onSelectMapPositionCallbacks.current).forEach((cb) => cb(mapPos, anyAbility.current))
        }
    })

    // Escape hot key
    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "Escape", () => {
            useAnyAbility.current(undefined)
            setHighlightedMechParticipantID(undefined)
        })
    }, [addToHotkeyRecord])

    // When battle ends, cancel abilities etc.
    useEffect(() => {
        if (battleState != BattleState.BattlingState) {
            useAnyAbility.current(undefined)
        }
    }, [battleState])

    const onTargetConfirm = useCallback(
        ({ startCoord, endCoord, mechHash }: { startCoord?: Position; endCoord?: Position; mechHash?: string }) => {
            try {
                // If no ability is selected, then return
                if (!anyAbility.current || !currentArenaID) return

                // We will construct the payload and then send it off
                const payload: {
                    arena_id: string
                    ability_id: string
                    blueprint_ability_id: string
                    location_select_type: string
                    start_coords?: Position
                    end_coords?: Position
                    mech_hash?: string
                } = {
                    arena_id: currentArenaID,
                    ability_id: anyAbility.current.id,
                    blueprint_ability_id: anyAbility.current.id,
                    location_select_type: anyAbility.current.location_select_type,
                }

                let endpoint = GameServerKeys.PlayerAbilityUse
                if (anyAbility.current.isSupportAbility) endpoint = GameServerKeys.PlayerSupportAbilityUse

                switch (anyAbility.current.location_select_type) {
                    case LocationSelectType.LineSelect:
                        if (!startCoord || !endCoord) {
                            newSnackbarMessage("Missing map target location(s).", "error")
                            return
                        }
                        payload.start_coords = viewportPositionToGridCell.current(startCoord.x, startCoord.y)
                        payload.end_coords = viewportPositionToGridCell.current(endCoord.x, endCoord.y)
                        break

                    case LocationSelectType.MechSelect:
                    case LocationSelectType.MechSelectAllied:
                    case LocationSelectType.MechSelectOpponent:
                        if (!mechHash) {
                            newSnackbarMessage("Missing mech hash.", "error")
                            return
                        }
                        payload.mech_hash = mechHash
                        setHighlightedMechParticipantID(undefined)
                        break

                    case LocationSelectType.MechCommand:
                    case LocationSelectType.LocationSelect:
                        if (!startCoord) {
                            newSnackbarMessage("Missing map target location.", "error")
                            return
                        }
                        payload.start_coords = viewportPositionToGridCell.current(startCoord.x, startCoord.y)
                        break

                    case LocationSelectType.Global:
                        break
                }

                // If it's mech move command, dont reset so player can keep moving the mech
                if (anyAbility.current?.location_select_type !== LocationSelectType.MechCommand) {
                    useAnyAbility.current(undefined)
                }

                send(endpoint, payload)
                selectMapPosition.current(undefined)
                newSnackbarMessage("Successfully submitted target location.", "success")
            } catch (err) {
                newSnackbarMessage(typeof err === "string" ? err : "Failed to submit target location.", "error")
                console.error(err)
            }
        },
        [currentArenaID, newSnackbarMessage, send],
    )

    return {
        // Generic stuff
        highlightedMechParticipantID,
        setHighlightedMechParticipantID,

        // Pixi and map related stuff
        mapRef,
        pixiMiniMapPixi,
        setPixiMiniMapPixi,
        mapScalingRef,
        gridSizeRef,
        mapItemMinSize,
        mapMousePosition,
        clientPositionToViewportPosition,
        gridCellToViewportPosition,

        // Ability use related stuff
        anyAbility,
        selection,
        useAnyAbility,
        selectMapPosition,
        onAnyAbilityUseCallbacks,
        onSelectMapPositionCallbacks,
        onTargetConfirm,
    }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
