import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { deepEqual } from "../helpers"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { Dimension, GameAbility, GAME_CLIENT_TILE_SIZE, LocationSelectType, Map, PlayerAbility, Position, Vector2i } from "../types"
import { useArena } from "./arena"
import { useAuth } from "./auth"
import { useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"
import { RecordType, useHotkey } from "./hotkeys"

export const MAP_ITEM_MINI_SIZE = 18

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

export interface WinnerStruct {
    game_ability: GameAbility
    end_time: Date
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
    const { map, isBattleStarted } = useGame()
    const { factionID } = useAuth()
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
    // Cache map related values into ref so it can be used within subscription callbacks
    const mapRef = useRef<Map>()
    const mapScalingRef = useRef<Vector2i>({ x: 0, y: 0 }) // Map co-ordinate from server * mapScaling.x = position in viewport
    const gridSizeRef = useRef<Dimension>({ width: 50, height: 50 })

    // Update cached map values
    useEffect(() => {
        mapRef.current = map
        if (!map || !pixiMainItems) return
        mapScalingRef.current = { x: pixiMainItems.viewport.worldWidth / map.Width, y: pixiMainItems.viewport.worldHeight / map.Height }
        gridSizeRef.current = { width: (mapScalingRef.current.x * map.Width) / map.Cells_X, height: (mapScalingRef.current.y * map.Height) / map.Cells_Y }
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
    const winner = useRef<WinnerStruct | undefined>()
    const playerAbility = useRef<PlayerAbility | undefined>()
    const selection = useRef<MapSelection | undefined>()
    const onAbilityUseCallbacks = useRef<{
        [name: string]: (winner: WinnerStruct | undefined, playerAbility: PlayerAbility | undefined) => void
    }>({})
    const onSelectMapPositionCallbacks = useRef<{
        [name: string]: (mapPos: MapSelection | undefined, winner: WinnerStruct | undefined, playerAbility: PlayerAbility | undefined) => void
    }>({})

    const useWinner = useRef((wn: WinnerStruct | undefined) => {
        const prevValue = winner.current
        winner.current = wn
        selectMapPosition.current(undefined)

        // Only run if something was changed
        if (prevValue !== wn || (prevValue && wn && !deepEqual(prevValue, wn))) {
            Object.values(onAbilityUseCallbacks.current).forEach((cb) => cb(wn, playerAbility.current))
        }
    })

    const usePlayerAbility = useRef((pa: PlayerAbility | undefined) => {
        const prevValue = playerAbility.current
        playerAbility.current = pa
        selectMapPosition.current(undefined)

        // Only run if something was changed
        if (prevValue !== pa || (prevValue && pa && !deepEqual(prevValue, pa))) {
            Object.values(onAbilityUseCallbacks.current).forEach((cb) => cb(winner.current, pa))
        }
    })

    const selectMapPosition = useRef((mapPos: MapSelection | undefined) => {
        const prevValue = selection.current
        selection.current = mapPos

        // Only run if something was changed
        if (prevValue !== mapPos || (prevValue && mapPos && !deepEqual(prevValue, mapPos))) {
            Object.values(onSelectMapPositionCallbacks.current).forEach((cb) => cb(mapPos, winner.current, playerAbility.current))
        }
    })

    // Subscribe on winner announcements
    useGameServerSubscriptionSecuredUser<WinnerStruct | undefined>(
        {
            URI: "",
            key: GameServerKeys.SubBribeWinnerAnnouncement,
            ready: !!factionID,
        },
        (payload) => {
            if (!payload) return

            let endTime = payload.end_time
            const dateNow = new Date()
            const diff = endTime.getTime() - dateNow.getTime()

            // Just a temp fix, if user's pc time is not correct then at least set for them
            // Checked by seeing if they have at least 8s to do stuff
            if (endTime < dateNow || diff < 8000 || diff > 20000) {
                endTime = new Date(dateNow.getTime() + 15000)
            }

            useWinner.current({ ...payload, end_time: endTime })
        },
    )

    // Escape hot key
    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "Escape", () => {
            usePlayerAbility.current(undefined)
            setHighlightedMechParticipantID(undefined)
        })
    }, [addToHotkeyRecord])

    // When battle ends, cancel abilities etc.
    useEffect(() => {
        if (!isBattleStarted) {
            useWinner.current(undefined)
            usePlayerAbility.current(undefined)
        }
    }, [isBattleStarted])

    const onTargetConfirm = useCallback(
        ({ startCoord, endCoord, mechHash }: { startCoord?: Position; endCoord?: Position; mechHash?: string }) => {
            if (!currentArenaID) return

            let payload: {
                arena_id: string
                blueprint_ability_id: string
                location_select_type: string
                start_coords?: Position
                end_coords?: Position
                mech_hash?: string
            } | null = null

            let hubKey = GameServerKeys.PlayerAbilityUse

            try {
                // If its a winner (battle ability)
                if (winner.current?.game_ability) {
                    if (!startCoord) {
                        throw new Error("Missing map target location.")
                    }

                    payload = {
                        arena_id: currentArenaID,
                        blueprint_ability_id: "",
                        location_select_type: "",
                        start_coords: viewportPositionToGridCell.current(startCoord.x, startCoord.y),
                        end_coords:
                            winner.current.game_ability.location_select_type === LocationSelectType.LineSelect && endCoord
                                ? viewportPositionToGridCell.current(endCoord.x, endCoord.y)
                                : undefined,
                    }

                    hubKey = GameServerKeys.SubmitAbilityLocationSelect
                    useWinner.current(undefined)
                } else if (playerAbility.current) {
                    // Else if its a player ability
                    switch (playerAbility.current.ability.location_select_type) {
                        case LocationSelectType.LineSelect:
                            if (!startCoord || !endCoord) {
                                throw new Error("Missing map target location(s).")
                            }
                            payload = {
                                arena_id: currentArenaID,
                                blueprint_ability_id: playerAbility.current.ability.id,
                                location_select_type: playerAbility.current.ability.location_select_type,
                                start_coords: viewportPositionToGridCell.current(startCoord.x, startCoord.y),
                                end_coords: viewportPositionToGridCell.current(endCoord.x, endCoord.y),
                            }
                            break
                        case LocationSelectType.MechSelect:
                        case LocationSelectType.MechSelectAllied:
                        case LocationSelectType.MechSelectOpponent:
                            if (!mechHash) {
                                throw new Error("Missing mech hash.")
                            }
                            payload = {
                                arena_id: currentArenaID,
                                blueprint_ability_id: playerAbility.current.ability.id,
                                location_select_type: playerAbility.current.ability.location_select_type,
                                mech_hash: mechHash,
                            }
                            break

                        case LocationSelectType.LocationSelect:
                        case LocationSelectType.MechCommand:
                            if (!startCoord) {
                                throw new Error("Missing map target location.")
                            }
                            payload = {
                                arena_id: currentArenaID,
                                blueprint_ability_id: playerAbility.current.ability.id,
                                location_select_type: playerAbility.current.ability.location_select_type,
                                start_coords: viewportPositionToGridCell.current(startCoord.x, startCoord.y),
                                mech_hash: playerAbility.current.mechHash,
                            }
                            break

                        case LocationSelectType.Global:
                            break
                    }

                    // If it's mech move command, dont reset so player can keep moving the mech
                    if (playerAbility.current?.ability.location_select_type !== LocationSelectType.MechCommand) {
                        usePlayerAbility.current(undefined)
                    }

                    if (playerAbility.current?.ability.location_select_type === LocationSelectType.MechSelect) {
                        setHighlightedMechParticipantID(undefined)
                    }

                    if (!payload) {
                        throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                    }
                }

                send(hubKey, payload)
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
        pixiMainItems,
        setPixiMainItems,
        mapScalingRef,
        gridSizeRef,
        mapMousePosition,
        clientPositionToViewportPosition,
        gridCellToViewportPosition,

        // Ability use related stuff
        winner,
        playerAbility,
        selection,
        useWinner,
        usePlayerAbility,
        selectMapPosition,
        onAbilityUseCallbacks,
        onSelectMapPositionCallbacks,
        onTargetConfirm,
    }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
