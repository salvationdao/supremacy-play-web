import { createContainer } from "unstated-next"
import { useWebsocket } from "./socket"
import { useEffect, useState } from "react"
import HubKey from "../keys"
import { useAuth } from "./auth"
import BigNumber from 'bignumber.js'
import { supFormatter } from '../components/GameBar/helpers'

interface QueueFeed {queue_length: number, queue_cost: string}

export const QueueContainer = createContainer(() => {
    const { state, subscribe } = useWebsocket()
    const { user } = useAuth()
    const [queueLength, setQueueLength] = useState<number>(-1)
    const [queueCost, setQueueCost] = useState<string>("")
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<QueueFeed>(HubKey.SubFactionQueueLength, (payload) => {
            setQueueLength(payload.queue_length)
            setQueueCost(`${parseFloat(supFormatter(`${payload.queue_cost}`, 18))}`)
        })
    }, [state, subscribe, user])

    return { queueLength, queueCost }
})

export const QueueProvider = QueueContainer.Provider
export const useQueue = QueueContainer.useContainer
