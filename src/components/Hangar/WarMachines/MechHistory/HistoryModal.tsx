import { CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgRefresh } from "../../../../assets"
import { useHangarWarMachine } from "../../../../containers/hangar/hangarWarMachines"
import { camelToTitle } from "../../../../helpers"
import { useGameServerCommands } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { BattleMechHistory, BattleMechStats } from "../../../../types"
import { MechModal } from "../Common/MechModal"
import { HistoryEntry } from "./HistoryEntry"
import { PercentageDisplay, PercentageDisplaySkeleton } from "./PercentageDisplay"

export const HistoryModal = () => {
    const { historyMechDetails, setHistoryMechDetails } = useHangarWarMachine()
    const { send } = useGameServerCommands("/public/commander")
    // Mech stats
    const [stats, setStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [, setStatsError] = useState<string>()
    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    const onClose = useCallback(() => {
        setHistoryMechDetails(undefined)
    }, [setHistoryMechDetails])

    const fetchHistory = useCallback(async () => {
        if (!historyMechDetails?.id) return
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
    }, [historyMechDetails?.id, send])

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

            // fetchHistory()
        })()
    }, [send, historyMechDetails?.id, fetchHistory])

    const renderEmptyHistory = () => {
        if (historyLoading) {
            return <CircularProgress size="2rem" sx={{ mt: "2rem" }} />
        }
        if (historyError) {
            return <Typography sx={{ color: colors.red, textTransform: "uppercase" }}>{historyError}</Typography>
        }
        return (
            <Typography variant="body1" sx={{ color: colors.grey }}>
                NO RECENT BATTLE HISTORY...
            </Typography>
        )
    }

    if (!historyMechDetails) return null

    return (
        <MechModal mechDetails={historyMechDetails} onClose={onClose} width="50rem">
            <Stack spacing="1.6rem" sx={{ pt: ".4rem" }}>
                <Stack direction="row" justifyContent="space-between" sx={{ px: "1.3rem" }}>
                    {statsLoading ? (
                        <>
                            <PercentageDisplaySkeleton circleSize={55} />
                            <PercentageDisplaySkeleton circleSize={55} />
                            <PercentageDisplaySkeleton circleSize={55} />
                            <PercentageDisplaySkeleton circleSize={55} />
                        </>
                    ) : stats ? (
                        <>
                            <PercentageDisplay
                                displayValue={`${(stats.extra_stats.win_rate * 100).toFixed(0)}%`}
                                percentage={stats.extra_stats.win_rate * 100}
                                size={86}
                                circleSize={55}
                                label="Win %"
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_kills}`}
                                percentage={100}
                                size={86}
                                circleSize={55}
                                label="Kills"
                                color={colors.gold}
                            />
                            <PercentageDisplay
                                displayValue={`${(stats.extra_stats.survival_rate * 100).toFixed(0)}%`}
                                percentage={stats.extra_stats.survival_rate * 100}
                                size={86}
                                circleSize={55}
                                label="Survival %"
                                color={colors.green}
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_deaths}`}
                                percentage={100}
                                size={86}
                                circleSize={55}
                                label="Deaths"
                                color={colors.red}
                            />
                        </>
                    ) : (
                        <>
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Win %" />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Kills" color={colors.gold} />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Survival %" color={colors.green} />
                            <PercentageDisplay displayValue={`?`} percentage={0} size={86} circleSize={55} label="Deaths" color={colors.red} />
                        </>
                    )}
                </Stack>

                <Stack
                    sx={{
                        minHeight: 0,
                        maxHeight: "36rem",
                    }}
                >
                    <Stack direction="row" alignItems="center" sx={{ pb: ".4rem" }}>
                        <Typography variant="body1" sx={{ fontFamily: fonts.nostromoBlack }}>
                            RECENT 10 MATCHES
                        </Typography>
                        <IconButton size="small" sx={{ opacity: 0.4, "&:hover": { cursor: "pointer", opacity: 1 } }} onClick={() => fetchHistory()}>
                            <SvgRefresh size="1.3rem" />
                        </IconButton>
                    </Stack>

                    {history.length > 0 ? (
                        <Stack
                            spacing=".6rem"
                            sx={{
                                width: "calc(100% + 1rem)",
                                overflowY: "auto",
                                overflowX: "hidden",
                                pr: ".6rem",
                                py: ".16rem",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: (theme) => theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            {history.map((h, index) => (
                                <HistoryEntry
                                    key={index}
                                    mapName={camelToTitle(h.battle?.game_map?.name || "Unknown")}
                                    backgroundImage={h.battle?.game_map?.image_url}
                                    mechSurvived={!!h.mech_survived}
                                    status={!h.battle?.ended_at ? "pending" : h.faction_won ? "won" : "lost"}
                                    kills={h.kills}
                                    date={h.created_at}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Stack sx={{ flex: 1, px: "1rem" }}>{renderEmptyHistory()}</Stack>
                    )}
                </Stack>
            </Stack>
        </MechModal>
    )
}
