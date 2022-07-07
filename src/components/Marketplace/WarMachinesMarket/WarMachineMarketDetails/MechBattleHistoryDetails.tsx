import { CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgHistory, SvgRefresh } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { camelToTitle } from "../../../../helpers"
import { useGameServerCommands } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { BattleMechHistory, BattleMechStats, MechDetails } from "../../../../types"
import { HistoryEntry } from "../../../Hangar/WarMachinesHangar/Common/MechHistory/HistoryEntry"
import { PercentageDisplay, PercentageDisplaySkeleton } from "../../../Hangar/WarMachinesHangar/Common/MechHistory/PercentageDisplay"

export const MechBattleHistoryDetails = ({ mechDetails, smallSize }: { mechDetails?: MechDetails; smallSize?: boolean }) => {
    const theme = useTheme()
    const { send } = useGameServerCommands("/public/commander")
    // Mech stats
    const [stats, setStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [, setStatsError] = useState<string>()
    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    const fetchHistory = useCallback(async () => {
        if (!mechDetails?.id) return
        try {
            setHistoryLoading(true)
            const resp = await send<{
                total: number
                battle_history: BattleMechHistory[]
            }>(GameServerKeys.BattleMechHistoryList, {
                mech_id: mechDetails.id,
            })
            setHistory(resp.battle_history)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to load mech battle history."
            setHistoryError(message)
            console.error(err)
        } finally {
            setHistoryLoading(false)
        }
    }, [mechDetails?.id, send])

    useEffect(() => {
        ;(async () => {
            if (!mechDetails?.id) return

            try {
                setStatsLoading(true)
                const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                    mech_id: mechDetails.id,
                })

                if (resp) setStats(resp)
            } catch (e) {
                console.error(e)
                if (typeof e === "string") {
                    setStatsError(e)
                } else if (e instanceof Error) {
                    setStatsError(e.message)
                }
            } finally {
                setStatsLoading(false)
            }

            fetchHistory()
        })()
    }, [send, mechDetails?.id, fetchHistory])

    if (!mechDetails) return null

    const size = smallSize ? 70 : 86
    const circleSize = smallSize ? 50 : 70
    const unknownCircleSize = smallSize ? 40 : 55

    return (
        <Stack spacing={smallSize ? "1.9rem" : "3.8rem"}>
            <Stack direction="row" justifyContent="space-between" sx={{ px: smallSize ? ".5rem" : "2rem" }}>
                {statsLoading ? (
                    <>
                        <PercentageDisplaySkeleton circleSize={circleSize} />
                        <PercentageDisplaySkeleton circleSize={circleSize} />
                        <PercentageDisplaySkeleton circleSize={circleSize} />
                        <PercentageDisplaySkeleton circleSize={circleSize} />
                    </>
                ) : stats ? (
                    <>
                        <PercentageDisplay
                            displayValue={`${(stats.extra_stats.win_rate * 100).toFixed(0)}%`}
                            percentage={stats.extra_stats.win_rate * 100}
                            size={size}
                            circleSize={circleSize}
                            label="Win %"
                        />
                        <PercentageDisplay
                            displayValue={`${stats.total_kills}`}
                            percentage={100}
                            size={size}
                            circleSize={circleSize}
                            label="Kills"
                            color={colors.gold}
                        />
                        <PercentageDisplay
                            displayValue={`${(stats.extra_stats.survival_rate * 100).toFixed(0)}%`}
                            percentage={stats.extra_stats.survival_rate * 100}
                            size={size}
                            circleSize={circleSize}
                            label="Survival %"
                            color={colors.green}
                        />
                        <PercentageDisplay
                            displayValue={`${stats.total_deaths}`}
                            percentage={100}
                            size={size}
                            circleSize={circleSize}
                            label="Deaths"
                            color={colors.red}
                        />
                    </>
                ) : (
                    <>
                        <PercentageDisplay displayValue={`?`} percentage={0} size={size} circleSize={unknownCircleSize} label="Win %" />
                        <PercentageDisplay displayValue={`?`} percentage={0} size={size} circleSize={unknownCircleSize} label="Kills" color={colors.gold} />
                        <PercentageDisplay
                            displayValue={`?`}
                            percentage={0}
                            size={size}
                            circleSize={unknownCircleSize}
                            label="Survival %"
                            color={colors.green}
                        />
                        <PercentageDisplay displayValue={`?`} percentage={0} size={size} circleSize={unknownCircleSize} label="Deaths" color={colors.red} />
                    </>
                )}
            </Stack>

            <Stack spacing="1.8rem">
                <Stack direction="row" alignItems="center" spacing=".5rem">
                    <Stack direction="row" spacing=".8rem" alignItems="center">
                        <SvgHistory fill={theme.factionTheme.primary} size={smallSize ? "1.8rem" : "2.5rem"} />
                        <Typography variant={smallSize ? "body1" : "h5"} sx={{ color: theme.factionTheme.primary, fontFamily: fonts.nostromoBlack }}>
                            RECENT 10 BATTLES
                        </Typography>
                    </Stack>

                    <IconButton size="small" sx={{ opacity: 0.4, "&:hover": { cursor: "pointer", opacity: 1 } }} onClick={() => fetchHistory()}>
                        <SvgRefresh size={smallSize ? "1.2rem" : "1.5rem"} />
                    </IconButton>
                </Stack>

                {historyLoading && (
                    <Stack alignItems="center" sx={{ height: "10rem" }}>
                        <CircularProgress size="2.8rem" sx={{ mt: "2rem", color: theme.factionTheme.primary }} />
                    </Stack>
                )}

                {!historyLoading && historyError && (
                    <Stack sx={{ flex: 1, px: "1rem" }}>
                        <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{historyError}</Typography>
                    </Stack>
                )}

                {!historyLoading && !historyError && history.length > 0 && (
                    <Stack spacing="1rem">
                        {history.map((h, index) => (
                            <HistoryEntry
                                key={index}
                                mapName={camelToTitle(h.battle?.game_map?.name || "Unknown")}
                                backgroundImage={h.battle?.game_map?.image_url}
                                mechSurvived={!!h.mech_survived}
                                status={!h.battle?.battle?.ended_at ? "pending" : h.faction_won ? "won" : "lost"}
                                kills={h.kills}
                                date={h.created_at}
                            />
                        ))}
                    </Stack>
                )}

                {!historyLoading && !historyError && history.length <= 0 && (
                    <Typography variant={smallSize ? "caption" : "body2"} sx={{ color: colors.grey, fontFamily: fonts.nostromoBold }}>
                        NO RECENT BATTLE HISTORY...
                    </Typography>
                )}
            </Stack>
        </Stack>
    )
}
