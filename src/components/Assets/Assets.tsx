import { Box, Button, Drawer, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
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
    useGameServerAuth,
    useGameServerWebsocket,
    usePassportServerAuth,
    usePassportServerWebsocket,
} from "../../containers"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset } from "../../types/assets"

interface QueueFeed {
    queue_length: number
    queue_cost: string
    contract_reward: string
}

const DrawerContent = () => {
    const { state, subscribe } = usePassportServerWebsocket()
    const { faction_id } = usePassportServerAuth()
    const { state: gsState, subscribe: gsSubscribe } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const [queueLength, setQueueLength] = useState<number>(-1)
    const [queueCost, setQueueCost] = useState<string>("")
    const [contractReward, setContractReward] = useState<string>("")

    const [assets, setAssets] = useState<Asset[]>([])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<QueueFeed>(GameServerKeys.SubQueueStatus, (payload) => {
            if (!payload) return
            setQueueLength(payload.queue_length)
            setQueueCost(payload.queue_cost)
            setContractReward(payload.contract_reward)
        })
    }, [gsState, gsSubscribe, user])

    // Subscribe to the list of mechs that the user owns
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !faction_id || faction_id === NullUUID) return
        return subscribe<Asset[]>(PassportServerKeys.SubAssetList, (payload) => {
            if (!payload) return
            payload = payload.filter((asset) => {
                return asset.on_chain_status !== "STAKABLE" && asset.unlocked_at <= new Date(Date.now())
            })
            setAssets(payload)
        })
    }, [state, subscribe, faction_id])

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
                    <Stack spacing=".48rem">
                        {assets && assets.length > 0 ? (
                            <>
                                {assets.map((a, index) => (
                                    <AssetItem
                                        key={`${a.hash}-${index}-render_queued_only`}
                                        asset={a}
                                        queueCost={queueCost}
                                        contractReward={contractReward}
                                        renderQueuedOnly
                                    />
                                ))}
                                {assets.map((a, index) => (
                                    <AssetItem
                                        key={`${a.hash}-${index}-dont-render-queued`}
                                        asset={a}
                                        queueCost={queueCost}
                                        contractReward={contractReward}
                                    />
                                ))}
                            </>
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        px: "1.28rem",
                                        pt: "1.28rem",
                                        mb: ".56rem",
                                        color: colors.grey,
                                        userSelect: "text",
                                    }}
                                >
                                    {"You don't own any assets yet."}
                                </Typography>
                                <Button href={`${PASSPORT_WEB}stores`} target="_blank" size="small" variant="outlined">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: colors.neonBlue,
                                            userSelect: "text",
                                        }}
                                    >
                                        GO TO ASSET STORE
                                    </Typography>
                                </Button>
                            </Stack>
                        )}
                    </Stack>
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
                <DrawerContent />
            </Stack>
        </Drawer>
    )
}
