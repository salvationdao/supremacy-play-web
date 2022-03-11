import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerAuth, useGameServerWebsocket } from "."
import { supFormatter } from "../helpers"
import { GameServerKeys } from "../keys"

interface QueueFeed {
    queue_length: number
    queue_cost: string
}

const QueueContainer = createContainer(() => {
    const { state, subscribe } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const [queueLength, setQueueLength] = useState<number>(-1)
    const [queueCost, setQueueCost] = useState<string>("")

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<QueueFeed>(GameServerKeys.SubFactionQueueLength, (payload) => {
            if (!payload) return
            setQueueLength(payload.queue_length)
            setQueueCost(`${parseFloat(supFormatter(`${payload.queue_cost}`, 18))}`)
        })
    }, [state, subscribe, user])

    return { queueLength, queueCost }
})

export const QueueProvider = QueueContainer.Provider
export const useQueue = QueueContainer.useContainer
