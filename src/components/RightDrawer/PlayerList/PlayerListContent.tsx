import { Stack } from "@mui/material"
import { PlayerItem } from "../.."
import { User } from "../../../types"

export const PlayerListContent = ({ user, activePlayers }: { user: User; activePlayers: User[] }) => {
    return (
        <Stack spacing=".5rem">
            {activePlayers.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} user={user} isActive />
            ))}
        </Stack>
    )
}
