import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useDebounce } from "../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BribeStage, Dimension, GameAbility, GAME_CLIENT_TILE_SIZE, LocationSelectType, Map, PlayerAbility, Position, Vector2i } from "../types"
import { useArena } from "./arena"
import { useAuth } from "./auth"
import { useGame } from "./game"
import { useGlobalNotifications } from "./globalNotifications"
import { RecordType, useHotkey } from "./hotkeys"

interface WinnerStruct {
    game_ability: GameAbility
    end_time: Date
}

export interface MapSelection {
    // start coords (used for LINE_SELECT and LOCATION_SELECT abilities)
    startCoords?: Position
    // end coords (only used for LINE_SELECT abilities)
    endCoords?: Position
    // mech hash (only used for MECH_SELECT abilities)
    mechHash?: string
}

interface PixiMainItems {
    app: PIXI.Application
    viewport: Viewport
}

export const MiniMapPixiContainer = createContainer(() => {
    const { bribeStage, map, isBattleStarted } = useGame()
    const { factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { addToHotkeyRecord } = useHotkey()
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

    // Converts game client position (x, y) to (x, y) that fits into the viewport (viewport position)
    const clientPositionToViewportPosition = useRef((x: number, y: number) => {
        return {
            x: (x - (map?.Pixel_Left || 0)) * (gridSizeRef.current.width / GAME_CLIENT_TILE_SIZE),
            y: (y - (map?.Pixel_Top || 0)) * (gridSizeRef.current.height / GAME_CLIENT_TILE_SIZE),
        }
    })

    // Converts x and y cell to viewport position. E.g. grid cell (3, 5) may convert to x: 200, y: 516
    const gridCellToViewportPosition = useRef((xCell: number, yCell: number) => {
        return {
            x: xCell * gridSizeRef.current.width,
            y: yCell * gridSizeRef.current.height,
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
            setWinner({ ...payload, end_time: endTime })
        },
    )

    // Reset player ability
    const resetPlayerAbilitySelection = useCallback(() => {
        setPlayerAbility(undefined)
        setSelectionDebounced(undefined)
        setSelection(undefined)
        setIsTargeting(!!winner?.game_ability)
    }, [winner?.game_ability, setSelection, setSelectionDebounced])

    // Reset winner
    const resetWinnerSelection = useCallback(() => {
        setSelection(undefined)
        setWinner(undefined)
        setIsTargeting(!!playerAbility)
    }, [playerAbility, setSelection])

    // Escape hot key
    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "Escape", () => {
            resetPlayerAbilitySelection()
            setHighlightedMechParticipantID(undefined)
        })
    }, [addToHotkeyRecord, resetPlayerAbilitySelection])

    // Toggle expand if user is using player ability or user is chosen to use battle ability
    useEffect(() => {
        if (winner && bribeStage?.phase === BribeStage.LocationSelect) {
            if (!playerAbility) {
                setIsTargeting(true)
                return
            }

            // If winner ability is overriding player ability selection
            setIsTargeting(false)
            setSelection(undefined)
            const t = setTimeout(() => {
                // Then open the map again
                setIsTargeting(true)
            }, 1000)
            return () => clearTimeout(t)
        } else if (playerAbility) {
            setIsTargeting(true)
        }
    }, [winner, bribeStage, playerAbility, setSelection])

    // When battle ends, cancel abilities etc.
    useEffect(() => {
        if (!isBattleStarted) {
            setWinner(undefined)
            resetWinnerSelection()
            resetPlayerAbilitySelection()
        }
    }, [isBattleStarted, resetWinnerSelection, resetPlayerAbilitySelection])

    const onTargetConfirm = useCallback(async () => {
        if (!selection || !currentArenaID) return

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
            if (winner?.game_ability) {
                if (!selection.startCoords) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }

                payload = {
                    arena_id: currentArenaID,
                    blueprint_ability_id: "",
                    location_select_type: "",
                    start_coords: {
                        x: selection.startCoords.x,
                        y: selection.startCoords.y,
                    },
                    end_coords:
                        winner?.game_ability.location_select_type === LocationSelectType.LineSelect && selection.endCoords
                            ? {
                                  x: selection.endCoords.x,
                                  y: selection.endCoords.y,
                              }
                            : undefined,
                }

                hubKey = GameServerKeys.SubmitAbilityLocationSelect
                resetWinnerSelection()
            } else if (playerAbility) {
                switch (playerAbility.ability.location_select_type) {
                    case LocationSelectType.LineSelect:
                        if (!selection.startCoords || !selection.endCoords) {
                            throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                        }
                        payload = {
                            arena_id: currentArenaID,
                            blueprint_ability_id: playerAbility.ability.id,
                            location_select_type: playerAbility.ability.location_select_type,
                            start_coords: {
                                x: selection.startCoords.x,
                                y: selection.startCoords.y,
                            },
                            end_coords: {
                                x: selection.endCoords.x,
                                y: selection.endCoords.y,
                            },
                        }
                        break
                    case LocationSelectType.MechSelect:
                    case LocationSelectType.MechSelectAllied:
                    case LocationSelectType.MechSelectOpponent:
                        payload = {
                            arena_id: currentArenaID,
                            blueprint_ability_id: playerAbility.ability.id,
                            location_select_type: playerAbility.ability.location_select_type,
                            mech_hash: selection.mechHash,
                        }
                        break
                    case LocationSelectType.LocationSelect:
                    case LocationSelectType.MechCommand:
                        if (!selection.startCoords) {
                            throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                        }
                        payload = {
                            arena_id: currentArenaID,
                            blueprint_ability_id: playerAbility.ability.id,
                            location_select_type: playerAbility.ability.location_select_type,
                            start_coords: {
                                x: selection.startCoords.x,
                                y: selection.startCoords.y,
                            },
                            mech_hash: playerAbility.mechHash,
                        }
                        break
                    case LocationSelectType.Global:
                        break
                }

                // If it's mech move command, dont reset so player can keep moving the mech
                if (playerAbility?.ability.location_select_type === LocationSelectType.MechCommand) {
                    setSelection(undefined)
                } else {
                    resetPlayerAbilitySelection()
                }

                if (playerAbility?.ability.location_select_type === LocationSelectType.MechSelect) {
                    setHighlightedMechParticipantID(undefined)
                }

                if (!payload) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }
            }

            await send<boolean, typeof payload>(hubKey, payload)
            newSnackbarMessage("Successfully submitted target location.", "success")
        } catch (err) {
            newSnackbarMessage(typeof err === "string" ? err : "Failed to submit target location.", "error")
            console.error(err)
            setSelection(undefined)
        }
    }, [
        send,
        selection,
        winner?.game_ability,
        playerAbility,
        currentArenaID,
        newSnackbarMessage,
        resetPlayerAbilitySelection,
        resetWinnerSelection,
        setSelection,
        setHighlightedMechParticipantID,
    ])

    return {
        pixiMainItems,
        setPixiMainItems,
        mapScalingRef,
        gridSizeRef,
        clientPositionToViewportPosition,
        gridCellToViewportPosition,

        highlightedMechParticipantID,
        setHighlightedMechParticipantID,

        isTargeting,
        selection,
        setSelectionDebounced,
        setSelection,
        selectionInstant,
        winner,
        playerAbility,
        setPlayerAbility,
        resetPlayerAbilitySelection,
        resetWinnerSelection,
        onTargetConfirm,
    }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
