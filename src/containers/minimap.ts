import { useCallback, useEffect, useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { MapSelection } from "../components"
import { NullUUID } from "../constants"
import { useTimer } from "../hooks"
import { GameServerKeys } from "../keys"
import { useConsumables } from "./consumables"
import { useGame, WinnerAnnouncementResponse } from "./game"
import { useGameServerAuth } from "./gameServerAuth"
import { useGameServerWebsocket } from "./gameServerSocket"
import { useOverlayToggles } from "./overlayToggles"
import { useSnackbar } from "./snackbar"

const MiniMapState = ""

export const MiniMapContainer = createContainer(() => {
    const { state, subscribe } = useGameServerWebsocket()
    const { bribeStage } = useGame()
    const { factionID } = useGameServerAuth()
    const { playerAbility, setPlayerAbility } = useConsumables()
    const { newSnackbarMessage } = useSnackbar()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()

    // Map data
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [targeting, setTargeting] = useState(false)
    const [targeting2, setTargeting2] = useState(false)
    const [highlightedMechHash, setHighlightedMechHash] = useState<string>()

    // Battle ability countdown (reset whenever winner is changed)
    const countdown = useMemo(() => (winner && targeting ? useTimer(winner.end_time) : null), [winner, targeting])

    // Map controls
    const [enlarged, setEnlarged] = useState(false)
    const [selection, setSelection] = useState<MapSelection>()

    const resetSelection = useCallback(() => {
        if (winner && playerAbility) {
            setWinner(undefined)
        } else {
            setWinner(undefined)
            setPlayerAbility(undefined)
            setEnlarged(false)
        }
        setSelection(undefined)
    }, [winner, playerAbility])

    // Subscribe on winner announcements
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<WinnerAnnouncementResponse | undefined>(
            GameServerKeys.SubBribeWinnerAnnouncement,
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
            null,
        )
    }, [state, subscribe, factionID])

    // Toggle expand if user is using player ability or user is chosen to use battle ability
    useEffect(() => {
        if (winner && bribeStage?.phase === "LOCATION_SELECT") {
            // If battle ability is overriding player ability selection
            if (playerAbility) {
                setTargeting2(false)
                setEnlarged(false)
                const t = setTimeout(() => {
                    setEnlarged(true)
                    setTargeting2(true)
                }, 1000)
                return () => clearTimeout(t)
            } else {
                setEnlarged(true)
            }
        } else if (playerAbility) {
            setEnlarged(true)
        }
    }, [winner, bribeStage, playerAbility])

    useEffect(() => {
        if (!countdown) return

        if (countdown.totalSecRemain <= 1) {
            newSnackbarMessage("Failed to submit target location on time.", "error")
        }
    }, [countdown])

    useEffect(() => {
        setTargeting(!!(targeting2 && ((winner && bribeStage?.phase === "LOCATION_SELECT") || playerAbility)))
    }, [targeting2, winner, playerAbility, bribeStage?.phase])

    return {
        winner,
        setWinner,
        highlightedMechHash,
        setHighlightedMechHash,
        targeting,
        countdown,
        resetSelection,
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
