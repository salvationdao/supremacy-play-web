import { NetMessageType, NetMessageTick } from '../types'

export const parseNetMessage = (buffer: ArrayBuffer): { type: NetMessageType; payload: unknown } | undefined => {
    console.log(new Uint8Array(buffer))
    const dv = new DataView(buffer)
    const type = dv.getUint8(0) as NetMessageType

    switch (type) {
        case NetMessageType.Tick: {
            const payload: NetMessageTick = { warmachines: [] }

            const count = dv.getUint8(1)
            for (let c = 0; c < count; c++) {
                const offset = 2 + c * 13

                const participantID = dv.getUint8(offset)
                const x = dv.getUint32(offset + 1, false)
                const y = dv.getUint32(offset + 5, false)
                const rotation = dv.getUint32(offset + 9, false)

                payload.warmachines.push({
                    participantID,
                    position: {
                        x,
                        y,
                    },
                    rotation,
                })
            }
            console.log(payload)
            return { type, payload }
        }
    }
}
