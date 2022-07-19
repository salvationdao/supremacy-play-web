import { Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useSnackbar } from "../../../containers"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { User } from "../../../types"
import { RanksTable } from "../Common/RanksTable"

interface RankItem {
    player: User
    view_battle_count: number
}

export const PlayerBattlesSpectated = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommands("/public/commander")
    const [rankItems, setRankItems] = useState<RankItem[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<RankItem[]>(GameServerKeys.GetPlayerBattlesSpectated)

                if (!resp) return
                setLoadError(undefined)
                setRankItems(resp)
            } catch (e) {
                const message = typeof e === "string" ? e : "Failed to player battles spectated."
                setLoadError(message)
                newSnackbarMessage(message, "error")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [newSnackbarMessage, send])

    return (
        <RanksTable
            rankItems={rankItems}
            renderItem={(item) => <Typography key={item.player.id}>{item.player.username}</Typography>}
            isLoading={isLoading}
            loadError={loadError}
        />
    )
}
