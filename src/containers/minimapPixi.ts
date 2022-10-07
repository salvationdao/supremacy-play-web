import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { deepEqual } from "../helpers"
import { useGameServerCommandsFaction } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { Dimension, GAME_CLIENT_TILE_SIZE, LocationSelectType, Map, PlayerAbility, Position, Vector2i } from "../types"
import { useArena } from "./arena"
import { BattleState, useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"
import { RecordType, useHotkey } from "./hotkeys"
import { PlayerSupporterAbility } from "../components"

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

interface PixiMainItems {
    app: PIXI.Application
    viewport: Viewport
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
    const [pixiMainItems, setPixiMainItems] = useState<PixiMainItems>()
    const mapMousePosition = useRef<Position>()
    // Cache map related values into ref, so it can be used within subscription callbacks
    const mapRef = useRef<Map>()
    const mapScalingRef = useRef<Vector2i>({ x: 0, y: 0 }) // Map co-ordinate from server * mapScaling.x = position in viewport
    const gridSizeRef = useRef<Dimension>({ width: 50, height: 50 })
    const mapItemMinSize = useRef(20) // Use this when necessary, min size 1% of the map width

    // Update cached map values
    useEffect(() => {
        mapRef.current = map
        if (!map || !pixiMainItems) return
        mapScalingRef.current = { x: pixiMainItems.viewport.worldWidth / map.Width, y: pixiMainItems.viewport.worldHeight / map.Height }
        gridSizeRef.current = { width: (mapScalingRef.current.x * map.Width) / map.Cells_X, height: (mapScalingRef.current.y * map.Height) / map.Cells_Y }
        mapItemMinSize.current = Math.max(gridSizeRef.current.width, 0.03 * map.Width * mapScalingRef.current.x)
    }, [map, pixiMainItems])

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
    const playerAbility = useRef<PlayerAbility | undefined>()
    const supportAbility = useRef<PlayerSupporterAbility | undefined>()
    const selection = useRef<MapSelection | undefined>()
    const onAbilityUseCallbacks = useRef<{
        [name: string]: (playerAbility: PlayerAbility | undefined, supportAbility: PlayerSupporterAbility | undefined) => void
    }>({})
    const onSelectMapPositionCallbacks = useRef<{
        [name: string]: (mapPos: MapSelection | undefined, playerAbility: PlayerAbility | undefined, supportAbility: PlayerSupporterAbility | undefined) => void
    }>({})

    const usePlayerAbility = useRef((pa: PlayerAbility | undefined) => {
        const prevValue = playerAbility.current
        playerAbility.current = pa
        selectMapPosition.current(undefined)

        // Only run if something was changed
        if (prevValue !== pa || (prevValue && pa && !deepEqual(prevValue, pa))) {
            Object.values(onAbilityUseCallbacks.current).forEach((cb) => cb(pa, supportAbility.current))
        }
    })

    const useSupportAbility = useRef((sa: PlayerSupporterAbility | undefined) => {
        const prevValue = supportAbility.current
        supportAbility.current = sa
        selectMapPosition.current(undefined)

        // Only run if something was changed
        if (prevValue !== sa || (prevValue && sa && !deepEqual(prevValue, sa))) {
            Object.values(onAbilityUseCallbacks.current).forEach((cb) => cb(playerAbility.current, sa))
        }
    })

    const selectMapPosition = useRef((mapPos: MapSelection | undefined) => {
        const prevValue = selection.current
        selection.current = mapPos

        // Only run if something was changed
        if (prevValue !== mapPos || (prevValue && mapPos && !deepEqual(prevValue, mapPos))) {
            Object.values(onSelectMapPositionCallbacks.current).forEach((cb) => cb(mapPos, playerAbility.current, supportAbility.current))
        }
    })

    // Escape hot key
    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "Escape", () => {
            usePlayerAbility.current(undefined)
            useSupportAbility.current(undefined)
            setHighlightedMechParticipantID(undefined)
        })
    }, [addToHotkeyRecord])

    // When battle ends, cancel abilities etc.
    useEffect(() => {
        if (battleState != BattleState.BattlingState) {
            usePlayerAbility.current(undefined)
            useSupportAbility.current(undefined)
        }
    }, [battleState])

    const onTargetConfirm = useCallback(
        ({ startCoord, endCoord, mechHash }: { startCoord?: Position; endCoord?: Position; mechHash?: string }) => {
            if (!currentArenaID) return
            try {
                // If it's a winner (battle ability)
                // if (winner.current?.game_ability) {
                //     if (!startCoord) {
                //         throw new Error("Missing map target location.")
                //     }
                //
                //     payload = {
                //         arena_id: currentArenaID,
                //         blueprint_ability_id: "",
                //         location_select_type: "",
                //         start_coords: viewportPositionToGridCell.current(startCoord.x, startCoord.y),
                //         end_coords:
                //             winner.current.game_ability.location_select_type === LocationSelectType.LineSelect && endCoord
                //                 ? viewportPositionToGridCell.current(endCoord.x, endCoord.y)
                //                 : undefined,
                //     }
                //
                //     hubKey = GameServerKeys.SubmitAbilityLocationSelect
                //     useWinner.current(undefined)
                // } else
                if (supportAbility.current) {
                    const payload: {
                        ability_id: string
                        arena_id: string
                        location_select_type: string
                        start_coords?: Position
                        end_coords?: Position
                        mech_hash?: string
                    } = {
                        arena_id: currentArenaID,
                        ability_id: supportAbility.current.id,
                        location_select_type: supportAbility.current.location_select_type,
                    }
                    // Else if it's a player ability
                    switch (supportAbility.current.location_select_type) {
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
                        case LocationSelectType.LocationSelect:
                            if (!startCoord) {
                                newSnackbarMessage("Missing map target location(s).", "error")
                                return
                            }
                            payload.start_coords = viewportPositionToGridCell.current(startCoord.x, startCoord.y)
                            break
                        case LocationSelectType.Global:
                            break
                    }

                    // If it's mech move command, dont reset so player can keep moving the mech
                    if (playerAbility.current?.ability.location_select_type !== LocationSelectType.MechCommand) {
                        useSupportAbility.current(undefined)
                    }

                    send(GameServerKeys.PlayerSupportAbilityUse, payload)
                    newSnackbarMessage("Successfully submitted target location.", "success")
                } else if (playerAbility.current) {
                    const payload: {
                        arena_id: string
                        blueprint_ability_id: string
                        location_select_type: string
                        start_coords?: Position
                        end_coords?: Position
                        mech_hash?: string
                    } = {
                        arena_id: currentArenaID,
                        blueprint_ability_id: playerAbility.current.ability.id,
                        location_select_type: playerAbility.current.ability.location_select_type,
                    }
                    // Else if it's a player ability
                    switch (playerAbility.current.ability.location_select_type) {
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

                        case LocationSelectType.LocationSelect:
                        case LocationSelectType.MechCommand:
                            if (!startCoord) {
                                newSnackbarMessage("Missing map target location.", "error")
                                return
                            }
                            payload.start_coords = viewportPositionToGridCell.current(startCoord.x, startCoord.y)
                            payload.mech_hash = playerAbility.current.mechHash
                            break

                        case LocationSelectType.Global:
                            break
                    }

                    // If it's mech move command, dont reset so player can keep moving the mech
                    if (playerAbility.current?.ability.location_select_type !== LocationSelectType.MechCommand) {
                        usePlayerAbility.current(undefined)
                    }

                    send(GameServerKeys.PlayerAbilityUse, payload)
                    newSnackbarMessage("Successfully submitted target location.", "success")
                }
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
        pixiMainItems,
        setPixiMainItems,
        mapScalingRef,
        gridSizeRef,
        mapItemMinSize,
        mapMousePosition,
        clientPositionToViewportPosition,
        gridCellToViewportPosition,

        // Ability use related stuff
        playerAbility,
        supportAbility,
        selection,
        usePlayerAbility,
        useSupportAbility,
        selectMapPosition,
        onAbilityUseCallbacks,
        onSelectMapPositionCallbacks,
        onTargetConfirm,
    }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
