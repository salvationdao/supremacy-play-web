import { Box, Button, CircularProgress, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgBack, SvgDeath, SvgEdit, SvgGoldBars, SvgHistory, SvgRefresh, SvgSave } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, LIVE_CHAT_DRAWER_BUTTON_WIDTH, RIGHT_DRAWER_WIDTH } from "../../constants"
import { SocketState, useGameServerWebsocket, usePassportServerWebsocket, useSnackbar } from "../../containers"
import { camelToTitle, getRarityDeets, timeSince } from "../../helpers"
import { useToggle } from "../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../keys"
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
    const { name, label, hash } = asset.data.mech

    const { state, send } = useGameServerWebsocket()
    const { state: psState, send: psSend } = usePassportServerWebsocket()
    const [localOpen, toggleLocalOpen] = useToggle(open)
    // Mech stats
    const [stats, setStats] = useState<BattleMechStats>()
    const [statsLoading, setStatsLoading] = useState(false)
    const [statsError, setStatsError] = useState<string>()
    // Battle history
    const [history, setHistory] = useState<BattleMechHistory[]>([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [historyError, setHistoryError] = useState<string>()
    // Rename
    const renamingRef = useRef<HTMLInputElement>()
    const [renamedValue, setRenamedValue] = useState(name || label)
    const [renameLoading, setRenameLoading] = useState<boolean>(false)

    const { newSnackbarMessage } = useSnackbar()

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

    useEffect(() => {
        if (name) {
            setRenamedValue(name)
            return
        }
        setRenamedValue(label)
    }, [name, label, asset])

    const handleRename = useCallback(async () => {
        try {
            setRenameLoading(true)
            if (psState !== WebSocket.OPEN || !psSend) return
            if (renamedValue === label || renamedValue === name) return
            await psSend<{ asset: string; user_id: string; name: string }>(PassportServerKeys.UpdateAssetName, {
                asset_hash: hash,
                user_id: user.id,
                name: renamedValue,
            })

            newSnackbarMessage("Successfully renamed asset.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to rename asset, try again or contact support.", "error")
            setRenamedValue(name || label)
        } finally {
            setRenameLoading(false)
        }
    }, [psState, psSend, renamedValue, name, label, hash, user.id, newSnackbarMessage])

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
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        flexShrink: 0,
                        pl: "2rem",
                        pr: "2.5rem",
                        height: `${GAME_BAR_HEIGHT}rem`,
                        background: `${colors.assetsBanner}65`,
                        boxShadow: 1.5,
                    }}
                >
                    <Button size="small" onClick={() => toggleLocalOpen(false)} sx={{ px: "1rem" }}>
                        <SvgBack size="1.3rem" sx={{ pb: ".1rem" }} />
                        <Typography sx={{ ml: ".5rem" }}>GO BACK</Typography>
                    </Button>
                </Stack>

                <Stack sx={{ p: ".8rem", flex: 1, overflow: "hidden" }}>
                    <Stack spacing="1.3rem" sx={{ px: "1.2rem", pt: "1rem", pb: "1.5rem" }}>
                        <Box>
                            <Stack direction="row" spacing="1rem" alignItems="flex-start">
                                <TextField
                                    inputRef={renamingRef}
                                    variant={"standard"}
                                    multiline
                                    sx={{
                                        position: "relative",
                                        flex: 1,
                                        m: 0,
                                        "& .MuiInput-root": {
                                            p: 0,
                                        },
                                        "& .MuiInputBase-input": {
                                            p: 0,
                                            display: "inline",
                                            fontFamily: "Nostromo Regular Black",
                                            wordBreak: "break-word",
                                        },
                                        ".MuiInputBase-input:focus": {
                                            px: ".7rem",
                                            py: ".2rem",
                                            borderRadius: 0.5,
                                            cursor: "auto !important",
                                            color: colors.offWhite,
                                            border: `1.5px dashed ${colors.lightGrey}`,
                                            backgroundColor: "#FFFFFF09",
                                        },
                                    }}
                                    spellCheck={false}
                                    InputProps={{
                                        disableUnderline: true,
                                    }}
                                    value={renamedValue}
                                    onChange={(e) => setRenamedValue(e.target.value)}
                                    onFocus={() => {
                                        renamingRef.current?.setSelectionRange(renamedValue.length, renamedValue.length)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleRename()
                                            renamingRef.current?.blur()
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                {renameLoading ? (
                                    <Box sx={{ mr: "1rem", pt: ".3rem" }}>
                                        <CircularProgress size="1.3rem" sx={{ color: colors.neonBlue }} />
                                    </Box>
                                ) : renamedValue !== name && renamedValue !== label ? (
                                    <IconButton size="small" onClick={() => handleRename()} sx={{ mr: "1rem", pt: ".2rem", cursor: "pointer" }}>
                                        <SvgSave size="1.5rem" fill="#FFFFFF" />
                                    </IconButton>
                                ) : (
                                    <IconButton
                                        size="small"
                                        onClick={() => renamingRef.current?.focus()}
                                        sx={{ mr: "1rem", opacity: 0.4, pt: ".3rem", "&:hover": { cursor: "pointer", opacity: 0.8 } }}
                                    >
                                        <SvgEdit size="1.3rem" fill="#FFFFFF" />
                                    </IconButton>
                                )}

                                {/* {user && (
                                <span>
                                    <Link
                                        href={`${PASSPORT_WEB}profile/${user.username}/asset/${asset.hash}`}
                                        target="_blank"
                                        sx={{ display: "inline", ml: ".7rem" }}
                                    >
                                        <SvgExternalLink size="1rem" sx={{ display: "inline", opacity: 0.2, ":hover": { opacity: 0.6 } }} />
                                    </Link>
                                </span>
                            )} */}
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: ".3rem",
                                    color: rarityDeets.color,
                                    fontFamily: "Nostromo Regular Heavy",
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>
                        </Box>

                        <Stack alignItems="center" spacing="1rem">
                            <Box sx={{ width: "100%" }}>
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
                            </Box>
                            <Stack spacing="1rem" direction="row" justifyContent="center" sx={{ width: "100%", px: "3rem" }}>
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
                                        <PercentageDisplay displayValue={`${stats.total_kills}`} percentage={100} label="Kills" color={colors.gold} />
                                        <PercentageDisplay displayValue={`${stats.total_deaths}`} percentage={100} label="Deaths" color={colors.red} />
                                    </>
                                ) : (
                                    <>
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Win Rate" />
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Kills" color={colors.gold} />
                                        <PercentageDisplay displayValue={`?`} percentage={0} label="Deaths" color={colors.red} />
                                    </>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>

                    {statsError && (
                        <Typography color={colors.red} sx={{ fontWeight: "fontWeightBold" }}>
                            {statsError}
                        </Typography>
                    )}

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
                            <IconButton
                                size="small"
                                sx={{ ml: "auto", opacity: 0.4, "&:hover": { cursor: "pointer", opacity: 1 } }}
                                onClick={() => fetchHistory()}
                            >
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
