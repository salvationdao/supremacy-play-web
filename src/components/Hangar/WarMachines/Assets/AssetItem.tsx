import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { DeployConfirmation } from "../../.."
import { UNDER_MAINTENANCE } from "../../../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket } from "../../../../containers"
import { getRarityDeets } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"
import { Asset } from "../../../../types/assets"
import { MechDrawer } from "./MechDrawer"
import { LeaveConfirmation } from "./LeaveConfirmation"
import { GameServerKeys, PassportServerKeys } from "../../../../keys"
import { StatusArea } from "./Common/StatusArea"
import { RepairStatus } from "../../../../types"
import { AssetQueue, QueueFeedResponse } from "../WarMachines"

export const AssetItem = ({
    assetQueue,
    queueFeed,
    setTelegramShortcode,
    isGridView,
    togglePreventAssetsRefresh,
}: {
    assetQueue: AssetQueue
    queueFeed: QueueFeedResponse
    telegramShortcode?: string
    setTelegramShortcode?: (s: string) => void
    isGridView: boolean
    togglePreventAssetsRefresh: (value?: boolean | undefined) => void
}) => {
    const { user } = usePassportServerAuth()
    const { state, send } = useGameServerWebsocket()
    const { state: psState, subscribe: psSubscribe } = usePassportServerWebsocket()
    const [assetData, setAssetData] = useState<Asset>()

    const [mechDrawerOpen, toggleMechDrawerOpen] = useToggle()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()
    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()

    const rarityDeets = useMemo(() => getRarityDeets(assetData?.tier || ""), [assetData])

    // Status
    const [repairStatus, setRepairStatus] = useState<RepairStatus>()
    const isGameServerUp = useMemo(() => state == WebSocket.OPEN && !UNDER_MAINTENANCE, [state])
    const isInQueue = useMemo(() => assetQueue && assetQueue.position && assetQueue.position >= 1, [assetQueue])

    // Subscribe on asset data
    useEffect(() => {
        if (psState !== WebSocket.OPEN || !psSubscribe || !assetQueue) return
        return psSubscribe<{ purchased_item: Asset }>(
            PassportServerKeys.SubAssetData,
            (payload) => {
                if (!payload || !payload.purchased_item) return
                setAssetData(payload.purchased_item)
            },
            { asset_hash: assetQueue.hash },
        )
    }, [psState, psSubscribe, assetQueue])

    // Subscribe on asset repair status
    useEffect(() => {
        ;(async () => {
            try {
                if (state !== WebSocket.OPEN || !send) return
                const resp = await send<RepairStatus>(GameServerKeys.SubRepairStatus, {
                    mech_id: assetQueue.mech_id,
                })
                if (resp) setRepairStatus(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [state, send, assetQueue])

    // const instantRepair = useCallback(async () => {
    //     try {
    //         if (state !== WebSocket.OPEN || !send || !assetQueue) return
    //         await send<boolean>(GameServerKeys.SubmitRepair, payload, { mech_id: assetQueue.mech_id })
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }, [assetQueue])

    const mechItem = useMemo(() => {
        if (!assetData) return <></>
        const { name, label, image_url } = assetData.data.mech

        if (isGridView) {
            return (
                <Box sx={{ p: ".4rem", width: "33.33%" }}>
                    <Box
                        onClick={() => {
                            toggleMechDrawerOpen()
                            togglePreventAssetsRefresh(true)
                        }}
                        sx={{
                            height: "100%",
                            borderRadius: 0.2,
                            cursor: "pointer",
                            ":hover": { backgroundColor: `#FFFFFF20` },
                        }}
                    >
                        <Stack
                            sx={{
                                height: "100%",
                                px: ".7rem",
                                pt: ".6rem",
                                pb: ".8rem",
                                backgroundColor: `${colors.navy}80`,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "relative",
                                    flexShrink: 0,
                                    alignSelf: "stretch",
                                    px: ".48rem",
                                    py: ".8rem",
                                    boxShadow: "inset 0 0 8px 6px #00000055",
                                    overflow: "hidden",
                                    borderRadius: 0.5,
                                }}
                            >
                                <Box
                                    sx={{
                                        height: "5.5rem",
                                        flexShrink: 0,
                                        overflow: "hidden",
                                        backgroundImage: `url(${image_url})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}
                                />

                                {isGameServerUp && isInQueue && assetQueue && assetQueue.position && (
                                    <Box sx={{ position: "absolute", bottom: ".1rem", left: ".5rem" }}>
                                        <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{assetQueue.position}</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Typography
                                variant="caption"
                                sx={{
                                    fontFamily: fonts.nostromoBold,
                                    letterSpacing: ".1rem",
                                    fontSize: "1rem",
                                    lineHeight: 1.25,
                                    mt: ".6rem",
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    overflowWrap: "anywhere",
                                    textOverflow: "ellipsis",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                }}
                            >
                                {name || label}
                            </Typography>

                            <Stack spacing=".3rem" alignItems="center" sx={{ mt: "auto", pt: ".7rem" }}>
                                <StatusArea
                                    isGridView={isGridView}
                                    isGameServerUp={isGameServerUp}
                                    isInQueue={!!isInQueue}
                                    assetQueue={assetQueue}
                                    repairStatus={repairStatus}
                                    openLeaveModal={() => toggleLeaveModalOpen(true)}
                                    openDeployModal={() => toggleDeployModalOpen(true)}
                                    togglePreventAssetsRefresh={togglePreventAssetsRefresh}
                                />
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            )
        }

        return (
            <Box
                onClick={() => {
                    toggleMechDrawerOpen()
                    togglePreventAssetsRefresh(true)
                }}
                sx={{
                    cursor: "pointer",
                    ":hover": { backgroundColor: `#FFFFFF20` },
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing="1.44rem"
                    sx={{
                        position: "relative",
                        px: "1.3rem",
                        py: "1rem",
                        backgroundColor: `${colors.navy}80`,
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            flexShrink: 0,
                            px: ".48rem",
                            py: ".8rem",
                            boxShadow: "inset 0 0 8px 6px #00000055",
                            overflow: "hidden",
                            borderRadius: 0.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: "5.5rem",
                                height: "5.5rem",
                                flexShrink: 0,
                                overflow: "hidden",
                                backgroundImage: `url(${image_url})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                            }}
                        />

                        {isGameServerUp && isInQueue && assetQueue && assetQueue.position && (
                            <Box sx={{ position: "absolute", bottom: ".1rem", left: ".5rem" }}>
                                <Typography sx={{ fontFamily: fonts.nostromoBlack }}>{assetQueue.position}</Typography>
                            </Box>
                        )}
                    </Box>

                    <Stack sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ lineHeight: 1, color: rarityDeets.color, fontFamily: fonts.nostromoBlack }}>
                            {rarityDeets.label}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                my: ".2rem",
                                fontFamily: fonts.nostromoBold,
                                letterSpacing: ".1rem",
                                display: "-webkit-box",
                                overflow: "hidden",
                                overflowWrap: "anywhere",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {name || label}
                        </Typography>

                        <Stack alignItems="center" direction="row" spacing=".6rem" sx={{ mt: ".1rem" }}>
                            <StatusArea
                                isGridView={isGridView}
                                isGameServerUp={isGameServerUp}
                                isInQueue={!!isInQueue}
                                assetQueue={assetQueue}
                                repairStatus={repairStatus}
                                openLeaveModal={() => toggleLeaveModalOpen(true)}
                                openDeployModal={() => toggleDeployModalOpen(true)}
                                togglePreventAssetsRefresh={togglePreventAssetsRefresh}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        )
    }, [
        assetData,
        isGridView,
        isGameServerUp,
        isInQueue,
        assetQueue,
        rarityDeets.color,
        rarityDeets.label,
        repairStatus,
        toggleMechDrawerOpen,
        togglePreventAssetsRefresh,
        toggleLeaveModalOpen,
        toggleDeployModalOpen,
    ])

    if (!assetData || !user) return null

    return (
        <>
            <Fade key={`${isGridView}`} in={true}>
                {mechItem}
            </Fade>

            {deployModalOpen && (
                <DeployConfirmation
                    open={deployModalOpen}
                    asset={assetData}
                    queueFeed={queueFeed}
                    onClose={() => {
                        toggleDeployModalOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
                    setTelegramShortcode={setTelegramShortcode}
                />
            )}

            {leaveModalOpen && (
                <LeaveConfirmation
                    open={leaveModalOpen}
                    asset={assetData}
                    onClose={() => {
                        toggleLeaveModalOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
                />
            )}

            {mechDrawerOpen && (
                <MechDrawer
                    user={user}
                    open={mechDrawerOpen}
                    asset={assetData}
                    assetQueue={assetQueue}
                    repairStatus={repairStatus}
                    isGameServerUp={isGameServerUp}
                    isInQueue={!!isInQueue}
                    onClose={() => {
                        toggleMechDrawerOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
                    openDeployModal={() => {
                        toggleDeployModalOpen(true)
                        togglePreventAssetsRefresh(true)
                    }}
                    openLeaveModal={() => {
                        toggleLeaveModalOpen(true)
                        togglePreventAssetsRefresh(true)
                    }}
                    togglePreventAssetsRefresh={togglePreventAssetsRefresh}
                />
            )}
        </>
    )
}
