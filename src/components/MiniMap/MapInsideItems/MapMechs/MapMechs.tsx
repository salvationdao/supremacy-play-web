import { useMemo } from "react"
import { useGame } from "../../../../containers"
import { MapMech } from "./MapMech"

export const MapMechs = () => {
    const { map, warMachines } = useGame()

    return useMemo(() => {
        if (!map || !warMachines || warMachines.length <= 0) return null
        return (
            <>
                {warMachines.map((wm) => (
                    <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} />
                ))}
            </>
        )
    }, [map, warMachines])
}
