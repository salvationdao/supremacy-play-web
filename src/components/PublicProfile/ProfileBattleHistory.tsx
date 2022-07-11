import { Stack, CircularProgress, Typography, colors, Box } from "@mui/material"
import { useState, useCallback, useEffect } from "react"
import { camelToTitle } from "../../helpers"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { theme } from "../../theme/theme"
import { BattleMechHistory } from "../../types"
import { HistoryEntry } from "../Hangar/WarMachinesHangar/Common/MechHistory/HistoryEntry"

export const ProfileMechHistory = ({ playerID }: { playerID: string }) => {
    const { send } = useGameServerCommands("/public/commander")

    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    // get history
    const fetchHistory = useCallback(async () => {
        try {
            setHistoryLoading(true)
            const resp = await send<{
                total: number
                battle_history: BattleMechHistory[]
            }>(GameServerKeys.PlayerBattleMechHistoryList, {
                player_id: playerID,
            })

            setHistory(resp.battle_history)
        } catch (e) {
            if (typeof e === "string") {
                setHistoryError(e)
            } else if (e instanceof Error) {
                setHistoryError(e.message)
            }
        } finally {
            setHistoryLoading(false)
        }
    }, [playerID, send])

    useEffect(() => {
        fetchHistory()
    }, [send, fetchHistory])

    if (historyLoading) {
        return (
            <Stack justifyContent="center" alignItems="center" sx={{ height: "6rem" }}>
                <CircularProgress size="2rem" sx={{ mt: "2rem", color: theme.factionTheme.primary }} />
            </Stack>
        )
    }
    if (!historyLoading && historyError) {
        return (
            <Stack sx={{ flex: 1, px: "1rem" }}>
                <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{historyError}</Typography>
            </Stack>
        )
    }

    return (
        <Box sx={{ direction: "ltr", height: 0, width: "100%" }}>
            <Box
                sx={{
                    width: "100%",
                    py: "1rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(29rem, 1fr))",
                    gap: "1.3rem",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "visible",
                }}
            >
                {history.map((h, idx) => {
                    return (
                        <HistoryEntry
                            mech={h.mech}
                            key={idx}
                            mapName={camelToTitle(h.battle?.game_map?.name || "Unknown")}
                            backgroundImage={h.battle?.game_map?.image_url}
                            mechSurvived={!!h.mech_survived}
                            status={!h.battle?.battle?.ended_at ? "pending" : h.faction_won ? "won" : "lost"}
                            kills={h.kills}
                            date={h.created_at}
                        />
                    )
                })}
            </Box>
        </Box>
    )
}
