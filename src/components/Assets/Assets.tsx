import { Box, Button, Drawer, Fade, Skeleton, Stack, Typography, CircularProgress } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AssetItem, DrawerButtons } from ".."
import { SvgRobot } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, RIGHT_DRAWER_WIDTH, NullUUID, PASSPORT_WEB } from "../../constants"
import { useDrawer, useGame, useGameServerAuth, useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useSnackbar } from "../../containers"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset, AssetOnChainStatus, AssetQueueStat, AssetQueueStatusItem } from "../../types/assets"
import { TelegramShortcodeModal } from "./DeployConfirmation"

interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

const LoadingSkeleton = ({ num }: { num?: number }) => (
    <Stack spacing={2} sx={{ p: "1rem" }}>
        {new Array(num || 6).fill(0).map((_, index) => (
            <Stack key={`loading-skeleton-${index}`} direction="row" spacing="1.3rem">
                <Skeleton variant="rectangular" width="7.2rem" height="7.2rem" />
                <Stack sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="95%" height="2rem" />
                    <Skeleton variant="text" width="60%" height="2rem" />
                    <Skeleton variant="rectangular" width="8rem" height="2.3rem" sx={{ mt: ".6rem" }} />
                </Stack>
            </Stack>
        ))}
    </Stack>
)

