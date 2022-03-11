import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerAuth, useGameServerWebsocket } from "."
import { GameServerKeys } from "../keys"

interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

const QueueContainer = createContainer(() => {
    const { state, subscribe } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const [queueLength, setQueueLength] = useState<number>(-1)
    const [queueCost, setQueueCost] = useState<string>("")
    const [contractReward, setContractReward] = useState<string>("")

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<QueueFeed>(GameServerKeys.SubQueueStatus, (payload) => {
            if (!payload) return
            setQueueLength(payload.queue_length)
            setQueueCost(payload.queue_cost)
            setContractReward(payload.contract_reward)
        })
    }, [state, subscribe, user])

    return { queueLength, queueCost, contractReward }
})

export const QueueProvider = QueueContainer.Provider
export const useQueue = QueueContainer.useContainer
