import React, { useMemo } from "react"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../../../../constants"
import { useGame, useSupremacy } from "../../../../../containers"
import { MapMech } from "./MapMech"

export const MapMechs = React.memo(function MapMechs() {
    const { battleIdentifier } = useSupremacy()
    return <MapMechsInner key={battleIdentifier} />
})

const MapMechsInner = () => {
    const { map, spawnedAI, orderedWarMachines } = useGame()

    const mapMechs = useMemo(() => {
        if (!orderedWarMachines || orderedWarMachines.length <= 0) return null

        return orderedWarMachines.map((wm, i) => <MapMech key={`map-mech-${wm.hash}`} warMachine={wm} label={i + 1} />)
    }, [orderedWarMachines])

    const mapAIs = useMemo(() => {
        if (!spawnedAI || spawnedAI.length <= 0) return null

        return spawnedAI.map((wm) => <MapMech key={`map-mech-${wm.hash}`} warMachine={wm} isAI label={wm.participantID - ADD_MINI_MECH_PARTICIPANT_ID} />)
    }, [spawnedAI])

    return useMemo(() => {
        if (!map || (!mapMechs && !mapAIs)) return null

        return (
            <>
                {mapMechs}
                {mapAIs}
            </>
        )
    }, [mapAIs, map, mapMechs])
}
