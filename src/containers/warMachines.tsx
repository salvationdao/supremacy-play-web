import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useAuth, useGame } from '.'
import { MapWarMachine } from '../components'
import { NetMessageTick, NetMessageType, WarMachineState } from '../types'
import { useWebsocket } from './socket'

export const WarMachinesContainer = createContainer(() => {
    const { state, subscribeNetMessage } = useWebsocket()
    const { user } = useAuth()
    const { map, warMachines } = useGame()
    const [warMachinesSub, setWarMachinesSub] = useState<WarMachineState[] | undefined>([])
    const [mapWarMachines, setMapWarMachines] = useState<JSX.Element[]>([])

    // Initial one off fetch call on load
    useEffect(() => {
        setWarMachinesSub(warMachines)
    }, [warMachines])

    // War machine for the map (subscription)
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeNetMessage || !user) return
        return subscribeNetMessage<NetMessageTick | undefined>(NetMessageType.Tick, (payload) => {
            if (!payload) return
            setWarMachinesSub((prev) =>
                prev?.map((wm) => {
                    const updates = payload.warmachines.find((x) => x.participantID === wm.participantID)
                    if (!updates) return wm
                    const { position, rotation } = updates
                    return { ...wm, position, rotation }
                }),
            )
        })
    }, [state, subscribeNetMessage, user])

    // War machine JSX for the map
    useEffect(() => {
        if (!warMachinesSub || warMachinesSub.length <= 0 || !map) return

        const els: JSX.Element[] = warMachinesSub
            .filter((m) => !!m)
            .map((m) => (
                <div key={m.tokenID}>
                    <MapWarMachine warMachine={m} map={map} />
                </div>
            ))

        if (els.length > 0) setMapWarMachines(els)
    }, [warMachinesSub, map])

    return {
        warMachinesSub,
        mapWarMachines,
    }
})

export const WarMachinesProvider = WarMachinesContainer.Provider
export const useWarMachines = WarMachinesContainer.useContainer
