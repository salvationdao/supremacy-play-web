import { NetMessageType, NetMessageTick } from '../types'

export const parseNetMessage = (buffer: ArrayBuffer): { type: NetMessageType; payload: unknown } | undefined => {
    const dv = new DataView(buffer)
    const type = dv.getUint8(0) as NetMessageType

    switch (type) {
        case NetMessageType.Tick: {
            const payload: NetMessageTick = { warmachines: [] }

            const count = dv.getUint8(1)
            for (let c = 0; c < count; c++) {
                const offset = 2 + c * 13

                const participantID = dv.getUint8(offset)
                const x = dv.getInt32(offset + 1, false)
                const y = dv.getInt32(offset + 5, false)
                const rotation = dv.getInt32(offset + 9, false)

                payload.warmachines.push({
                    participantID,
                    position: {
                        x,
                        y,
                    },
                    rotation,
                })
            }
            return { type, payload }
        }
        case NetMessageType.LiveVoting: {
            const enc = new TextDecoder('utf-8')
            const arr = new Uint8Array(buffer)
            const payload = enc.decode(arr).substring(1)
            return { type, payload }
        }
    }
}
