import { useMemo } from "react"
import { useGame } from "../../../../containers"
import { MapMech } from "./MapMech"

export const MapMechs = ({ isLargeMode }: { isLargeMode: boolean }) => {
    const { map, warMachines } = useGame()

    return useMemo(() => {
        if (!map || !warMachines || warMachines.length <= 0) return null
        return (
            <>
                {warMachines.map((wm) => (
                    <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} isLargeMode={isLargeMode} />
                ))}
            </>
        )
    }, [isLargeMode, map, warMachines])
}
