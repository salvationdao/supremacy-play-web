import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { NullUUID } from "../constants"
import { GameServerKeys } from "../keys"
import { WinnerAnnouncementResponse } from "./game"
import { useGameServerAuth } from "./gameServerAuth"
import { useGameServerWebsocket } from "./gameServerSocket"

export const MiniMapContainer = createContainer(() => {
    const { state, subscribe } = useGameServerWebsocket()
    const { factionID } = useGameServerAuth()

    const [winner, setWinner] = useState<WinnerAnnouncementResponse>()
    const [highlightedMechHash, setHighlightedMechHash] = useState<string | undefined>(undefined)

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

    return {
        winner,
        setWinner,
        highlightedMechHash,
        setHighlightedMechHash,
    }
})

export const MiniMapProvider = MiniMapContainer.Provider
export const useMiniMap = MiniMapContainer.useContainer
