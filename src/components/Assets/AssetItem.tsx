import { Box, Button, IconButton, Link, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { DeployConfirmation, TooltipHelper } from ".."
import { SvgExternalLink, SvgHistoryClock, SvgSupToken } from "../../assets"
import { PASSPORT_WEB, UNDER_MAINTENANCE } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { getRarityDeets, supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset, AssetQueueStat } from "../../types/assets"
import { HistoryDrawer } from "./HistoryDrawer"
import { LeaveConfirmation } from "./LeaveConfirmation"

// const RepairCountdown = ({ endTime }: { endTime: Date }) => {
//     const { hours, minutes, seconds } = useTimer(endTime)

//     return (
//         <>
//             {hours && hours > 0 ? `${hours}h` : ""} {minutes && minutes > 0 ? `${minutes}h` : ""}{" "}
//             {seconds && seconds > 0 ? `${seconds}h` : ""}
//         </>
//     )
// }

export const AssetItem = ({
    asset,
    assetQueueStatus,
    queueLength,
    queueCost,
    contractReward,
    setTelegramShortcode,
}: {
    asset: Asset
    assetQueueStatus?: AssetQueueStat
    queueLength: number
    queueCost: string
    contractReward: string
    telegramShortcode?: string
    setTelegramShortcode?: (s: string) => void
}) => {
    const { user } = usePassportServerAuth()
    const { state, subscribe } = usePassportServerWebsocket()
    const { state: gsState } = useGameServerWebsocket()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()

    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()
    const [historyDrawerOpen, toggleHistoryDrawerOpen] = useToggle()

    const [mouseOver, setMouseOver] = useState<boolean>(false)
    const [assetData, setAssetData] = useState<Asset>(asset)
    const rarityDeets = useMemo(() => getRarityDeets(assetData.tier), [assetData])

    // Subscribe on asset data
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !asset) return
        return subscribe<{ purchased_item: Asset }>(
            PassportServerKeys.SubAssetData,
            (payload) => {
                if (!payload || !payload.purchased_item) return
                setAssetData(payload.purchased_item)
            },
            { asset_hash: asset.hash },
        )
    }, [state, subscribe])

    const isGameServerUp = useMemo(() => gsState == WebSocket.OPEN && !UNDER_MAINTENANCE, [gsState])
    const isRepairing = false // To be implemented on gameserver
    const isInBattle = useMemo(() => assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position === -1, [assetQueueStatus])
    const isInQueue = useMemo(() => assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position >= 1, [assetQueueStatus])

    if (!assetData || !user) return null

    const { hash, name, label, image_url } = assetData.data.mech

    const statusArea = useMemo(() => {
        // If game server is down, don't show deploy button
        if (!isGameServerUp) {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        px: ".8rem",
                        pt: ".48rem",
                        pb: ".24rem",
                        color: "grey",
                        lineHeight: 1,
                        border: `${"grey"} 1px solid`,
                        borderRadius: 0.3,
                        opacity: 0.6,
                    }}
                >
                    GAME OFFLINE
                </Typography>
            )
        }

        if (isRepairing) {
            // const { started_at, expect_completed_at } = durability
            // const isFastMode = durability.repair_type == "FAST"
            // return (
            //     <>
            //         <Typography
            //             variant="body2"
            //             sx={{
            //                 px: '.8rem',
            //                 pt: '.48rem',
            //                 pb: '.24rem',
            //                 color: colors.neonBlue,
            //                 lineHeight: 1,
            //                 border: `${colors.neonBlue} 1px solid`,
            //                 borderRadius: 0.3,
            //             }}
            //         >
            //             REPAIRING
            //         </Typography>
            //         <Stack direction="row" alignItems="center" spacing=".32rem" sx={{ pt: '.24rem' }}>
            //             {isFastMode && <SvgFastRepair size="1rem" fill={colors.neonBlue} />}
            //             <SvgCooldown size="1.2rem" fill={colors.neonBlue} />
            //             <Typography
            //                 variant="caption"
            //                 sx={{ lineHeight: 1, color: colors.neonBlue, fontFamily: "Nostromo Regular Bold" }}
            //             >
            //                 <RepairCountdown endTime={expect_completed_at} />
            //             </Typography>
            //         </Stack>
            //     </>
            // )
        }

        if (isInBattle && assetQueueStatus) {
            return (
                <>
                    <Typography
                        variant="body2"
                        sx={{
                            px: ".8rem",
                            pt: ".48rem",
                            pb: ".24rem",
                            color: colors.orange,
                            lineHeight: 1,
                            border: `${colors.orange} 1px solid`,
                            borderRadius: 0.3,
                        }}
                    >
                        IN BATTLE
                    </Typography>
                    {assetQueueStatus.contract_reward && (
                        <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(assetQueueStatus.contract_reward, 2)}
                            </Typography>
                        </Stack>
                    )}
                </>
            )
        }

        if (isInQueue && assetQueueStatus) {
            return (
                <>
                    <Button
                        onMouseEnter={() => setMouseOver(true)}
                        onMouseLeave={() => setMouseOver(false)}
                        onFocus={() => setMouseOver(true)}
                        onBlur={() => setMouseOver(false)}
                        onClick={() => toggleLeaveModalOpen(true)}
                        variant="contained"
                        size="small"
                        sx={{
                            display: "inline",
                            padding: 0,
                            px: ".8rem",
                            pt: ".48rem",
                            pb: ".24rem",
                            cursor: "pointer",
                            width: "8.2rem",
                            textAlign: "center",
                            backgroundColor: "transparent",
                            color: mouseOver ? colors.red : colors.yellow,
                            lineHeight: 1,
                            border: `${mouseOver ? colors.red : colors.yellow} 1px solid`,
                            borderRadius: 0.3,
                            whiteSpace: "nowrap",
                            ":hover": {
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                opacity: 1,
                            },
                        }}
                    >
                        <Typography variant="body2" lineHeight={1} sx={{ color: mouseOver ? colors.red : colors.yellow }}>
                            {mouseOver ? "LEAVE QUEUE" : "IN QUEUE"}
                        </Typography>
                    </Button>
                    {assetQueueStatus.contract_reward && (
                        <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(assetQueueStatus.contract_reward, 2)}
                            </Typography>
                        </Stack>
                    )}
                </>
            )
        }

        return (
            <Button
                variant="contained"
                size="small"
                onClick={() => toggleDeployModalOpen(true)}
                sx={{
                    minWidth: 0,
                    px: ".8rem",
                    pt: ".48rem",
                    pb: 0.4,
                    boxShadow: 0,
                    backgroundColor: colors.green,
                    borderRadius: 0.3,
                    ":hover": { backgroundColor: `${colors.green}90` },
                }}
            >
                <Typography variant="body2" sx={{ lineHeight: 1 }}>
                    DEPLOY
                </Typography>
            </Button>
        )
    }, [isGameServerUp, isRepairing, isInQueue, mouseOver, assetQueueStatus])

    return (
        <Stack
            direction="row"
            spacing="1.44rem"
            sx={{
                position: "relative",
                px: "1.04rem",
                py: ".8rem",
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

                {isGameServerUp && isInQueue && assetQueueStatus && assetQueueStatus.queue_position && (
                    <Box sx={{ position: "absolute", top: 0, left: 0 }}>
                        <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>{assetQueueStatus.queue_position}</Typography>
                    </Box>
                )}

                <TooltipHelper text={`Rarity: ${rarityDeets.label}`} placement="right">
                    <Stack
                        direction="row"
                        spacing=".08rem"
                        sx={{
                            position: "absolute",
                            bottom: "-1.4rem",
                            left: ".1rem",
                            height: "4.2rem",
                            transform: "rotate(-40deg)",
                            zIndex: 3,
                        }}
                    >
                        <Box
                            sx={{
                                width: 3,
                                height: "100%",
                                backgroundColor: rarityDeets.color,
                                border: "#00000090 1.5px solid",
                            }}
                        />
                        <Box
                            sx={{
                                width: 3,
                                height: "100%",
                                backgroundColor: rarityDeets.color,
                                border: "#00000090 1.5px solid",
                            }}
                        />
                    </Stack>
                </TooltipHelper>
            </Box>
            <Stack spacing=".4rem" justifyContent="space-between" sx={{ flex: 1, pb: ".2rem" }}>
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: "Nostromo Regular Bold",
                        fontWeight: "fontWeightBold",
                        wordBreak: "break-word",
                    }}
                >
                    {name || label}
                </Typography>

                <Stack alignItems="center" direction="row" spacing=".96rem">
                    {statusArea}
                </Stack>
            </Stack>

            <Stack spacing=".3rem" sx={{ pt: ".2rem" }}>
                <TooltipHelper placement="left" text="View asset in Passport">
                    <Link
                        sx={{
                            display: "block",
                            marginBottom: ".5rem",
                        }}
                        href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                        target="_blank"
                    >
                        <SvgExternalLink size="1.2rem" sx={{ opacity: 0.4, ":hover": { opacity: 0.9 } }} />
                    </Link>
                </TooltipHelper>

                <TooltipHelper placement="left" text="View battle history">
                    <IconButton onClick={() => toggleHistoryDrawerOpen(true)} sx={{ p: 0 }}>
                        <SvgHistoryClock size="1.3rem" sx={{ opacity: 0.4, ":hover": { opacity: 0.9 } }} />
                    </IconButton>
                </TooltipHelper>
            </Stack>

            {deployModalOpen && (
                <DeployConfirmation
                    open={deployModalOpen}
                    asset={asset}
                    queueLength={queueLength}
                    queueCost={queueCost}
                    contractReward={contractReward}
                    onClose={() => toggleDeployModalOpen(false)}
                    setTelegramShortcode={setTelegramShortcode}
                />
            )}

            {leaveModalOpen && <LeaveConfirmation open={leaveModalOpen} asset={asset} onClose={() => toggleLeaveModalOpen(false)} />}

            {historyDrawerOpen && <HistoryDrawer open={historyDrawerOpen} asset={asset} onClose={() => toggleHistoryDrawerOpen(false)} />}
        </Stack>
    )
}
