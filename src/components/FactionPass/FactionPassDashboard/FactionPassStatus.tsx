import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { Stack } from "@mui/material"

export const FactionPassStatus = () => {
    useGameServerSubscriptionFaction(
        {
            URI: "/staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechCount,
        },
        (payload) => {
            console.log("staked mech count:", payload)
        },
    )

    useGameServerSubscriptionFaction<number>(
        {
            URI: "/in_queue_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechInQueueCount,
        },
        (payload) => {
            console.log("in queue staked mech count:", payload)
        },
    )

    useGameServerSubscriptionFaction<number>(
        {
            URI: "/damaged_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechDamagedCount,
        },
        (payload) => {
            console.log("damaged staked mech count:", payload)
        },
    )

    useGameServerSubscriptionFaction<number>(
        {
            URI: "/battle_ready_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechBattleReadyCount,
        },
        (payload) => {
            console.log("battle ready staked mech count:", payload)
        },
    )

    useGameServerSubscriptionFaction<number>(
        {
            URI: "/in_battle_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechInBattleCount,
        },
        (payload) => {
            console.log("in battle staked mech count:", payload)
        },
    )

    useGameServerSubscriptionFaction<number>(
        {
            URI: "/battled_staked_mech_count",
            key: GameServerKeys.SubFactionStakedMechBattledCount,
        },
        (payload) => {
            console.log("battle staked mech count:", payload)
        },
    )

    return <Stack flex={1}></Stack>
}
