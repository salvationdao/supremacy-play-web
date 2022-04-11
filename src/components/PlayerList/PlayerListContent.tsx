import { Stack } from "@mui/material"
import { useEffect, useMemo, useState, Dispatch } from "react"
import { PlayerItem } from ".."
import { useGame, useGameServerWebsocket } from "../../containers"
import { GameServerKeys } from "../../keys"
import { User } from "../../types"

export const PlayerListContent = ({
    user,
    activePlayers,
    setActivePlayers,
    inactivePlayers,
    setInactivePlayers,
}: {
    user: User
    activePlayers: User[]
    setActivePlayers: Dispatch<React.SetStateAction<User[]>>
    inactivePlayers: User[]
    setInactivePlayers: Dispatch<React.SetStateAction<User[]>>
}) => {
    const { state, subscribe } = useGameServerWebsocket()
    const { factionsAll } = useGame()
    const [newPlayerList, setNewPlayerList] = useState<User[]>()

    const faction = useMemo(() => factionsAll[user.faction_id], [])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<User[]>(GameServerKeys.SubPlayerList, (payload) => {
            if (!payload) return
            setNewPlayerList(payload)
        })
    }, [state, subscribe])

    useEffect(() => {
        if (!newPlayerList) return

        // For each player in current active list that's not in the new list, put into inactive list
        const newInactiveList: User[] = []
        activePlayers.forEach((p) => {
            if (newPlayerList.some((u) => u.id === p.id)) return
            newInactiveList.push(p)
        })
        inactivePlayers.forEach((p) => {
            if (newInactiveList.some((u) => u.id === p.id) || newPlayerList.some((u) => u.id === p.id)) return
            newInactiveList.push(p)
        })

        setActivePlayers(newPlayerList.sort((a, b) => a.username.localeCompare(b.username)))
        setInactivePlayers(newInactiveList.sort((a, b) => a.username.localeCompare(b.username)))
    }, [newPlayerList, setActivePlayers, setInactivePlayers])

    return (
        <Stack spacing=".6rem">
            {activePlayers.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} faction={faction} user={user} isActive />
            ))}
        </Stack>
    )
}
