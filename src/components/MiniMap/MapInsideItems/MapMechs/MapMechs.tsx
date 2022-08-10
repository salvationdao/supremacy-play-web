import { useMemo } from "react"
import { useGame, useSupremacy } from "../../../../containers"
import { MapMech } from "./MapMech"

export const MapMechs = () => {
    const { battleIdentifier } = useSupremacy()
    return <MapMechsInner key={battleIdentifier} />
}

const MapMechsInner = () => {
    const { map, warMachines, spawnedAI } = useGame()

    const mechs = useMemo(() => {
        if (!warMachines || warMachines.length <= 0) return null

        return warMachines.map((wm) => <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} />)
    }, [warMachines])

    const ai = useMemo(() => {
        if (!spawnedAI || spawnedAI.length <= 0) return null

        return spawnedAI.map((wm) => <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} isAI />)
    }, [spawnedAI])

    return useMemo(() => {
        if (!map || (!mechs && !ai)) return null

        return (
            <>
                {mechs}
                {ai}
            </>
        )
    }, [ai, map, mechs])
}
