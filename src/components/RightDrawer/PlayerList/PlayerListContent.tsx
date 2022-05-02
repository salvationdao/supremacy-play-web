import { Stack } from "@mui/material"
import { useEffect, useMemo, Dispatch } from "react"
import { PlayerItem } from "../.."
import { useSupremacy, useGameServerWebsocket } from "../../../containers"
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
    const { state, subscribe } = useGameServerWebsocket()
    const { factionsAll } = useSupremacy()

    const faction = useMemo(() => factionsAll[user.faction_id], [factionsAll, user.faction_id])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<User[]>(GameServerKeys.SubPlayerList, (payload) => {
            if (!payload) return
            setActivePlayers(payload.sort((a, b) => a.username.localeCompare(b.username)))
        })
    }, [setActivePlayers, state, subscribe])

    return (
        <Stack spacing=".5rem">
            {activePlayers.map((p) => (
                <PlayerItem key={`active-player-${p.id}`} player={p} faction={faction} user={user} isActive />
            ))}
        </Stack>
    )
}
