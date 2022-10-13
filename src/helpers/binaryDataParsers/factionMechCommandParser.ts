import { Message } from "../../containers/ws"
import { FactionMechCommand } from "../../components/BigDisplay/MiniMapNew/ViewportItems/MechMoveDests/MechMoveDests"
import { BinaryDataKey } from "../../hooks/useGameServer"

export const factionMechCommandParser = (buffer: ArrayBuffer): Message => {
    const enc = new TextDecoder("utf-8")
    const arr = new Uint8Array(buffer)
    const payload = enc.decode(arr).substring(1)

    if (!payload.length) {
        return {
            uri: "",
            key: BinaryDataKey.MechCommandMap,
            payload: [],
            mt: window.performance.now(),
        }
    }

    const result: FactionMechCommand[] = []

    payload.split("|").forEach((str) =>
        str.split("_").forEach((field, i) => {
            const fmc: FactionMechCommand = {
                id: "",
                battle_id: "",
                cell_x: 0,
                cell_y: 0,
                is_ai: false,
                is_ended: false,
            }
            switch (i) {
                case 0:
                    fmc.id = field
                    break
                case 1:
                    fmc.battle_id = field
                    break
                case 2:
                    fmc.cell_x = parseFloat(field)
                    break
                case 3:
                    fmc.cell_y = parseFloat(field)
                    break
                case 4:
                    fmc.is_ai = field === "1"
                    break
                case 5:
                    fmc.is_ended = field === "1"
                    break
            }

            result.push(fmc)
        }),
    )

    return {
        uri: "",
        key: BinaryDataKey.MechCommandMap,
        payload: result,
        mt: window.performance.now(),
    }
}
