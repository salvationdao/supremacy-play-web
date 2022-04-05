import RefreshIcon from "@mui/icons-material/Refresh"
import { Box, CircularProgress, Drawer, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgDeath, SvgGoldBars, SvgHistory } from "../../assets"
import { RIGHT_DRAWER_WIDTH } from "../../constants"
import { SocketState, useGameServerWebsocket } from "../../containers"
import { camelToTitle, timeSince } from "../../helpers"
import { GameServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { BattleMechHistory, BattleMechStats } from "../../types"
import { Asset } from "../../types/assets"
import { PercentageDisplay, PercentageDisplaySkeleton } from "./PercentageDisplay"

export interface HistoryDrawerProps {
    open: boolean
    onClose: () => void
    asset: Asset
}

export const HistoryDrawer = ({ open, onClose, asset }: HistoryDrawerProps) => {
    const { state, send } = useGameServerWebsocket()
    const [shouldRender, setShouldRender] = useState(false)

    // Mech stats
    const [statsLoading, setStatsLoading] = useState(false)
    const [stats, setStats] = useState<BattleMechStats>()
    // Battle history
    const [historyLoading, setHistoryLoading] = useState(false)
    const [history, setHistory] = useState<BattleMechHistory[]>([])

    const fetchHistory = async () => {
        const resp = await send<{
            total: number
            battle_history: BattleMechHistory[]
        }>(GameServerKeys.BattleMechHistoryList, {
            mech_id: asset.id,
        })
        setHistory(resp.battle_history)
        setHistoryLoading(false)
    }

    useEffect(() => {
        if (state !== SocketState.OPEN || !send) return
        ;(async () => {
            setStatsLoading(true)
            const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                mech_id: asset.id,
            })
            setStats(resp)
            setStatsLoading(false)
        })()
        fetchHistory()
    }, [])

    useEffect(() => {
        const t = setTimeout(() => {
            setShouldRender(open)
        }, 50)

        return () => clearTimeout(t)
    }, [open])

    return (
        <Drawer
            open={shouldRender}
            onClose={onClose}
            anchor="right"
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
            }}
            PaperProps={{
                sx: {
                    overflow: "hidden",
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    maxHeight: "100vh",
                    backgroundColor: colors.darkNavy,
                    backgroundImage: "none",
                    padding: "1rem",
                },
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontFamily: ["Nostromo Regular Black", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
                }}
            >
                {asset.data.mech.name || asset.data.mech.label}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    margin: "1rem 0",
                }}
            >
                <Box
                    component="img"
                    src={asset.data.mech.image_url}
                    alt={`Image for ${asset.data.mech.name} || ${asset.data.mech.label}`}
                    sx={{
                        width: "100%",
                    }}
                />
                <Stack
                    spacing="1rem"
                    justifyContent="center"
                    sx={{
                        marginBottom: "1rem",
                    }}
                >
                    {stats && !statsLoading ? (
                        <>
                            <PercentageDisplay
                                displayValue={`${stats.extra_stats.win_rate * 100}%`}
                                percentage={stats.extra_stats.win_rate * 100}
                                label="Win Rate"
                            />

                            <PercentageDisplay
                                displayValue={`${stats.total_kills}`}
                                percentage={100}
                                label="Total Kills"
                                color={colors.gold}
                            />
                            <PercentageDisplay
                                displayValue={`${stats.total_deaths}`}
                                percentage={100}
                                label="Total Deaths"
                                color={colors.red}
                            />
                        </>
                    ) : (
                        <>
                            <PercentageDisplaySkeleton />
                            <PercentageDisplaySkeleton />
                            <PercentageDisplaySkeleton />
                        </>
                    )}
                </Stack>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: 0,
                    padding: ".5rem",
                    backgroundColor: `${colors.navy}80`,
                }}
            >
                <Stack
                    direction="row"
                    spacing=".5rem"
                    alignItems="end"
                    sx={{
                        padding: "0.8rem 1.04rem",
                    }}
                >
                    <SvgHistory />
                    <Typography
                        variant="h5"
                        sx={{
                            textTransform: "uppercase",
                        }}
                    >
                        Recent Matches
                    </Typography>
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "end",
                        }}
                    >
                        <IconButton
                            sx={{
                                marginLeft: "auto",
                            }}
                            onClick={() => fetchHistory()}
                            size="small"
                        >
                            <RefreshIcon fontSize="large" />
                        </IconButton>
                    </Box>
                </Stack>
                {history.length > 0 ? (
                    <Stack
                        spacing=".6rem"
                        sx={{
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
                                background: colors.assetsBanner,
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
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {historyLoading ? (
                            <CircularProgress />
                        ) : (
                            <Box>
                                <SvgHistory size="8rem" fill={colors.grey} />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: colors.grey,
                                    }}
                                >
                                    No Recent Match History
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
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
        <Box
            sx={{
                display: "flex",
                minHeight: "70px",
                padding: "0.8rem 1.04rem",
                background: `center center`,
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, ${
                    isWin ? colors.green : colors.red
                }80), url(${backgroundImage})`,
                backgroundSize: "cover",
                // filter: "grayscale(1)",
            }}
        >
            <Box>
                <Typography>{mapName}</Typography>
                <Typography
                    variant="h5"
                    sx={{
                        fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
                    }}
                >
                    {isWin ? "Victory" : "Defeat"}
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        sx={{
                            marginRight: ".5rem",
                            textTransform: "uppercase",
                            color: mechSurvived ? colors.neonBlue : colors.grey,
                        }}
                    >
                        {mechSurvived ? "Mech Survived" : "Mech Destroyed"}
                    </Typography>
                    {mechSurvived && <SvgGoldBars size="1.5rem" />}
                </Box>
            </Box>
            <Box
                sx={{
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginLeft: "auto",
                }}
            >
                <Stack direction="row" spacing=".5rem">
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: ["Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
                                ",",
                            ),
                            color: kills > 0 ? colors.gold : colors.lightGrey,
                        }}
                    >
                        {kills > 0 ? `${kills} kill${kills > 1 ? "s" : ""}` : "No Kills"}
                    </Typography>
                    <SvgDeath fill={kills > 0 ? colors.gold : colors.lightGrey} />
                </Stack>
                <Typography
                    variant="subtitle1"
                    sx={{
                        textTransform: "uppercase",
                        color: colors.offWhite,
                    }}
                >
                    {timeSince(date)} ago
                </Typography>
            </Box>
        </Box>
    )
}
