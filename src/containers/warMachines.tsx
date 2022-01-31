import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { useAuth, useGame } from '.'
import { MapWarMachine } from '../components'
import HubKey from '../keys'
import { WarMachineState } from '../types'
import { useWebsocket } from './socket'

export const WarMachinesContainer = createContainer(() => {
    const { state, subscribe } = useWebsocket()
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
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<WarMachineState[] | undefined>(
            HubKey.SubWarMachinesState,
            (payload) => {
                if (!payload) return
                setWarMachinesSub((prev) =>
                    prev?.map((wm) => {
                        const updates = payload.find((x) => x.tokenID === wm.tokenID)
                        if (!updates) return wm
                        const { position, rotation, health, shield } = updates
                        return { ...wm, position, rotation, health, shield }
                    }),
                )
            },
            null,
            true,
            true,
        )
    }, [state, subscribe, user])

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
