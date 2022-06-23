import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useConsumables } from "."
import { MapSelection } from "../components"
import { useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { useGame, WinnerAnnouncementResponse } from "./game"

export const MiniMapContainer = createContainer(() => {
    const { bribeStage } = useGame()
    const { factionID } = useAuth()
    const { playerAbility, setPlayerAbility } = useConsumables()

    // Map data
    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [isTargeting, setIsTargeting] = useState(false)
    const [highlightedMechHash, setHighlightedMechHash] = useState<string>()

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
        setIsTargeting(false)
    }, [winner, playerAbility, setPlayerAbility])

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
            // If battle ability is overriding player ability selection
            if (playerAbility) {
                // Close the map
                setIsTargeting(false)
                setEnlarged(false)
                setSelection(undefined)
                const t = setTimeout(() => {
                    // Then open the map again
                    setEnlarged(true)
                    setIsTargeting(true)
                }, 1000)
                return () => clearTimeout(t)
            } else {
                setEnlarged(true)
                setIsTargeting(true)
            }
        } else if (playerAbility) {
            setEnlarged(true)
            setIsTargeting(true)
        }
    }, [winner, bribeStage, playerAbility])

    return {
        enlarged,
        setEnlarged,
        winner,
        setWinner,
        highlightedMechHash,
        setHighlightedMechHash,
        isTargeting,
        selection,
        setSelection,
        resetSelection,
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
