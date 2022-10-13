import { Message } from "../../containers/ws"
import { DisplayedAbility, LocationSelectType, MechDisplayEffectType, MiniMapDisplayEffectType } from "../../types"
import { BinaryDataKey } from "../../hooks/useGameServer"

export const abilityEffectParser = (buffer: ArrayBuffer): Message => {
    const enc = new TextDecoder("utf-8")
    const arr = new Uint8Array(buffer)
    const payload = enc.decode(arr).substring(1)

    const list: DisplayedAbility[] = []
    if (payload.length) {
        payload.split("|").forEach((abilityEffectStr) => {
            const values = abilityEffectStr.split("_")
            list.push({
                offering_id: values[0],
                location: {
                    x: parseFloat(values[1]),
                    y: parseFloat(values[2]),
                },
                mech_id: values[3],
                image_url: values[4],
                colour: values[5],
                mini_map_display_effect_type: values[6] as MiniMapDisplayEffectType,
                mech_display_effect_type: values[7] as MechDisplayEffectType,
                location_select_type: values[8] as LocationSelectType,
            })
        })
    }

    return {
        uri: "",
        key: BinaryDataKey.MiniMapAbilityContents,
        payload: list,
        mt: window.performance.now(),
    }
}
