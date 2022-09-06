import { useCallback, useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useGlobalNotifications } from "."
import { useDebounce } from "../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionSecuredUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BribeStage, GameAbility, LocationSelectType, PlayerAbility, Position } from "../types"
import { useArena } from "./arena"
import { useGame } from "./game"
import { RecordType, useHotkey } from "./hotkeys"

interface WinnerAnnouncementResponse {
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

export const MiniMapContainer = createContainer(() => {
    const { bribeStage, map, isBattleStarted } = useGame()
    const { factionID } = useAuth()
    const { currentArenaID } = useArena()
    const { addToHotkeyRecord } = useHotkey()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Map
    const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null)
    const gridWidth = useMemo(() => (map ? map.Width / map.Cells_X : 50), [map])
    const gridHeight = useMemo(() => (map ? map.Height / map.Cells_Y : 50), [map])

    // Map triggers
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()
    const [isTargeting, setIsTargeting] = useState(false)

    // Other stuff
    const [highlightedMechParticipantID, setHighlightedMechParticipantID] = useState<number>()
    const [selection, setSelectionDebounced, , setSelection] = useDebounce<MapSelection | undefined>(undefined, 250)

    // Subscribe on winner announcements
    useGameServerSubscriptionSecuredUser<WinnerAnnouncementResponse | undefined>(
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

    // Toggle expand if user is using player ability or user is chosen to use battle ability
    useEffect(() => {
        if (winner && bribeStage?.phase === BribeStage.LocationSelect) {
            if (!playerAbility) return setIsTargeting(true)
            // If battle ability is overriding player ability selection
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

    const resetPlayerAbilitySelection = useCallback(() => {
        setPlayerAbility(undefined)
        setSelection(undefined)
        setIsTargeting(!!winner?.game_ability)
    }, [winner?.game_ability, setSelection])

    const resetWinnerSelection = useCallback(() => {
        setSelection(undefined)
        setWinner(undefined)
        setIsTargeting(!!playerAbility)
    }, [playerAbility, setSelection])

    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, "Escape", () => {
            resetPlayerAbilitySelection()
            setHighlightedMechParticipantID(undefined)
        })
    }, [addToHotkeyRecord, resetPlayerAbilitySelection])

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

                if (!payload) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }
            }

            if (playerAbility?.ability.location_select_type === LocationSelectType.MechSelect) {
                setHighlightedMechParticipantID(undefined)
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
        resetPlayerAbilitySelection,
        resetWinnerSelection,
        winner?.game_ability,
        playerAbility,
        newSnackbarMessage,
        setHighlightedMechParticipantID,
        currentArenaID,
        setSelection,
    ])

    useEffect(() => {
        if (!isBattleStarted) {
            setWinner(undefined)
            resetWinnerSelection()
            resetPlayerAbilitySelection()
        }
    }, [isBattleStarted, resetWinnerSelection, resetPlayerAbilitySelection])

    return {
        mapElement,
        setMapElement,

        winner,
        highlightedMechParticipantID,
        setHighlightedMechParticipantID,
        isTargeting,
        selection,
        setSelection,
        setSelectionDebounced,
        resetWinnerSelection,
        resetPlayerAbilitySelection,
        playerAbility,
        setPlayerAbility,
        onTargetConfirm,
        gridWidth,
        gridHeight,
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
