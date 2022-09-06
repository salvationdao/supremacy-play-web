import { Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { SortDir } from "../../../types/marketplace"
import { BattleReplayItem } from "../BattlesReplays/BattleReplayItem"
import { GetReplaysRequest, GetReplaysResponse } from "../BattlesReplays/BattlesReplays"

export const RelatedReplayVideos = ({ battleReplay }: { battleReplay?: BattleReplay }) => {
    const { send } = useGameServerCommands("/public/commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [, setLoadError] = useState<string>()
    const [battleReplays, setBattleReplays] = useState<BattleReplay[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)

                const resp = await send<GetReplaysResponse, GetReplaysRequest>(GameServerKeys.GetReplays, {
                    sort: { direction: SortDir.Desc },
                    page: 1,
                    page_size: 5,
                    arena_id: battleReplay?.arena_id || "",
                })

                if (!resp) return
                setLoadError(undefined)
                // Exclude the current playing video
                setBattleReplays(resp.battle_replays.filter((br) => br.id !== battleReplay?.id))
            } catch (e) {
                setLoadError(typeof e === "string" ? e : "Failed to get replays.")
                console.error(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [battleReplay?.arena_id, battleReplay?.id, send])

    if (isLoading || !battleReplays || battleReplays.length <= 0) {
        return null
    }

    return (
        <Stack
            spacing="1rem"
            sx={{
                p: "1.8rem 2rem",
                backgroundColor: "#00000070",
            }}
        >
            <Typography sx={{ fontFamily: fonts.nostromoBlack }}>RELATED VIDEOS</Typography>

            <Stack spacing="2rem">
                {battleReplays.map((battleReplay) => {
                    return <BattleReplayItem key={battleReplay.id} battleReplay={battleReplay} noBackgroundColor />
                })}
            </Stack>
        </Stack>
    )
}
