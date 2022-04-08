import { Box, Button, CircularProgress, Drawer, IconButton, Link, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SvgBack, SvgDeath, SvgExternalLink, SvgGoldBars, SvgHistory, SvgRefresh } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, LIVE_CHAT_DRAWER_BUTTON_WIDTH, PASSPORT_WEB, RIGHT_DRAWER_WIDTH } from "../../constants"
import { SocketState, useGameServerWebsocket } from "../../containers"
import { camelToTitle, getRarityDeets, timeSince } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { BattleMechHistory, BattleMechStats } from "../../types"
import { Asset } from "../../types/assets"
import { UserData } from "../../types/passport"
import { PercentageDisplay, PercentageDisplaySkeleton } from "./PercentageDisplay"

export interface HistoryDrawerProps {
    user: UserData
    open: boolean
    onClose: () => void
    asset: Asset
}

export const HistoryDrawer = ({ user, open, onClose, asset }: HistoryDrawerProps) => {
    const { state, send } = useGameServerWebsocket()
    const [localOpen, toggleLocalOpen] = useToggle(open)
    // Mech stats
    const [stats, setStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [statsError, setStatsError] = useState<string>()
    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()

    const rarityDeets = useMemo(() => getRarityDeets(asset.tier), [asset])

    const fetchHistory = async () => {
        setHistoryLoading(true)
        try {
            const resp = await send<{
                total: number
                battle_history: BattleMechHistory[]
            }>(GameServerKeys.BattleMechHistoryList, {
                mech_id: asset.id,
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
    }

    useEffect(() => {
        if (state !== SocketState.OPEN || !send) return

        setStatsLoading(true)
        send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
            mech_id: asset.id,
        })
            .then((resp) => {
                setStats(resp)
            })
            .catch((e) => {
                if (typeof e === "string") {
                    setStatsError(e)
                } else if (e instanceof Error) {
                    setStatsError(e.message)
                }
            })
            .finally(() => {
                setStatsLoading(false)
            })

        fetchHistory()
    }, [state, send])

    // This allows the drawer transition to happen before we unmount it
    useEffect(() => {
        if (!localOpen) {
            setTimeout(() => {
                onClose()
            }, DRAWER_TRANSITION_DURATION + 50)
        }
    }, [localOpen])

    const renderEmptyHistory = () => {
        if (historyLoading) {
            return <CircularProgress size="4rem" />
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

    return (
        <Drawer
            open={localOpen}
            onClose={() => toggleLocalOpen(false)}
            anchor="right"
            transitionDuration={DRAWER_TRANSITION_DURATION}
            sx={{
                width: `${RIGHT_DRAWER_WIDTH - LIVE_CHAT_DRAWER_BUTTON_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
            }}
            PaperProps={{
                sx: {
                    width: `${RIGHT_DRAWER_WIDTH - LIVE_CHAT_DRAWER_BUTTON_WIDTH}rem`,
                    backgroundColor: colors.darkNavy,
                    backgroundImage: "none",
                },
            }}
        >
            <Stack sx={{ height: "100%" }}>
                <Stack
                    alignItems="flex-start"
                    justifyContent="center"
                    sx={{
                        flexShrink: 0,
                        pl: "2rem",
                        pr: "4.8rem",
                        height: `${GAME_BAR_HEIGHT}rem`,
                        background: `${colors.assetsBanner}65`,
                        boxShadow: 1.5,
                    }}
                >
                    <Button size="small" onClick={() => toggleLocalOpen(false)} sx={{ px: "1rem" }}>
                        <SvgBack size="1.3rem" sx={{ pb: ".1rem" }} />
                        <Typography sx={{ ml: ".5rem" }}>Go Back</Typography>
                    </Button>
                </Stack>

                <Stack sx={{ p: ".8rem", flex: 1, overflow: "hidden" }}>
                    <Stack spacing="1rem" sx={{ px: "1.2rem", py: "1rem" }}>
                        <Box>
                            <Typography sx={{ display: "inline", fontFamily: "Nostromo Regular Black" }}>
                                {asset.data.mech.name || asset.data.mech.label}
                            </Typography>
                            {user && (
                                <span>
                                    <Link
                                        href={`${PASSPORT_WEB}profile/${user.username}/asset/${asset.hash}`}
                                        target="_blank"
                                        sx={{ display: "inline", ml: ".7rem" }}
                                    >
                                        <SvgExternalLink size="1rem" sx={{ display: "inline", opacity: 0.2, ":hover": { opacity: 0.6 } }} />
                                    </Link>
                                </span>
                            )}
                        </Box>
                        {statsError && <Typography color={colors.red}>{statsError}</Typography>}

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box sx={{ width: "calc(100% - 6rem)" }}>
                                <Box
                                    component="img"
                                    src={asset.data.mech.image_url}
                                    alt={`Image for ${asset.data.mech.name} || ${asset.data.mech.label}`}
                                    sx={{
                                        width: "100%",
                                        height: "26rem",
                                        objectFit: "contain",
                                        objectPosition: "center",
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: rarityDeets.color,
                                        fontFamily: "Nostromo Regular Heavy",
                                        textAlign: "center",
                                    }}
                                >
                                    {rarityDeets.label}
                                </Typography>
                            </Box>
                            <Stack
                                spacing="1rem"
                                alignItems="center"
                                justifyContent="center"
                                sx={{
                                    flexShrink: 0,
                                    width: "6rem",
                                }}
                            >
                                {statsLoading ? (
                                    <>
                                        <PercentageDisplaySkeleton />
                                        <PercentageDisplaySkeleton />
                                        <PercentageDisplaySkeleton />
                                    </>
                                ) : stats ? (
                                    <>
                                        <PercentageDisplay
                                            displayValue={`${(stats.extra_stats.win_rate * 100).toFixed(0)}%`}
                                            percentage={stats.extra_stats.win_rate * 100}
                                            label="Win Rate"
                                        />
                                        <PercentageDisplay
                                            displayValue={`${(stats.extra_stats.survival_rate * 100).toFixed(0)}%`}
                                            percentage={stats.extra_stats.survival_rate * 100}
                                            label="Survival Rate"
                                            color={colors.green}
                                        />
                                        <PercentageDisplay displayValue={`${stats.total_kills}`} percentage={100} label="Total Kills" color={colors.gold} />
                                        <PercentageDisplay displayValue={`${stats.total_deaths}`} percentage={100} label="Total Deaths" color={colors.red} />
                                    </>
                                ) : (
                                    <>
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Win Rate" />
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Survival Rate" color={colors.green} />
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Total Kills" color={colors.gold} />
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Total Deaths" color={colors.red} />
                                    </>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                    <Stack
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            px: ".5rem",
                            py: ".9rem",
                            backgroundColor: `${colors.navy}80`,
                            borderRadius: 0.3,
                        }}
                    >
                        <Stack direction="row" alignItems="center" sx={{ pb: ".8rem", px: "1.2rem" }}>
                            <SvgHistory size="1.8rem" />
                            <Typography variant="h6" sx={{ ml: ".8rem", fontWeight: "fontWeightBold" }}>
                                RECENT MATCHES
                            </Typography>
                            <IconButton size="small" sx={{ ml: "auto" }} onClick={() => fetchHistory()}>
                                <SvgRefresh size="1.3rem" />
                            </IconButton>
                        </Stack>

                        {history.length > 0 ? (
                            <Stack
                                spacing=".5rem"
                                sx={{
                                    pl: ".4rem",
                                    pr: ".4rem",
                                    overflowY: "auto",
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
                                        background: "#FFFFFF80",
                                        borderRadius: 3,
                                    },
                                }}
                            >
                                {history.map((h, index) => (
                                    <HistoryEntry
                                        key={index}
                                        mapName={camelToTitle(h.battle?.game_map?.name || "Unknown")}
                                        backgroundImage={h.battle?.game_map?.image_url}
                                        isWin={!!h.faction_won}
                                        mechSurvived={!!h.mech_survived}
                                        kills={h.kills}
                                        date={h.created_at}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ flex: 1 }}>
                                {renderEmptyHistory()}
                            </Stack>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </Drawer>
    )
}

interface HistoryEntryProps {
    mapName: string
    isWin: boolean
    mechSurvived: boolean
    backgroundImage?: string
    kills: number
    date: Date
}

const HistoryEntry = ({ mapName, isWin, mechSurvived, backgroundImage, kills, date }: HistoryEntryProps) => {
    return (
        <Stack
            direction="row"
            sx={{
                flexShrink: 0,
                minHeight: "70px",
                p: "0.8rem 1.1rem",
                background: `center center`,
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, ${isWin ? colors.green : colors.red}80), url(${backgroundImage})`,
                backgroundSize: "cover",
            }}
        >
            <Box>
                <Typography variant="subtitle2" sx={{ textTransform: "uppercase" }}>
                    {mapName}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: "Nostromo Regular Bold",
                    }}
                >
                    {isWin ? "VICTORY" : "DEFEAT"}
                </Typography>
                <Stack direction="row" alignItems="center" spacing=".5rem">
                    <Typography
                        variant="subtitle2"
                        sx={{
                            textTransform: "uppercase",
                            color: mechSurvived ? colors.neonBlue : colors.grey,
                        }}
                    >
                        {mechSurvived ? "MECH SURVIVED" : "MECH DESTROYED"}
                    </Typography>
                    {mechSurvived && <SvgGoldBars size="1.5rem" />}
                </Stack>
            </Box>
            <Stack alignItems="flex-end" alignSelf="center" sx={{ ml: "auto" }}>
                <Stack direction="row" spacing=".5rem" alignItems="center">
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: "Nostromo Regular Bold",
                            color: kills > 0 ? colors.gold : colors.lightGrey,
                        }}
                    >
                        {kills > 0 ? `${kills} KILL${kills > 1 ? "S" : ""}` : "NO KILLS"}
                    </Typography>
                    <SvgDeath fill={kills > 0 ? colors.gold : colors.lightGrey} size="1.8rem" />
                </Stack>
                <Typography
                    sx={{
                        color: colors.offWhite,
                    }}
                >
                    {timeSince(date)} AGO
                </Typography>
            </Stack>
        </Stack>
    )
}
