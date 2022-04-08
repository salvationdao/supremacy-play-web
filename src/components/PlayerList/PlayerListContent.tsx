import { Stack } from "@mui/material"
import { useEffect, useMemo, useState, Dispatch } from "react"
import { PlayerItem, UserActive } from ".."
import { useGame, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { User } from "../../types"

export const PlayerListContent = ({
    user,
    players,
    setPlayers,
}: {
    user: User
    players: UserActive[]
    setPlayers: Dispatch<React.SetStateAction<UserActive[]>>
}) => {
    const { state, subscribe } = useGameServerWebsocket()
    const { factionsAll } = useGame()
    const [activePlayers, setActivePlayer] = useState<User[]>([])

    const faction = useMemo(() => factionsAll[user.faction_id], [])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<User[]>(GameServerKeys.SubPlayerList, (payload) => {
            if (!payload) return
            setActivePlayer(payload)
        })
    }, [state, subscribe])

    useEffect(() => {
        // get a copy of current list
        const list = [...players]

        // add new players that is not in the list
        activePlayers.forEach((u) => {
            if (list.some((user) => user.id === u.id)) return
            // otherwise add them into the list
            list.push({ ...u, is_active: true })
        })

        // update player active list
        setPlayers(list.map((u) => ({ ...u, is_active: activePlayers.some((user) => user.id === u.id) })).sort((a) => (a.is_active ? -1 : 1)))
    }, [activePlayers, setPlayers])

    if (!players || players.length <= 0) return null

    return (
        <Stack spacing=".6rem">
            {players.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} faction={faction} user={user} />
            ))}
        </Stack>
    )
}
