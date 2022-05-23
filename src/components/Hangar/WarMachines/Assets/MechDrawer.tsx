export interface MechDrawerProps {
    open: boolean
    onClose: () => void
    asset: Asset
    assetQueue: AssetQueue
    repairStatus?: RepairStatus
    isInQueue: boolean
    openDeployModal: () => void
    openLeaveModal: () => void
    togglePreventAssetsRefresh: (value?: boolean | undefined) => void
}

export const MechDrawer = ({
    open,
    onClose,
    asset,
    assetQueue,
    repairStatus,
    isInQueue,
    openDeployModal,
    openLeaveModal,
    togglePreventAssetsRefresh,
}: MechDrawerProps) => {
    const { name, label, hash, image_url, avatar_url } = asset.data.mech

    const { userID } = useAuth()
    const { send } = useGameServerCommands("/public/commander")
    const { send: psSend } = usePassportCommandsUser("xxxxxxxxx")
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

    const fetchHistory = useCallback(async () => {
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
    }, [asset.id, send])

    useEffect(() => {
        ;(async () => {
            try {
                setStatsLoading(true)
                const resp = await send<BattleMechStats | undefined>(GameServerKeys.BattleMechStats, {
                    mech_id: asset.id,
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
    }, [send, asset.id, fetchHistory])

    // This allows the drawer transition to happen before we unmount it
    useEffect(() => {
        if (!localOpen) {
            const timeout = setTimeout(() => {
                onClose()
            }, DRAWER_TRANSITION_DURATION + 50)

            return () => clearTimeout(timeout)
        }
    }, [localOpen, onClose])

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
            if (renamedValue === label || renamedValue === name) return
            await psSend<{ asset: string; user_id: string; name: string }>(PassportServerKeys.UpdateAssetName, {
                asset_hash: hash,
                user_id: userID,
                name: renamedValue,
            })

            newSnackbarMessage("Successfully renamed asset.", "success")
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to rename asset, try again or contact support.", "error")
            setRenamedValue(name || label)
        } finally {
            setRenameLoading(false)
        }
    }, [renamedValue, label, name, psSend, hash, userID, newSnackbarMessage])

    return (
        <Drawer
            open={localOpen}
            onClose={() => toggleLocalOpen(false)}
            anchor="right"
            transitionDuration={DRAWER_TRANSITION_DURATION}
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: siteZIndex.Drawer,
            }}
            PaperProps={{
                sx: {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
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
                                            fontFamily: fonts.nostromoBlack,
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
                            </Stack>
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: ".3rem",
                                    color: rarityDeets.color,
                                    fontFamily: fonts.nostromoHeavy,
                                }}
                            >
                                {rarityDeets.label}
                            </Typography>
                        </Box>

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box sx={{ position: "relative", width: "calc(100% - 6rem)" }}>
                                <Box
                                    component="img"
                                    src={image_url}
                                    alt={`Image for ${name} || ${label}`}
                                    sx={{
                                        width: "100%",
                                        height: "26rem",
                                        objectFit: "contain",
                                        objectPosition: "center",
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: ".4rem",
                                        bottom: "1rem",
                                        width: "4.5rem",
                                        height: "4.5rem",
                                        border: "#FFFFFF60 1px solid",
                                        backgroundImage: `url(${avatar_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "top center",
                                        backgroundSize: "contain",
                                    }}
                                />
                            </Box>
                            <Stack spacing="1rem" alignItems="center" justifyContent="center" sx={{ flexShrink: 0, width: "6rem" }}>
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
                                            size={38}
                                            label="Win Rate"
                                        />
                                        <PercentageDisplay displayValue={`${stats.total_kills}`} percentage={100} size={38} label="Kills" color={colors.gold} />
                                        <PercentageDisplay
                                            displayValue={`${(stats.extra_stats.survival_rate * 100).toFixed(0)}%`}
                                            percentage={stats.extra_stats.survival_rate * 100}
                                            size={38}
                                            label="Survival Rate"
                                            color={colors.green}
                                        />
                                        <PercentageDisplay
                                            displayValue={`${stats.total_deaths}`}
                                            percentage={100}
                                            size={38}
                                            label="Deaths"
                                            color={colors.red}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <PercentageDisplay displayValue={`?`} percentage={0} size={38} label="Win Rate" />
                                        <PercentageDisplay displayValue={`?`} percentage={0} size={38} label="Survival Rate" color={colors.green} />
                                        <PercentageDisplay displayValue={`?`} percentage={0} size={38} label="Kills" color={colors.gold} />
                                        <PercentageDisplay displayValue={`?`} percentage={0} size={38} label="Deaths" color={colors.red} />
                                    </>
                                )}
                            </Stack>
                        </Stack>

                        <Stack alignItems="center" direction="row" spacing=".96rem">
                            <StatusArea
                                isInQueue={isInQueue}
                                assetQueue={assetQueue}
                                repairStatus={repairStatus}
                                openLeaveModal={openLeaveModal}
                                openDeployModal={openDeployModal}
                                togglePreventAssetsRefresh={togglePreventAssetsRefresh}
                            />
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
                        <Stack direction="row" alignItems="center" sx={{ pb: ".8rem", pl: "1.2rem", pr: ".3rem" }}>
                            <SvgHistory size="1.8rem" />
                            <Typography variant="h6" sx={{ ml: ".8rem", fontWeight: "fontWeightBold" }}>
                                RECENT 10 MATCHES
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
                                        mechSurvived={!!h.mech_survived}
                                        status={!h.battle?.ended_at ? "pending" : h.faction_won ? "won" : "lost"}
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
