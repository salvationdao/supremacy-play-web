import { Message } from "../../containers/ws"
import { WarMachineLiveState } from "../../types"
import { BinaryDataKey } from "../../hooks/useGameServer"

export const WarMachineStatsBinaryParser = (data: ArrayBuffer): Message => {
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

    return {
        uri: "",
        key: BinaryDataKey.WarMachineStats,
        payload: result,
        mt: window.performance.now(),
    }
}
