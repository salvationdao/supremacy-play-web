import { Stream } from "@cloudflare/stream-react"
import { useGameServerCommands } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { BattleReplay } from "../../../../types"
import { useEffect, useState } from "react"
import { CircularProgress, Stack } from "@mui/material"
import { useTheme } from "../../../../containers/theme"

interface GetReplayRequest {
    battle_number: number
    arena_gid: number
}


export const BattleReplayPlayer = (
    {
        battleNumber,
        gid,
    }: {
        battleNumber: number
        gid: number
    }) => {
    const theme = useTheme()
    const { send } = useGameServerCommands("/public/commander")
    const [isLoading, setIsLoading] = useState(true)
    const [replay, setReplay] = useState<BattleReplay>()

    const primaryColor = theme.factionTheme.primary

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
                const resp = await send<BattleReplay, GetReplayRequest>(GameServerKeys.GetReplayDetails, {
                    battle_number: battleNumber,
                    arena_gid: gid,
                })

                if (!resp) return
                setReplay(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get key card listings."
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send])

    return (
        <>
            {isLoading && (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )}

            {!isLoading && replay && (
                <Stream controls src={replay.stream_id} autoplay={true} primaryColor={primaryColor} />
            )}
        </>
    )
}