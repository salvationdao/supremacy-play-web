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
import { useDrawer, usePassportServerAuth, usePassportServerWebsocket, useQueue } from "../../containers"
import { PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset } from "../../types/assets"

const DrawerContent = () => {
    const { state, send, subscribe } = usePassportServerWebsocket()
    const { factionID } = usePassportServerAuth()

    const [assets, setAssets] = useState<Asset[]>([])
    const { queueLength, queueCost } = useQueue()

    const [contractReward, setContractReward] = useState<string>()

    // Subscribe to the list of mechs that the user owns
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<Asset[]>(PassportServerKeys.SubAssetList, (payload) => {
            if (!payload) return
            setAssets(payload)
        })
    }, [state, subscribe, factionID])

    // Subscribe to the contract reward
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NullUUID) return
        return subscribe<string>(PassportServerKeys.SubFactionContractReward, (payload) => {
            if (!payload) return
            setContractReward(payload)
        })
    }, [state, subscribe, factionID])

    return (
        <Stack sx={{ flex: 1 }}>
            <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: 2.5,
                    pr: 6,
                    height: GAME_BAR_HEIGHT,
                    background: `${colors.assetsBanner}65`,
                    boxShadow: 1.5,
                }}
            >
                <SvgRobot size="23px" fill={colors.text} sx={{ pb: 0.7 }} />
                <Typography variant="caption" sx={{ fontFamily: "Nostromo Regular Black" }}>
                    WAR MACHINES
                </Typography>
            </Stack>

            <Fade in={true}>
                <Box
                    sx={{
                        m: 0.5,
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",
                        scrollbarWidth: "none",
                        "::-webkit-scrollbar": {
                            width: 4,
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
                    <Stack spacing={0.6}>
                        {assets && assets.length > 0 ? (
                            <>
                                {assets.map((a, index) => (
                                    <AssetItem
                                        key={a.hash}
                                        passportWeb={PASSPORT_WEB}
                                        asset={a}
                                        queueCost={queueCost}
                                        queueLength={queueLength}
                                        contractReward={contractReward}
                                        renderQueuedOnly
                                    />
                                ))}
                                {assets.map((a, index) => (
                                    <AssetItem
                                        key={a.hash}
                                        passportWeb={PASSPORT_WEB}
                                        asset={a}
                                        queueCost={queueCost}
                                        queueLength={queueLength}
                                        contractReward={contractReward}
                                    />
                                ))}
                            </>
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        px: 1.6,
                                        pt: 1.6,
                                        mb: 0.7,
                                        color: colors.grey,
                                        fontSize: "0.8rem",
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
                                            fontSize: "0.8rem",
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
                width: LIVE_CHAT_DRAWER_WIDTH,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: LIVE_CHAT_DRAWER_WIDTH,
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
