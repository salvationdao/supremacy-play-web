import { Stack, CircularProgress, Box, Typography } from "@mui/material"
import { useState, useCallback, useEffect, useMemo } from "react"
import { EmptyWarMachinesPNG } from "../../assets"
import { camelToTitle } from "../../helpers"
import { useGameServerCommands } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, theme } from "../../theme/theme"
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

    const content = useMemo(() => {
        if (historyError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {historyError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!history || historyLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (history && history.length > 0) {
            return (
                <>
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
                </>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem", mb: "2rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"no battle history found."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [historyError, history, historyLoading])

    return <>{content}</>
}
