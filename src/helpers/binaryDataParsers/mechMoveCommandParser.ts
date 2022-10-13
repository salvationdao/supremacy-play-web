import { Message } from "../../containers/ws"
import { BinaryDataKey } from "../../hooks/useGameServer"
import { MechMoveCommand } from "../../types"

export const mechMoveCommandParser = (buffer: ArrayBuffer): Message => {
    const enc = new TextDecoder("utf-8")
    const arr = new Uint8Array(buffer)
    const payload = enc.decode(arr).substring(1)

    if (!payload.length) {
        return {
            uri: "",
            key: BinaryDataKey.MechCommandIndividual,
            payload: undefined,
            mt: window.performance.now(),
        }
    }

    const result: MechMoveCommand = {
        cell_x: 0,
        cell_y: 0,
        id: "",
        is_mini_mech: false,
        is_moving: false,
        mech_id: "",
        remain_cooldown_seconds: 0,
        triggered_by_id: "",
    }
    payload.split("_").forEach((str, i) => {
        switch (i) {
            case 0:
                result.id = str
                break
            case 1:
                result.arena_id = str
                break
            case 2:
                result.battle_id = str
                break
            case 3:
                result.mech_id = str
                break
            case 4:
                result.triggered_by_id = str
                break
            case 5:
                result.cell_x = parseFloat(str)
                break
            case 6:
                result.cell_y = parseFloat(str)
                break
            case 7:
                result.cancelled_at = str
                break
            case 8:
                result.reached_at = str
                break
            case 9:
                result.is_moving = str === "1"
                break
            case 10:
                result.is_mini_mech = str === "1"
                break
        }
    })

    return {
        uri: "",
        key: BinaryDataKey.MechCommandIndividual,
        payload: result,
        mt: window.performance.now(),
    }
}
