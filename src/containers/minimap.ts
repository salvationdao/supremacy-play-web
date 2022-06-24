import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth } from "."
import { MapSelection } from "../components"
import { useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { PlayerAbility } from "../types"
import { useGame, WinnerAnnouncementResponse } from "./game"

export const MiniMapContainer = createContainer(() => {
    const { bribeStage } = useGame()
    const { factionID } = useAuth()

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

    return {
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
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
