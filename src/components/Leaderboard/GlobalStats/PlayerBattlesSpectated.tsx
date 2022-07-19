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
            rankItems={rankItems}
            isLoading={isLoading}
            loadError={loadError}
            renderItem={(item, index) => {
                return (
                    <Stack
                        key={item.player.id}
                        direction="row"
                        alignItems="center"
                        sx={{ backgroundColor: index % 2 === 0 ? "#FFFFFF10" : "unset", p: ".6rem 2rem" }}
                    >
                        <Typography>
                            {index}: {item.player.username}
                        </Typography>
                    </Stack>
                )
            }}
        />
    )
}
