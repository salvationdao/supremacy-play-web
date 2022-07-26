import { Stack } from "@mui/material"
import { Dispatch } from "react"
import { PlayerItem } from "../.."
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { User } from "../../../types"

export const PlayerListContent = ({
    user,
    activePlayers,
    setActivePlayers,
}: {
    user: User
    activePlayers: User[]
    setActivePlayers: Dispatch<React.SetStateAction<User[]>>
}) => {
    useGameServerSubscriptionFaction<User[]>(
        {
            URI: "",
            key: GameServerKeys.SubPlayerList,
        },
        (payload) => {
            if (!payload) return
            setActivePlayers(payload.sort((a, b) => a.username.localeCompare(b.username)))
        },
    )

    return (
        <Stack spacing=".5rem">
            {activePlayers.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} user={user} isActive />
            ))}
        </Stack>
    )
}
