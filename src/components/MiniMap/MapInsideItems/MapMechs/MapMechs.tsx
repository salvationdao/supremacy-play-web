import { useMemo } from "react"
import { useGame } from "../../../../containers"
import { MapMech } from "./MapMech"

export const MapMechs = () => {
    const { map, warMachines, spawnedAI } = useGame()

    const mechs = useMemo(() => {
        if (!warMachines || warMachines.length <= 0) return null

        return warMachines.map((wm) => <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} />)
    }, [warMachines])

    const ai = useMemo(() => {
        if (!spawnedAI || spawnedAI.length <= 0) return null

        return spawnedAI.map((wm) => <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} isAI />)
    }, [spawnedAI])

    if (!map || (!mechs && !ai)) return null

    return (
        <>
            {mechs}
            {ai}
        </>
    )
}
