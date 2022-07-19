import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { User } from "../../../types"
import { RanksTable } from "../Common/RanksTable"

interface RankItem {
    player: User
    view_battle_count: number
}

export const PlayerBattlesSpectated = () => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommands("/public/commander")
    const [rankItems, setRankItems] = useState<RankItem[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary
    const secondaryColor = theme.factionTheme.secondary
    const backgroundColor = theme.factionTheme.background

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
            title="MOST BATTLES SPECTATED"
            tableHeadings={["RANK", "PLAYER", "FACTION", "BATTLES SPECTATED"]}
            rankItems={rankItems}
            isLoading={isLoading}
            loadError={loadError}
            renderItem={(item, index) => {
                return [
                    <Typography key={1}>{index + 1}</Typography>,
                    <Typography key={2}>
                        {index}: {item.player.username}
                    </Typography>,
                    <Typography key={3}>
                        {index}: {item.player.username}
                    </Typography>,
                    <Typography key={4}>
                        {index}: {item.player.username}
                    </Typography>,
                ]
            }}
        />
    )
}
