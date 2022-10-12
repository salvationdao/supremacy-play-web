import { useState } from "react"
import { BinaryDataKey, useGameServerSubscription } from "./useGameServer"
import { GameServerKeys } from "../keys"
import { decode } from "base64-arraybuffer"
import { WarMachineLiveState, WarMachineState } from "../types"
import { useArena } from "../containers"
import { Message } from "../containers/ws"

export const useWarMachineStat = (wm: WarMachineState) => {
    const { currentArenaID } = useArena()
    const [mechStat, setMechStat] = useState<WarMachineLiveState>({
        participant_id: wm.participantID,
        position: wm.position,
        rotation: wm.rotation,
        health: wm.health,
        shield: wm.shield,
        is_hidden: false,
    })

    useGameServerSubscription<WarMachineLiveState[]>(
        {
            URI: `/public/arena/${currentArenaID}/mech_stats`,
            binaryKey: BinaryDataKey.MechStats,
            binaryParser: WarMachineStatsBinaryParser,
        },
        (payload) => {
            if (!payload) return
            setMechStat((prev) => payload.find((p) => p.participant_id === wm.participantID) || prev)
        },
    )

    return {
        ...mechStat,
    }
}

const WarMachineStatsBinaryParser = (data: ArrayBuffer) => {
    const result: WarMachineLiveState[] = []

    const dv = new DataView(data)
    let offset = 1

    const count = dv.getUint8(offset)

    offset++
    for (let c = 0; c < count; c++) {
        const wms: WarMachineLiveState = {
            participant_id: dv.getUint8(offset),
            position: {
                x: -1,
                y: -1,
            },
            rotation: 0,
            health: 0,
            shield: 0,
            is_hidden: false,
        }

        offset += 1

        // position
        wms.position.x = dv.getInt32(offset)
        offset += 4
        wms.position.y = dv.getInt32(offset)
        offset += 4
        wms.rotation = dv.getInt32(offset)
        offset += 4

        // health
        wms.health = dv.getUint32(offset)
        offset += 4

        // shield
        wms.shield = dv.getUint32(offset)
        offset += 4

        // isHidden
        wms.is_hidden = dv.getUint8(offset) == 1
        offset += 1

        result.push(wms)
    }

    const message: Message = {
        uri: "",
        key: "",
        payload: result,
        mt: window.performance.now(),
    }

    return message
}
