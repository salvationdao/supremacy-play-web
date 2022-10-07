import { useCallback, useEffect, useState } from "react"
import { useArena } from "../../../../../containers"
import { MECH_ABILITY_KEY, RecordType, useHotkey } from "../../../../../containers/hotkeys"
import { useGameServerCommandsFaction, useGameServerSubscriptionFaction } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { AnyAbility } from "../../../../../types"
import { PixiMechAbilities } from "./pixiMechAbilities"
import { PixiMechAbility } from "./pixiMechAbility"

export const MechAbility = ({
    pixiMechAbilities,
    hash,
    participantID,
    anyAbility,
    index,
}: {
    pixiMechAbilities: PixiMechAbilities
    hash: string
    participantID: number
    anyAbility?: AnyAbility
    index: number
}) => {
    const { currentArenaID } = useArena()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { addToHotkeyRecord } = useHotkey()
    const [pixiMechAbility, setPixiMechAbility] = useState<PixiMechAbility>()

    // Initial setup for the mech and show on the map
    useEffect(() => {
        if (!anyAbility) return
        const pixiMechAbility = new PixiMechAbility(index, anyAbility)
        pixiMechAbilities.addMechAbility(pixiMechAbility, index)
        setPixiMechAbility((prev) => {
            prev?.destroy()
            return pixiMechAbility
        })
    }, [index, pixiMechAbilities, anyAbility])

    // Cleanup
    useEffect(() => {
        return () => pixiMechAbility?.destroy()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pixiMechAbility])

    useGameServerSubscriptionFaction<number | undefined>(
        {
            URI: `/arena/${currentArenaID}/mech/${participantID}/abilities/${anyAbility?.id}/cool_down_seconds`,
            key: GameServerKeys.SubMechAbilityCoolDown,
            ready: !!currentArenaID && !!participantID && !!pixiMechAbility && !!anyAbility,
        },
        (payload) => {
            if (payload === undefined || payload <= 0) return
            pixiMechAbility?.setCountdown(payload)
        },
    )

    const onTrigger = useCallback(async () => {
        if (!currentArenaID) return

        if (anyAbility) {
            try {
                await send<boolean, { arena_id: string; mech_hash: string; game_ability_id: string }>(GameServerKeys.TriggerWarMachineAbility, {
                    arena_id: currentArenaID,
                    mech_hash: hash,
                    game_ability_id: anyAbility.id,
                })
            } catch (e) {
                console.error(e)
            }
        }
    }, [currentArenaID, anyAbility, hash, send])

    // Add trigger to hotkeys
    useEffect(() => {
        addToHotkeyRecord(RecordType.MiniMap, MECH_ABILITY_KEY[index], onTrigger)
    }, [onTrigger, addToHotkeyRecord, index])

    // Add trigger when clicking on the image
    useEffect(() => {
        if (!pixiMechAbility) return
        pixiMechAbility.updateOnClick(onTrigger)
    }, [onTrigger, pixiMechAbility])

    return null
}
