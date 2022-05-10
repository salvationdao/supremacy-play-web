import { Box, useTheme, Theme, Stack, Typography, IconButton, Pagination, Button, CircularProgress } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { PASSPORT_WEB } from "../../../constants"
import { useGameServerAuth, useGameServerWebsocket, useSnackbar, useSupremacy } from "../../../containers"
import { useDebounce, usePagination, useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { TelegramShortcodeModal } from "./TelegramShortcodeModal"

export interface QueueFeedResponse {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

export interface AssetQueue {
    mech_id: string
    hash: string
    position?: number
    in_battle: boolean
    contract_reward?: ""
}

interface GetAssetsResponse {
    asset_queue_list: AssetQueue[]
    total: number
}

export const WarMachines = () => {
    const { newSnackbarMessage } = useSnackbar()
    const theme = useTheme<Theme>()
    const { userID } = useGameServerAuth()
    const { state, subscribe, send } = useGameServerWebsocket()
    const { battleIdentifier } = useSupremacy()
    const [telegramShortcode, setTelegramShortcode] = useState("")

    const [queueFeed, setQueueFeed] = useState<QueueFeedResponse>()
    const [queueUpdated, setQueueUpdated] = useDebounce(false, 1300)
    const [assetsQueue, setAssetsQueue] = useState<AssetQueue[]>()
    const cachedAssetQueue = useRef<AssetQueue[]>()
    const [preventAssetsRefresh, togglePreventAssetsRefresh] = useToggle()

    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 12, page: 1 })

    // Subscribe to queue feed
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID) return
        return subscribe<QueueFeedResponse>(GameServerKeys.SubQueueFeed, (payload) => {
            if (payload) setQueueFeed(payload)
        })
    }, [state, subscribe, userID])

    // Get assets
    useEffect(() => {
        ;(async () => {
            try {
                if (!preventAssetsRefresh) setIsLoading(true)
                if (state !== WebSocket.OPEN || !send) return
                const resp = await send<
                    GetAssetsResponse,
                    {
                        page_number: number
                        page_size: number
                    }
                >(GameServerKeys.GetAssetsQueue, {
                    page_number: page - 1, // start with 0
                    page_size: pageSize,
                })

                if (!resp) return
                if (preventAssetsRefresh) {
                    cachedAssetQueue.current = resp.asset_queue_list
                } else {
                    setAssetsQueue(resp.asset_queue_list)
                }
                setTotalItems(resp.total)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get war machines.", "error")
                console.debug(e)
            } finally {
                setIsLoading(false)
            }
        })()
        // NOTE: state change of `preventAssetsRefresh` doesnt need to trigger a send
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [send, state, page, pageSize, queueUpdated, battleIdentifier, setTotalItems, newSnackbarMessage])

    // Update assets (the page) from the cache
    useEffect(() => {
        if (!preventAssetsRefresh && cachedAssetQueue.current) setAssetsQueue(cachedAssetQueue.current)
        cachedAssetQueue.current = undefined
    }, [preventAssetsRefresh])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return

        return subscribe(GameServerKeys.TriggerBattleQueueUpdated, async () => {
            setQueueUpdated((prev) => !prev)
        })
    }, [state, subscribe, setQueueUpdated])

    const content = useMemo(() => {
        if (isLoading || !assetsQueue || !queueFeed) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress size="2rem" sx={{ color: colors.neonBlue }} />
                </Stack>
            )
        }

        if (assetsQueue && assetsQueue.length > 0) {
            return (
                <Stack spacing=".6rem">
                    {assetsQueue.map((aq) => (
                        // <AssetItem
                        //     key={`${aq.hash}-${aq.position}`}
                        //     telegramShortcode={telegramShortcode}
                        //     setTelegramShortcode={setTelegramShortcode}
                        //     assetQueue={aq}
                        //     queueFeed={queueFeed}
                        //     togglePreventAssetsRefresh={togglePreventAssetsRefresh}
                        // />
                        <></>
                    ))}
                </Stack>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }} spacing=".5rem">
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: ".56rem",
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        userSelect: "text !important",
                        opacity: 0.8,
                    }}
                >
                    {"You don't own any war machines yet."}
                </Typography>
                <FancyButton
                    href={`${PASSPORT_WEB}stores`}
                    target="_blank"
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: theme.factionTheme.background,
                        border: { borderColor: colors.neonBlue },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1.8rem", py: ".5rem" }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: colors.neonBlue,
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        GO TO ASSET STORE
                    </Typography>
                </FancyButton>
            </Stack>
        )
    }, [isLoading, assetsQueue, queueFeed, telegramShortcode, setTelegramShortcode, togglePreventAssetsRefresh])

    return (
        <>
            <Stack sx={{ height: "100%" }}>
                <ClipThing
                    clipSize="10px"
                    border={{
                        isFancy: true,
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".15rem",
                    }}
                    opacity={0.7}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", minWidth: "95rem", maxWidth: "65%" }}
                >
                    <Stack sx={{ height: "100%" }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                px: "1.5rem",
                                pt: ".6rem",
                                pb: ".3rem",
                                backgroundColor: "#00000070",
                                borderBottom: (theme) => `${theme.factionTheme.primary}70 1px solid`,
                                span: {
                                    fontFamily: fonts.nostromoBold,
                                },
                            }}
                        >
                            <Typography variant="caption">
                                <strong>DISPLAYING:</strong> {assetsQueue?.length || 0} of {totalItems}
                            </Typography>
                            <Stack direction="row" alignItems="center">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setPageSize(12)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: pageSize === 12 ? 1 : 0.3 }}>
                                        12
                                    </Typography>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setPageSize(24)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: pageSize === 24 ? 1 : 0.3 }}>
                                        24
                                    </Typography>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setPageSize(36)
                                        changePage(1)
                                    }}
                                >
                                    <Typography variant="caption" sx={{ opacity: pageSize === 36 ? 1 : 0.3 }}>
                                        36
                                    </Typography>
                                </IconButton>
                            </Stack>
                        </Stack>

                        <Box
                            sx={{
                                my: ".8rem",
                                ml: ".3rem",
                                pl: ".5rem",
                                mr: ".3rem",
                                pr: ".5rem",
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
                            {content}
                        </Box>

                        {assetsQueue && totalPages > 1 && (
                            <Box sx={{ px: "1rem", py: ".5rem", backgroundColor: "#00000050" }}>
                                <Pagination size="small" count={totalPages} page={page} onChange={(e, p) => changePage(p)} showFirstButton showLastButton />
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Stack>

            <TelegramShortcodeModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} open={!!telegramShortcode} />
        </>
    )
}
