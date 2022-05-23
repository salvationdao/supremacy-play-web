<<<<<<< HEAD:src/components/RightDrawer/Assets/AssetItem.tsx
import { useMemo, useState } from "react"
import { AssetQueue, DeployConfirmation, QueueFeedResponse } from "../.."
import { getRarityDeets, supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { Asset } from "../../../types/assets"
import { MechDrawer } from "./MechDrawer"
import { LeaveConfirmation } from "./LeaveConfirmation"
import { PassportServerKeys } from "../../../keys"
import { SvgSupToken } from "../../../assets"
import { usePassportSubscriptionUser } from "../../../hooks/usePassport"
import { useAuth } from "../../../containers/auth"
import { Box, Button, Fade, Stack, Typography } from "@mui/material"

=======
export const AssetItem = () => {
    return null
}
/*
>>>>>>> develop:src/components/Hangar/WarMachines/Assets/AssetItem.tsx
export const AssetItem = ({
    assetQueue,
    queueFeed,
    isGridView,
    togglePreventAssetsRefresh,
}: {
    assetQueue: AssetQueue
<<<<<<< HEAD:src/components/RightDrawer/Assets/AssetItem.tsx
    queueFeed: QueueFeedResponse
=======
    queueFeed: QueueFeed
    telegramShortcode?: string
    setTelegramShortcode?: (s: string) => void
>>>>>>> develop:src/components/Hangar/WarMachines/Assets/AssetItem.tsx
    isGridView: boolean
    togglePreventAssetsRefresh: (value?: boolean | undefined) => void
}) => {
    const { userID } = useAuth()

    const [assetData, setAssetData] = useState<Asset>()

    const [mechDrawerOpen, toggleMechDrawerOpen] = useToggle()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()
    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()

    const rarityDeets = useMemo(() => getRarityDeets(assetData?.tier || ""), [assetData])

    // Status
    const [repairStatus, setRepairStatus] = useState<RepairStatus>()
    const isInQueue = useMemo(() => assetQueue && assetQueue.position && assetQueue.position >= 1, [assetQueue])

    // Subscribe on asset data
    usePassportSubscriptionUser<{ purchased_item: Asset }>(
        {
            URI: `/xxxxxxxxxx/${assetQueue.hash}`,
            key: PassportServerKeys.SubAssetData,
        },
        (payload) => {
            if (!payload || !payload.purchased_item) return
            setAssetData(payload.purchased_item)
        },
    )

    // Subscribe on asset repair status
    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             if (state !== WebSocket.OPEN || !send) return
    //             const resp = await send<RepairStatus>(GameServerKeys.SubRepairStatus, {
    //                 mech_id: assetQueue.mech_id,
    //             })
    //             if (resp) setRepairStatus(resp)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })()
    // }, [state, send, assetQueue])

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

                                {isInQueue && assetQueue && assetQueue.position && (
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

                        {isInQueue && assetQueue && assetQueue.position && (
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

    if (!assetData || !userID) return null

    return (
        <>
            <Fade key={`${isGridView}`} in={true}>
                {mechItem}
            </Fade>

<<<<<<< HEAD:src/components/RightDrawer/Assets/AssetItem.tsx
            {deployModalOpen && (
                // <DeployConfirmation open={deployModalOpen} asset={assetData} queueFeed={queueFeed} onClose={() => toggleDeployModalOpen(false)} />
                <DeployConfirmation
                    open={deployModalOpen}
                    asset={assetData}
                    queueFeed={queueFeed}
                    onClose={() => {
                        toggleDeployModalOpen(false)
                        togglePreventAssetsRefresh(false)
                    }}
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

=======
>>>>>>> develop:src/components/Hangar/WarMachines/Assets/AssetItem.tsx
            {mechDrawerOpen && (
                <MechDrawer
                    open={mechDrawerOpen}
                    asset={assetData}
                    assetQueue={assetQueue}
                    repairStatus={repairStatus}
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
*/
