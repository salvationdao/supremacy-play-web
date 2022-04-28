import { Box, Button, CircularProgress, Fade, IconButton, Pagination, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { AssetItem } from "../.."
import { SvgGridView, SvgListView, SvgRobot } from "../../../assets"
import { PASSPORT_WEB } from "../../../constants"
import { useGameServerAuth, useGameServerWebsocket, useSnackbar, useSupremacy } from "../../../containers"
import { usePagination, useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { TelegramShortcodeModal } from "./DeployConfirmation"

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

export const Assets = () => {
    const [isGridView, toggleIsGridView] = useToggle()
    const [telegramShortcode, setTelegramShortcode] = useState("")

    return (
        <>
            <Fade in>
                <Stack
                    direction="row"
                    id="tutorial-asset"
                    sx={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: colors.darkNavy,
                    }}
                >
                    <Content
                        telegramShortcode={telegramShortcode}
                        setTelegramShortcode={setTelegramShortcode}
                        isGridView={isGridView}
                        toggleIsGridView={toggleIsGridView}
                    />
                </Stack>
            </Fade>

            <TelegramShortcodeModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} open={!!telegramShortcode} />
        </>
    )
}

const Content = ({
    telegramShortcode,
    setTelegramShortcode,
    isGridView,
    toggleIsGridView,
}: {
    telegramShortcode?: string
    setTelegramShortcode?: (s: string) => void
    isGridView: boolean
    toggleIsGridView: (value?: boolean | undefined) => void
}) => {
    const { newSnackbarMessage } = useSnackbar()
    const { user } = useGameServerAuth()
    const { state, subscribe, send } = useGameServerWebsocket()
    const { battleIdentifier } = useSupremacy()

    const [queueFeed, setQueueFeed] = useState<QueueFeedResponse>()
    const [assetsQueue, setAssetsQueue] = useState<AssetQueue[]>()
    const [queueUpdated, toggleQueueUpdated] = useToggle()

    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 12, page: 1 })

    // Subscribe to queue feed
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<QueueFeedResponse>(GameServerKeys.SubQueueFeed, (payload) => {
            if (payload) setQueueFeed(payload)
        })
    }, [state, subscribe, user])

    // Get assets
    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
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
                setAssetsQueue(resp.asset_queue_list)
                setTotalItems(resp.total)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get assets.", "error")
                console.debug(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send, state, page, pageSize, queueUpdated, battleIdentifier, setTotalItems, newSnackbarMessage])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return

        return subscribe(GameServerKeys.TriggerBattleQueueUpdated, async () => {
            toggleQueueUpdated()
        })
    }, [state, subscribe, toggleQueueUpdated])

    const content = useMemo(() => {
        if (isLoading || !assetsQueue || !queueFeed) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
                </Stack>
            )
        }

        if (assetsQueue && assetsQueue.length > 0) {
            return (
                <Stack spacing={isGridView ? 0 : ".6rem"} direction={isGridView ? "row" : "column"} flexWrap={isGridView ? "wrap" : "unset"}>
                    {assetsQueue.map((aq) => (
                        <AssetItem
                            key={`${aq.hash}-${aq.position}`}
                            telegramShortcode={telegramShortcode}
                            setTelegramShortcode={setTelegramShortcode}
                            assetQueue={aq}
                            queueFeed={queueFeed}
                            isGridView={isGridView}
                        />
                    ))}
                </Stack>
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
                        opacity: 0.8,
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
    }, [isLoading, assetsQueue, queueFeed, isGridView, telegramShortcode, setTelegramShortcode])

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
                    height: `${5}rem`,
                    background: `${colors.assetsBanner}65`,
                    boxShadow: 1.5,
                }}
            >
                <SvgRobot size="2.3rem" fill={colors.text} sx={{ pb: ".56rem" }} />
                <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack }}>
                    WAR MACHINES
                </Typography>
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ pl: "1.2rem", pr: ".6rem", py: ".3rem", backgroundColor: "#00000050" }}
            >
                <Typography variant="body2">
                    <strong>DISPLAYING:</strong> {assetsQueue?.length || 0} of {totalItems}
                </Typography>
                <Stack direction="row">
                    <IconButton
                        size="small"
                        onClick={() => {
                            setPageSize(12)
                            changePage(1)
                        }}
                    >
                        <Typography variant="body2" sx={{ opacity: pageSize === 12 ? 1 : 0.3 }}>
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
                        <Typography variant="body2" sx={{ opacity: pageSize === 24 ? 1 : 0.3 }}>
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
                        <Typography variant="body2" sx={{ opacity: pageSize === 36 ? 1 : 0.3 }}>
                            36
                        </Typography>
                    </IconButton>
                    <IconButton size="small" onClick={() => toggleIsGridView(false)}>
                        <SvgListView size="1.2rem" sx={{ opacity: isGridView ? 0.3 : 1 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => toggleIsGridView(true)}>
                        <SvgGridView size="1.2rem" sx={{ opacity: isGridView ? 1 : 0.3 }} />
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
    )
}
