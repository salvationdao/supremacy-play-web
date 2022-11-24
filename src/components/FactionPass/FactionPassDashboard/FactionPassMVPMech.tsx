import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { Stack } from "@mui/material"

export const FactionPassMVPMech = () => {
    useGameServerSubscriptionFaction(
        {
            URI: "/mvp_staked_mech",
            key: GameServerKeys.SubFactionMVPStakedMech,
        },
        (payload) => {
            if (!payload) return
            console.log(payload)
        },
    )

    return <Stack flex={1}></Stack>
}
