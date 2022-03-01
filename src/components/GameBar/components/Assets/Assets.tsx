import { Box, Button, Drawer, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useCallback, useState } from "react"
import { AssetItem, DrawerButtons } from ".."
import { useDrawer } from "../../containers/drawer"
import { SvgAssets, SvgRefresh, SvgRobot } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, LIVE_CHAT_DRAWER_WIDTH, NilUUID } from "../../constants"
import { useAuth, useWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import HubKey from "../../keys"
import { colors } from "../../theme"
import { QueuedWarMachine } from "../../types/assets"

const DrawerContent = ({ passportWeb }: { passportWeb: string }) => {
    const { state, send, subscribe } = useWebsocket()
    const { user, factionID } = useAuth()

    const [refresh, toggleRefresh] = useToggle()
    const [queuingList, setQueuingList] = useState<QueuedWarMachine[]>([])
    const [supremacyAssetHashes, setSupremacyAssetsHashes] = useState<string[]>()

    const queuedWarMachine = useCallback(
        (hash: string) => queuingList.find((q) => q.warMachineMetadata.hash === hash),
        [queuingList],
    )

    // Get list the mech queue of the user
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !factionID || factionID === NilUUID) return
        return subscribe<QueuedWarMachine[]>(HubKey.UserWarMachineQueuePositionSubscribe, (payload) => {
            if (!payload) return
            setQueuingList(payload)
        })
    }, [factionID, state, subscribe])

    // Get asset list for current user
    const getAssets = async () => {
        if (state !== WebSocket.OPEN || !send || !user) return
        try {
            const resp = await send<{ assetHashes: string[]; total: number }>(HubKey.AssetList, {
                // pageSize: 6,
                search: "",
                filter: {
                    linkOperator: "and",
                    items: [
                        // filter by user id
                        {
                            columnField: "username",
                            operatorValue: "=",
                            value: user.username,
                        },
                    ],
                },
            })

            if (!resp || resp.assetHashes.length <= 0) return
            setSupremacyAssetsHashes(resp.assetHashes)
        } catch (e) {
            setSupremacyAssetsHashes(undefined)
        } finally {
            toggleRefresh()
        }
    }

    useEffect(() => {
        getAssets()
    }, [send, state, user])

    return (
        <Stack key={refresh} sx={{ flex: 1 }}>
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
                <SvgRobot size="23px" fill={colors.text} />
                <Typography
                    variant="caption"
                    sx={{ flex: 1, color: colors.text, fontFamily: "Nostromo Regular Black" }}
                >
                    ASSETS
                </Typography>

                <IconButton
                    size="small"
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: 10,
                        transform: "translateY(-50%)",
                        color: "#FFFFFF",
                        opacity: 0.6,
                        ":hover": { opacity: 1, transition: "all .2s" },
                    }}
                    onClick={getAssets}
                >
                    <SvgRefresh fill="#FFFFFF" size="13px" />
                </IconButton>
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
                    <Stack>
                        {supremacyAssetHashes && supremacyAssetHashes.length > 0 ? (
                            supremacyAssetHashes.map((id, index) => (
                                <AssetItem
                                    key={id}
                                    index={index}
                                    hash={id}
                                    queueDetail={queuedWarMachine(id)}
                                    passportWeb={passportWeb}
                                />
                            ))
                        ) : (
                            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        px: 1.6,
                                        pt: 1.6,
                                        mb: 0.7,
                                        color: colors.grey,
                                        fontFamily: "Share Tech",
                                        fontSize: "0.8rem",
                                        userSelect: "text",
                                    }}
                                >
                                    {"You don't own any assets yet."}
                                </Typography>
                                <Button href={`${passportWeb}/stores`} target="_blank" size="small" variant="outlined">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: colors.neonBlue,
                                            fontFamily: "Share Tech",
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

export const Assets = ({ passportWeb }: { passportWeb: string }) => {
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
                <DrawerContent passportWeb={passportWeb} />
            </Stack>
        </Drawer>
    )
}
