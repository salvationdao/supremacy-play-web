import { Stack } from "@mui/material"
import { useMemo, Dispatch } from "react"
import { PlayerItem } from "../.."
import { useSupremacy } from "../../../containers"
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
    const { getFaction } = useSupremacy()

    const faction = useMemo(() => getFaction(user.faction_id), [getFaction, user.faction_id])

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
                <PlayerItem key={`active-player-${p.id}`} player={p} faction={faction} user={user} isActive />
            ))}
        </Stack>
    )
}
