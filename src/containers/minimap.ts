import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useGlobalNotifications } from "."
import { useGameServerCommandsFaction, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { GameAbility, LocationSelectType, PlayerAbility, Position } from "../types"
import { useToggle } from "./../hooks/useToggle"
import { useGame } from "./game"

export interface MapSelection {
    // start coords (used for LINE_SELECT and LOCATION_SELECT abilities)
    startCoords?: Position
    // end coords (only used for LINE_SELECT abilities)
    endCoords?: Position
    // mech hash (only used for MECH_SELECT abilities)
    mechHash?: string
}

interface WinnerAnnouncementResponse {
    game_ability: GameAbility
    end_time: Date
}

export const MiniMapContainer = createContainer(() => {
    const { bribeStage, map } = useGame()
    const { factionID } = useAuth()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Map
    const mapElement = useRef<HTMLDivElement>()
    const gridWidth = useMemo(() => (map ? map.width / map.cells_x : 50), [map])
    const gridHeight = useMemo(() => (map ? map.height / map.cells_y : 50), [map])

    // Map triggers
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()
    const [isEnlarged, toggleIsEnlarged] = useToggle()
    const [isTargeting, setIsTargeting] = useState(false)
    // Other stuff
    const [highlightedMechParticipantID, setHighlightedMechParticipantID] = useState<number>()
    const [selection, setSelection] = useState<MapSelection>()

    // Subscribe on winner announcements
    useGameServerSubscriptionUser<WinnerAnnouncementResponse | undefined>(
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
        if (winner && bribeStage?.phase === "LOCATION_SELECT") {
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
    }, [winner, bribeStage, playerAbility])

    const resetSelection = useCallback(() => {
        setWinner(undefined)
        setPlayerAbility(undefined)
        setSelection(undefined)
        setIsTargeting(false)
    }, [])

    const onTargetConfirm = useCallback(async () => {
        if (!selection) return
        try {
            if (winner?.game_ability) {
                if (!selection.startCoords) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }

                await send<boolean>(GameServerKeys.SubmitAbilityLocationSelect, {
                    start_coords: {
                        x: Math.floor(selection.startCoords.x),
                        y: Math.floor(selection.startCoords.y),
                    },
                    end_coords:
                        winner?.game_ability.location_select_type === LocationSelectType.LINE_SELECT && selection.endCoords
                            ? {
                                  x: Math.floor(selection.endCoords.x),
                                  y: Math.floor(selection.endCoords.y),
                              }
                            : undefined,
                })
                setPlayerAbility(undefined)
            } else if (playerAbility) {
                let payload: {
                    blueprint_ability_id: string
                    location_select_type: string
                    start_coords?: Position
                    end_coords?: Position
                    mech_hash?: string
                } | null = null
                switch (playerAbility.ability.location_select_type) {
                    case LocationSelectType.LINE_SELECT:
                        if (!selection.startCoords || !selection.endCoords) {
                            throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                        }
                        payload = {
                            blueprint_ability_id: playerAbility.ability.id,
                            location_select_type: playerAbility.ability.location_select_type,
                            start_coords: {
                                x: Math.floor(selection.startCoords.x),
                                y: Math.floor(selection.startCoords.y),
                            },
                            end_coords: {
                                x: Math.floor(selection.endCoords.x),
                                y: Math.floor(selection.endCoords.y),
                            },
                        }
                        break
                    case LocationSelectType.MECH_SELECT:
                        payload = {
                            blueprint_ability_id: playerAbility.ability.id,
                            location_select_type: playerAbility.ability.location_select_type,
                            mech_hash: selection.mechHash,
                        }
                        break
                    case LocationSelectType.LOCATION_SELECT:
                    case LocationSelectType.MECH_COMMAND:
                        if (!selection.startCoords) {
                            throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                        }
                        payload = {
                            blueprint_ability_id: playerAbility.ability.id,
                            location_select_type: playerAbility.ability.location_select_type,
                            start_coords: {
                                x: Math.floor(selection.startCoords.x),
                                y: Math.floor(selection.startCoords.y),
                            },
                            mech_hash: playerAbility.mechHash,
                        }
                        break
                    case LocationSelectType.GLOBAL:
                        break
                }

                if (!payload) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }
                await send<boolean, typeof payload>(GameServerKeys.PlayerAbilityUse, payload)
            }
            resetSelection()
            if (playerAbility?.ability.location_select_type === LocationSelectType.MECH_SELECT) {
                setHighlightedMechParticipantID(undefined)
            }
            newSnackbarMessage("Successfully submitted target location.", "success")
        } catch (err) {
            newSnackbarMessage(typeof err === "string" ? err : "Failed to submit target location.", "error")
            console.error(err)
            setSelection(undefined)
        }
    }, [send, selection, resetSelection, winner?.game_ability, playerAbility, newSnackbarMessage, setHighlightedMechParticipantID])

    return {
        mapElement,
        winner,
        setWinner,
        highlightedMechParticipantID,
        setHighlightedMechParticipantID,
        isTargeting,
        selection,
        setSelection,
        resetSelection,
        playerAbility,
        setPlayerAbility,
        onTargetConfirm,
        gridWidth,
        gridHeight,
        isEnlarged,
        toggleIsEnlarged,
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
