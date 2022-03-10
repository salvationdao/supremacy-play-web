import {
    GameAbilityTargetPrice,
    NetMessageTick,
    NetMessageTickWarMachine,
    NetMessageType,
    ViewerLiveCount,
} from "../types"

export const parseNetMessage = (buffer: ArrayBuffer): { type: NetMessageType; payload: unknown } | undefined => {
    const dv = new DataView(buffer)
    const type = dv.getUint8(0) as NetMessageType

    switch (type) {
        case NetMessageType.Tick: {
            const payload: NetMessageTick = { warmachines: [] }

            const count = dv.getUint8(1)
            let offset = 2
            for (let c = 0; c < count; c++) {
                const warmachineUpdate: NetMessageTickWarMachine = {}

                warmachineUpdate.participant_id = dv.getUint8(offset)
                offset++

                // Get Sync byte (tells us which data was updated for this warmachine)
                const syncByte = dv.getUint8(offset)
                offset++

                // Position + Yaw
                if (syncByte >= 100) {
                    const x = dv.getInt32(offset, false)
                    offset += 4
                    const y = dv.getInt32(offset, false)
                    offset += 4
                    warmachineUpdate.position = { x, y }
                    warmachineUpdate.rotation = dv.getInt32(offset, false)
                    offset += 4
                }

                // Health
                if (syncByte == 1 || syncByte == 11 || syncByte == 101 || syncByte == 111) {
                    warmachineUpdate.health = dv.getInt32(offset, false)
                    offset += 4
                }
                // Shield
                if (syncByte == 10 || syncByte == 11 || syncByte == 110 || syncByte == 111) {
                    warmachineUpdate.shield = dv.getInt32(offset, false)
                    offset += 4
                }
                payload.warmachines.push(warmachineUpdate)
            }
            return { type, payload }
        }
        case NetMessageType.LiveVoting:
        case NetMessageType.VotePriceTick:
        case NetMessageType.SpoilOfWarTick:
        case NetMessageType.VotePriceForecastTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload = enc.decode(arr).substring(1)
            return { type, payload }
        }
        case NetMessageType.AbilityRightRatioTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload = enc
                .decode(arr)
                .substring(1)
                .split(",")
                .map<number>((str) => parseInt(str) / 10000)
            return { type, payload }
        }
        case NetMessageType.GameAbilityTargetPriceTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload = enc
                .decode(arr)
                .substring(1)
                .split("|")
                .map<GameAbilityTargetPrice>((str) => {
                    const strArr = str.split("_")
                    return {
                        id: strArr[0],
                        sups_cost: strArr[1],
                        current_sups: strArr[2],
                        should_reset: strArr[3] == "1",
                    }
                })
            return { type, payload }
        }
        case NetMessageType.ViewerLiveCountTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload: ViewerLiveCount = {
                red_mountain: 0,
                boston: 0,
                zaibatsu: 0,
                Other: 0,
            }
            enc.decode(arr)
                .substring(1)
                .split("|")
                .forEach((str) => {
                    const strArr = str.split("_")
                    switch (strArr[0]) {
                        case "R":
                            payload.red_mountain = parseInt(strArr[1])
                            break
                        case "B":
                            payload.boston = parseInt(strArr[1])
                            break
                        case "Z":
                            payload.zaibatsu = parseInt(strArr[1])
                            break
                        case "O":
                            payload.Other = parseInt(strArr[1])
                            break
                    }
                })

            return { type, payload }
        }
    }
}
