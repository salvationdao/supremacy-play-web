import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useSnackbar } from "."
import { MapSelection } from "../components"
import { useGameServerCommandsFaction, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { CellCoords, LocationSelectType, PlayerAbility } from "../types"
import { useGame, WinnerAnnouncementResponse } from "./game"

export const MiniMapContainer = createContainer(() => {
    const { bribeStage, map } = useGame()
    const { factionID } = useAuth()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Map
    const mapElement = useRef<HTMLDivElement>()
    const gridWidth = useMemo(() => (map ? map.width / map.cells_x : 50), [map])
    const gridHeight = useMemo(() => (map ? map.height / map.cells_y : 50), [map])

    // Map triggers
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [playerAbility, setPlayerAbility] = useState<PlayerAbility>()
    const [isTargeting, setIsTargeting] = useState(false)

    // Other stuff
    const [highlightedMechHash, setHighlightedMechHash] = useState<string>()
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

    const resetSelection = useCallback(
        (resetAll?: boolean) => {
            if (winner && playerAbility && !resetAll) {
                setWinner(undefined)
            } else {
                setWinner(undefined)
                setPlayerAbility(undefined)
            }
            setSelection(undefined)
            setIsTargeting(false)
        },
        [winner, playerAbility, setPlayerAbility],
    )

    const onTargetConfirm = useCallback(async () => {
        if (!selection) return
        try {
            if (winner?.game_ability) {
                if (!selection.startCoords) {
                    throw new Error("Something went wrong while activating this ability. Please try again, or contact support if the issue persists.")
                }
                await send<boolean, { x: number; y: number }>(GameServerKeys.SubmitAbilityLocationSelect, {
                    x: Math.floor(selection.startCoords.x),
                    y: Math.floor(selection.startCoords.y),
                })
            } else if (playerAbility) {
                let payload: {
                    blueprint_ability_id: string
                    location_select_type: string
                    start_coords?: CellCoords
                    end_coords?: CellCoords
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
                setHighlightedMechHash(undefined)
            }
            newSnackbarMessage("Successfully submitted target location.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to submit target location.", "error")
            console.error(e)
        }
    }, [send, selection, resetSelection, winner?.game_ability, playerAbility, newSnackbarMessage, setHighlightedMechHash])

    return {
        mapElement,
        winner,
        setWinner,
        highlightedMechHash,
        setHighlightedMechHash,
        isTargeting,
        selection,
        setSelection,
        resetSelection,
        playerAbility,
        setPlayerAbility,
        onTargetConfirm,
        gridWidth,
        gridHeight,
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
