import { Stack } from "@mui/material"
import { useMemo } from "react"
import { PlayerItem } from "../.."
import { useSupremacy } from "../../../containers"
import { User } from "../../../types"

export const PlayerListContent = ({ user, activePlayers }: { user: User; activePlayers: User[] }) => {
    const { getFaction } = useSupremacy()

    const faction = useMemo(() => getFaction(user.faction_id), [getFaction, user.faction_id])

    return (
        <Stack spacing=".5rem">
            {activePlayers.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} faction={faction} user={user} isActive />
            ))}
        </Stack>
    )
}
