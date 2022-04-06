import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { PlayerItem } from ".."
import { useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { User } from "../../types"

export const PlayerListContent = () => {
    const { state, subscribe } = useGameServerWebsocket()
    const [players, setPlayers] = useState<User[]>([])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<User[]>(GameServerKeys.SubPlayerList, (payload) => {
            if (!payload) return
            setPlayers(payload)
        })
    }, [state, subscribe])

    if (!players || players.length <= 0) return null

    return (
        <Stack spacing={0.6}>
            {players.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} />
            ))}
        </Stack>
    )
}
