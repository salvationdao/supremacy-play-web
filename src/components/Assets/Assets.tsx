import { Box, Button, Drawer, Fade, Grid, Skeleton, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AssetItem, DrawerButtons } from ".."
import { SvgRobot } from "../../assets"
import {
    DRAWER_TRANSITION_DURATION,
    GAME_BAR_HEIGHT,
    LIVE_CHAT_DRAWER_WIDTH,
    NullUUID,
    PASSPORT_WEB,
} from "../../constants"
import {
    useDrawer,
    useGame,
    useGameServerAuth,
    useGameServerWebsocket,
    usePassportServerAuth,
    usePassportServerWebsocket,
} from "../../containers"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset, AssetQueueStat } from "../../types/assets"

interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

const LoadingSkeleton = ({ num }: { num?: number }) => (
    <Box>
        <Grid container spacing={2} sx={{ p: "1rem" }}>
            {new Array(num || 6).fill(0).map((_, index) => (
                <Grid item xs={12} key={`loading-skeleton-${index}`}>
                    <Stack direction="row" spacing="1.3rem">
                        <Skeleton variant="rectangular" width="7.2rem" height="7.2rem" />
                        <Stack sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="95%" height="2rem" />
                            <Skeleton variant="text" width="60%" height="2rem" />
                            <Skeleton variant="rectangular" width="8rem" height="2.3rem" sx={{ mt: ".6rem" }} />
                        </Stack>
                    </Stack>
                </Grid>
            ))}
        </Grid>
    </Box>
)

const DrawerContent = () => {
    const { state, subscribe } = usePassportServerWebsocket()
    const { faction_id } = usePassportServerAuth()
    const { battleEndDetail } = useGame()
    const { user } = useGameServerAuth()
    const [queueLength, setQueueLength] = useState<number>(0)
    const [queueCost, setQueueCost] = useState<string>("")
    const [contractReward, setContractReward] = useState<string>("")

    const { state: gsState, subscribe: gsSubscribe, send: gsSend } = useGameServerWebsocket()

    const [assets, setAssets] = useState<Asset[]>()
    const [assetsNotInQueue, setAssetsNotInQueue] = useState<Map<string, Asset>>(new Map())
    const [assetsInQueue, setAssetsInQueue] = useState<
        Map<string, Asset & { queue_position: number; contract_reward?: string }>
    >(new Map())

    const [isLoading, setIsLoading] = useState(true)

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
                    const tempMap = new Map(
                        Array.from(prev.entries()).sort(([, a], [, b]) => a.queue_position - b.queue_position),
                    )

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

    // Subscribe to the list of mechs that the user owns
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe<Asset[]>(PassportServerKeys.SubAssetList, (payload) => {
            if (!payload) return
            payload = payload.filter((asset) => {
                return asset.on_chain_status !== "STAKABLE" && asset.unlocked_at <= new Date(Date.now())
            })
            setAssets(payload)
            if (isLoading) setIsLoading(false)
        })
    }, [state, subscribe, faction_id, isLoading])

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

    // Every time the battle queue has been updated (i.e. a mech leaves the queue), refetch all mech's queue positions once
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSubscribe || !gsSend || !assets || assets.length === 0) return

        return gsSubscribe(GameServerKeys.TriggerBattleQueueUpdated, async () => {
            console.info("Battle queue updated, refetching queue positions")
            assets.forEach(async (a) => {
                try {
                    const resp = await gsSend<AssetQueueStat>(GameServerKeys.AssetQueueStatus, {
                        asset_hash: a.hash,
                    })
                    if (!resp) return
                    updateAssetQueueStatus(a, resp)
                } catch (e) {
                    console.warn("Failed to refetch queue position: ", e)
                }
            })
        })
    }, [gsState, gsSubscribe, gsSend, assets])

    // Every time the game ends, refetch all mech's queue positions once
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSend || !assets || assets.length === 0) return

        console.info("Game end, refetching queue positions")
        assets.forEach(async (a) => {
            try {
                const resp = await gsSend<AssetQueueStat>(GameServerKeys.AssetQueueStatus, {
                    asset_hash: a.hash,
                })
                if (!resp) return
                updateAssetQueueStatus(a, resp)
            } catch (e) {
                console.warn("Failed to refetch queue position: ", e)
            }
        })
    }, [gsSend, gsSubscribe, assets, battleEndDetail?.battle_id])

    const content = useMemo(() => {
        if (isLoading) return <LoadingSkeleton />

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
                            key={`${hash}-${index}`}
                            asset={a}
                            queueLength={queueLength}
                            queueCost={queueCost}
                            contractReward={contractReward}
                        />
                    ))}
                </>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Typography
                    variant="body2"
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

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isAssetOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: `${LIVE_CHAT_DRAWER_WIDTH}rem`,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: `${LIVE_CHAT_DRAWER_WIDTH}rem`,
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
                {isAssetOpen && <DrawerContent />}
            </Stack>
        </Drawer>
    )
}
