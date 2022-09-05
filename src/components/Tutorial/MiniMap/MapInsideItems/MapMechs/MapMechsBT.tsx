import { useMemo } from "react"
import { useTraining } from "../../../../../containers"
import { MapMechBT } from "./MapMechBT"

export const MapMechsBT = () => {
    const { map, warMachines } = useTraining()

    return useMemo(() => {
        if (!map || !warMachines || warMachines.length <= 0) return null
        return (
            <>
                {warMachines.map((wm) => (
                    <MapMechBT key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} />
                ))}
            </>
        )
    }, [map, warMachines])
}
