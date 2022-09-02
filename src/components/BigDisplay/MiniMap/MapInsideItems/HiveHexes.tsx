import { Map as GameMap } from "../../../../types"
import { useMemo } from "react"

interface HiveHexesProps {
    map: GameMap
    state: boolean[]
}

export const HiveHexes = ({ map, state }: HiveHexesProps) => {
    return useMemo(
        () => (
            <>
                {state.map((raised, index) => (
                    <div key={`hex-${index}`}>{raised}</div>
                ))}
            </>
        ),
        [state],
    )
}
