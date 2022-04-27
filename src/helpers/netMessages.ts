import { BattleAbilityProgress, GameAbilityProgress, NetMessageTick, NetMessageTickWarMachine, NetMessageType, ViewerLiveCount } from "../types"

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
        case NetMessageType.LiveVoting: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload = enc.decode(arr).substring(1)
            return { type, payload }
        }
        case NetMessageType.SpoilOfWarTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload = enc.decode(arr).substring(1).split("|")
            return { type, payload }
        }
        case NetMessageType.GameAbilityProgressTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)
            const payload = enc
                .decode(arr)
                .substring(1)
                .split("|")
                .map<GameAbilityProgress>((str) => {
                    const strArr = str.split("_")
                    return {
                        id: strArr[0],
                        offering_id: strArr[1],
                        sups_cost: strArr[2],
                        current_sups: strArr[3],
                        should_reset: strArr[4] == "1",
                    }
                })
            return { type, payload }
        }
        case NetMessageType.BattleAbilityProgressTick: {
            const enc = new TextDecoder("utf-8")
            const arr = new Uint8Array(buffer)

            const payload: BattleAbilityProgress[] = enc
                .decode(arr)
                .substring(1)
                .split("|")
                .map<BattleAbilityProgress>((str) => {
                    const strArr = str.split("_")
                    return {
                        faction_id: strArr[0],
                        sups_cost: strArr[1],
                        current_sups: strArr[2],
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
                other: 0,
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
                            payload.other = parseInt(strArr[1])
                            break
                    }
                })

            return { type, payload }
        }
    }
}
