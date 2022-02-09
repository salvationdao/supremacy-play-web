import { NetMessageType, NetMessageTick, NetMessageTickWarMachine, FactionAbilityTargetPrice } from '../types'

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

                warmachineUpdate.participantID = dv.getUint8(offset)
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
                warmachineUpdate.health = dv.getInt32(offset, false)
                offset += 4

                // Shield
                warmachineUpdate.shield = dv.getInt32(offset, false)
                offset += 4
                payload.warmachines.push(warmachineUpdate)
            }
            return { type, payload }
        }
        case NetMessageType.LiveVoting:
        case NetMessageType.VotePriceTick:
        case NetMessageType.VotePriceForecastTick: {
            const enc = new TextDecoder('utf-8')
            const arr = new Uint8Array(buffer)
            const payload = enc.decode(arr).substring(1)
            return { type, payload }
        }
        case NetMessageType.AbilityRightRatioTick: {
            const enc = new TextDecoder('utf-8')
            const arr = new Uint8Array(buffer)
            const payload = enc
                .decode(arr)
                .substring(1)
                .split(',')
                .map<number>((str) => parseInt(str) / 10000)
            return { type, payload }
        }
        case NetMessageType.FactionAbilityTargetPriceTick: {
            const enc = new TextDecoder('utf-8')
            const arr = new Uint8Array(buffer)
            const payload = enc
                .decode(arr)
                .substring(1)
                .split('|')
                .map<FactionAbilityTargetPrice>((str) => {
                    const strArr = str.split('_')
                    return {
                        id: strArr[0],
                        supsCost: strArr[1],
                        currentSups: strArr[2],
                        shouldReset: strArr[3] == '1',
                    }
                })
            return { type, payload }
        }
    }
}
