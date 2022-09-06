import { useMemo } from "react"
import { ADD_MINI_MECH_PARTICIPANT_ID } from "../../../../../constants"
import { useGame, useSupremacy } from "../../../../../containers"
import { MapMech } from "./MapMech"

interface MapMechsProps {
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

export const MapMechs = (props: MapMechsProps) => {
    const { battleIdentifier } = useSupremacy()
    return <MapMechsInner key={battleIdentifier} {...props} />
}

const MapMechsInner = ({ poppedOutContainerRef }: MapMechsProps) => {
    const { map, spawnedAI, orderedWarMachines } = useGame()

    const mechs = useMemo(() => {
        if (!orderedWarMachines || orderedWarMachines.length <= 0) return null

        return orderedWarMachines.map((wm, i) => (
            <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} label={i + 1} poppedOutContainerRef={poppedOutContainerRef} />
        ))
    }, [orderedWarMachines, poppedOutContainerRef])

    const ai = useMemo(() => {
        if (!spawnedAI || spawnedAI.length <= 0) return null

        return spawnedAI.map((wm) => (
            <MapMech key={`${wm.participantID} - ${wm.hash}`} warMachine={wm} isAI label={wm.participantID - ADD_MINI_MECH_PARTICIPANT_ID} />
        ))
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
