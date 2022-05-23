import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommands } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { BattleMechHistory, BattleMechStats } from "../../../../types"
import { MechModal } from "../Common/MechModal"
import { PercentageDisplay, PercentageDisplaySkeleton } from "./PercentageDisplay"

export const HistoryModal = () => {
    const { historyMechDetails, setHistoryMechDetails } = useHangarWarMachine()
    const { send } = useGameServerCommands("/public/commander")
    // Mech stats
    const [stats, setStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [statsError, setStatsError] = useState<string>()
    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    const rarityDeets = useMemo(() => getRarityDeets(historyMechDetails?.tier || ""), [historyMechDetails?.tier])

    const onClose = useCallback(() => {
        setHistoryMechDetails(undefined)
    }, [setHistoryMechDetails])

    useEffect(() => {
        ;(async () => {
            if (!historyMechDetails?.id) return

            try {
                setStatsLoading(true)
                const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                    mech_id: historyMechDetails.id,
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

            try {
                setHistoryLoading(true)
                const resp = await send<{
                    total: number
                    battle_history: BattleMechHistory[]
                }>(GameServerKeys.BattleMechHistoryList, {
                    mech_id: historyMechDetails.id,
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
        })()
    }, [send, historyMechDetails?.id])

    const renderEmptyHistory = () => {
        if (historyLoading) {
            return <CircularProgress size="2rem" />
        }
        if (historyError) {
            return (
                <Typography color={colors.red} sx={{ textAlign: "center" }}>
                    {historyError}
                </Typography>
            )
        }
        return (
            <Typography variant="h6" sx={{ color: colors.grey }}>
                No recent match history...
            </Typography>
        )
    }

    if (!historyMechDetails) return null

    const { hash, name, label } = historyMechDetails

    return (
        <MechModal mechDetails={historyMechDetails} onClose={onClose}>
            <Stack spacing="1.5rem">
                <Stack direction="row" justifyContent="space-between" sx={{ px: "1rem" }}>
                    {statsLoading ? (
                        <>
                            <PercentageDisplaySkeleton circleSize={60} />
                            <PercentageDisplaySkeleton circleSize={60} />
                            <PercentageDisplaySkeleton circleSize={60} />
                            <PercentageDisplaySkeleton circleSize={60} />
                        </>
                    ) : stats ? (
                        <>
                            <PercentageDisplay
                                displayValue={`${(stats.extra_stats.win_rate * 100).toFixed(0)}%`}
                                percentage={stats.extra_stats.win_rate * 100}
                                size={86}
                                circleSize={60}
                                label="Win %"
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_kills}`}
                                percentage={100}
                                size={86}
                                circleSize={60}
                                label="Kills"
                                color={colors.gold}
                            />
                            <PercentageDisplay
                                displayValue={`${(stats.extra_stats.survival_rate * 100).toFixed(0)}%`}
                                percentage={stats.extra_stats.survival_rate * 100}
                                size={86}
                                circleSize={60}
                                label="Survival %"
                                color={colors.green}
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_deaths}`}
                                percentage={100}
                                size={86}
                                circleSize={60}
                                label="Deaths"
                                color={colors.red}
                            />
                        </>
                    ) : (
                        <>
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={60} label="Win %" />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={60} label="Kills" color={colors.gold} />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={60} label="Survival %" color={colors.green} />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={60} label="Deaths" color={colors.red} />
                        </>
                    )}
                </Stack>

                <Stack></Stack>
            </Stack>
        </MechModal>
    )
}