const DrawerContent = ({ telegramShortcode, setTelegramShortcode }: { telegramShortcode?: string; setTelegramShortcode?: (s: string) => void }) => {
    const { newSnackbarMessage } = useSnackbar()
    const { state, send } = usePassportServerWebsocket()
    const { faction_id } = usePassportServerAuth()
    const { battleEndDetail } = useGame()
    const { user } = useGameServerAuth()
    const [queueLength, setQueueLength] = useState<number>(0)
    const [queueCost, setQueueCost] = useState<string>("")
    const [contractReward, setContractReward] = useState<string>("")

    const { state: gsState, subscribe: gsSubscribe, send: gsSend } = useGameServerWebsocket()

    const [queuedAssets, setQueuedAssets] = useState<AssetQueueStatusItem[] | null>(null)

    const [assets, setAssets] = useState<Asset[]>()
    const [assetsNotInQueue, setAssetsNotInQueue] = useState<Map<string, Asset>>(new Map())
    const [assetsInQueue, setAssetsInQueue] = useState<Map<string, Asset & { queue_position: number; contract_reward?: string }>>(new Map())

    const [isLoading, setIsLoading] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)

    const loadMoreAssets = useCallback(async () => {
        if (state !== WebSocket.OPEN || !send || !queuedAssets || isLoaded || (isLoading && assets) || !faction_id || faction_id === NullUUID) return
        try {
            setIsLoading(true)
            const includeAssetIDs = queuedAssets.filter((q) => !assets || !assets.some((a) => a.id === q.mech_id)).map((q) => q.mech_id)
            const excludeAssetIDs = queuedAssets.filter((q) => assets && assets.some((a) => a.id === q.mech_id)).map((q) => q.mech_id)

            let resp = await send<Asset[]>(PassportServerKeys.SubAssetList, {
                limit: 20,
                include_asset_ids: includeAssetIDs,
                exclude_asset_ids: excludeAssetIDs,
                after_external_token_id: assets && assets.length > 0 ? assets[assets.length - 1].data.mech.external_token_id : undefined,
            })
            resp = resp.filter((asset) => {
                return asset.on_chain_status !== AssetOnChainStatus.STAKABLE && asset.unlocked_at <= new Date(Date.now())
            })
            setAssets((prev) => (prev ? prev.concat(resp) : resp))
            setIsLoading(false)
            if (resp.length < 20) {
                setIsLoaded(true)
            }
        } catch (err) {
            console.error(err)
        }
    }, [send, state, isLoaded, isLoading, queuedAssets, assets, faction_id, assets])

    // Load initial assets
    useEffect(() => {
        if (!gsSend || queuedAssets !== null) return
        ;(async () => {
            try {
                const resp = await gsSend<AssetQueueStatusItem[]>(GameServerKeys.AssetQueueStatusList)
                setQueuedAssets(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [gsSend, queuedAssets])

    useEffect(() => {
        if (!queuedAssets || (assets && assets.length > 0)) return
        loadMoreAssets()
    }, [loadMoreAssets, queuedAssets, assets])

    const updateAssetQueueStatus = useCallback(
        (a: Asset, status: AssetQueueStat) => {
            if (status.queue_position) {
                // If asset is in queue/battle
                setAssetsInQueue((prev) => {
                    const tempAss = {
                        ...a,
                        queue_position: status.queue_position || -1,
                        contract_reward: status.contract_reward,
                    }
                    prev.set(a.hash, tempAss)
                    const tempMap = new Map(Array.from(prev.entries()).sort(([, a], [, b]) => a.queue_position - b.queue_position))

                    return tempMap
                })
                setAssetsNotInQueue((prev) => {
                    prev.delete(a.hash)
                    const tempMap = new Map(prev)

                    return tempMap
                })
            } else {
                // If asset is not in queue/battle
                setAssetsInQueue((prev) => {
                    prev.delete(a.hash)
                    const tempMap = new Map(prev)

                    return tempMap
                })
                setAssetsNotInQueue((prev) => {
                    const tempAss = {
                        ...a,
                    }
                    prev.set(a.hash, tempAss)
                    const tempMap = new Map(prev)

                    return tempMap
                })
            }
        },
        [setAssetsInQueue, setAssetsNotInQueue],
    )

    // Subscribe to queue status
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSubscribe || !user) return
        return gsSubscribe<QueueFeed>(GameServerKeys.SubQueueStatus, (payload) => {
            if (!payload) return
            setQueueLength(payload.queue_length)
            setQueueCost(payload.queue_cost)
            setContractReward(payload.contract_reward)
        })
    }, [gsState, gsSubscribe, user])

    // For each mech, subscribe to its queue position
    // Mechs that are in queue and out of the queue are separated into two javascript maps
    // The map that stores queued mechs is sorted by queue position
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSubscribe || !assets || assets.length === 0) return

        const callbacks = assets.map((a) =>
            gsSubscribe<AssetQueueStat>(
                GameServerKeys.SubAssetQueueStatus,
                (payload) => {
                    if (!payload) return
                    updateAssetQueueStatus(a, payload)
                },
                { asset_hash: a.hash },
            ),
        )
        return () => callbacks.forEach((c) => c())
    }, [gsState, gsSubscribe, assets])

    // DO NOT REMOVE THIS! Every time the battle queue has been updated (i.e. a mech leaves the queue), refetch all mech's queue positions once
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSubscribe || !gsSend || !assets || assets.length === 0) return

        return gsSubscribe(GameServerKeys.TriggerBattleQueueUpdated, async () => {
            assets.forEach(async (a) => {
                try {
                    const resp = await gsSend<AssetQueueStat>(GameServerKeys.AssetQueueStatus, {
                        asset_hash: a.hash,
                    })
                    if (!resp) return
                    updateAssetQueueStatus(a, resp)
                } catch (e) {
                    newSnackbarMessage(typeof e === "string" ? e : "Failed to get syndicate queue details.", "error")
                    console.debug(e)
                }
            })
        })
    }, [gsState, gsSubscribe, gsSend, assets])

    // Every time the game ends, refetch all mech's queue positions once
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSend || !assets || assets.length === 0) return

        assets.forEach(async (a) => {
            try {
                const resp = await gsSend<AssetQueueStat>(GameServerKeys.AssetQueueStatus, {
                    asset_hash: a.hash,
                })
                if (!resp) return
                updateAssetQueueStatus(a, resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get syndicate queue details.", "error")
                console.debug(e)
            }
        })
    }, [gsSend, gsSubscribe, assets, battleEndDetail?.battle_id])

    const content = useMemo(() => {
        if (isLoading && !assets) return <LoadingSkeleton />

        if (assets && assets.length > 0 && (assetsNotInQueue.size > 0 || assetsInQueue.size > 0)) {
            return (
                <>
                    {/* Assets in the queue/battle */}
                    {Array.from(assetsInQueue).map(([hash, a], index) => (
                        <AssetItem
                            key={`${hash}-${index}`}
                            asset={a}
                            assetQueueStatus={{
                                queue_position: a.queue_position,
                                contract_reward: a.contract_reward,
                            }}
                            queueLength={queueLength}
                            queueCost={queueCost}
                            contractReward={contractReward}
                        />
                    ))}

                    {/* Assets outside of the queue and not battling */}
                    {Array.from(assetsNotInQueue).map(([hash, a], index) => (
                        <AssetItem
                            telegramShortcode={telegramShortcode}
                            setTelegramShortcode={setTelegramShortcode}
                            key={`${hash}-${index}`}
                            asset={a}
                            queueLength={queueLength}
                            queueCost={queueCost}
                            contractReward={contractReward}
                        />
                    ))}

                    {/* Add Scroll Pagination */}
                    {isLoading && assets && assets.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <CircularProgress
                                sx={{
                                    px: ".8rem",
                                    pt: ".48rem",
                                    pb: ".24rem",
                                }}
                            />
                        </Box>
                    )}
                </>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: ".56rem",
                        color: colors.grey,
                        userSelect: "text !important",
                        opacity: !assets ? 0.6 : 1,
                    }}
                >
                    {"You don't own any assets yet."}
                </Typography>
                <Button href={`${PASSPORT_WEB}stores`} target="_blank" size="small" variant="outlined">
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.neonBlue,
                            userSelect: "text !important",
                        }}
                    >
                        GO TO ASSET STORE
                    </Typography>
                </Button>
            </Stack>
        )
    }, [isLoading, assets, assetsNotInQueue, assetsInQueue, queueLength, queueCost, contractReward])

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack
                direction="row"
                spacing=".96rem"
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: "2rem",
                    pr: "4.8rem",
                    height: `${GAME_BAR_HEIGHT}rem`,
                    background: `${colors.assetsBanner}65`,
                    boxShadow: 1.5,
                }}
            >
                <SvgRobot size="2.3rem" fill={colors.text} sx={{ pb: ".56rem" }} />
                <Typography variant="caption" sx={{ fontFamily: "Nostromo Regular Black" }}>
                    WAR MACHINES
                </Typography>
            </Stack>

            <Fade in={true}>
                <Box
                    onScroll={(e) => {
                        const target = e.currentTarget
                        if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
                            loadMoreAssets()
                        }
                    }}
                    sx={{
                        m: ".4rem",
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
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
                    <Stack spacing={0.6}>{content}</Stack>
                </Box>
            </Fade>
        </Stack>
    )
}

export const Assets = () => {
    const { isAssetOpen } = useDrawer()
    const [telegramShortcode, setTelegramShortcode] = useState("")

    if (!isAssetOpen) return null

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isAssetOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: `${RIGHT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: `${RIGHT_DRAWER_WIDTH}rem`,
                    backgroundColor: colors.darkNavy,
                },
            }}
        >
            <Stack
                direction="row"
                sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: colors.darkNavy,
                }}
            >
                <DrawerButtons isFixed={false} />
                <DrawerContent telegramShortcode={telegramShortcode} setTelegramShortcode={setTelegramShortcode} />
            </Stack>

            <TelegramShortcodeModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} open={!!telegramShortcode} />
        </Drawer>
    )
}
