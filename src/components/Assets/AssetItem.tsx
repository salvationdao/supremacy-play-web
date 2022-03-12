import { Box, Button, Link, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { DeployConfirmation, TooltipHelper } from ".."
import { SvgExternalLink, SvgSupToken } from "../../assets"
import { PASSPORT_WEB, UNDER_MAINTENANCE } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { getRarityDeets, supFormatter } from "../../helpers"
import { useTimer, useToggle } from "../../hooks"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset, AssetQueueStat } from "../../types/assets"

const RepairCountdown = ({ endTime }: { endTime: Date }) => {
    const { hours, minutes, seconds } = useTimer(endTime)

    return (
        <>
            {hours && hours > 0 ? `${hours}h` : ""} {minutes && minutes > 0 ? `${minutes}h` : ""}{" "}
            {seconds && seconds > 0 ? `${seconds}h` : ""}
        </>
    )
}

export const AssetItem = ({
    asset,
    queueCost,
    contractReward,
    renderQueuedOnly,
}: {
    asset: Asset
    queueCost: string
    contractReward: string
    renderQueuedOnly?: boolean
}) => {
    const { user } = usePassportServerAuth()
    const { state, subscribe } = usePassportServerWebsocket()
    const { state: gsState, send: sendGS, subscribe: gsSubscribe } = useGameServerWebsocket()
    const [isDeployModal, toggleIsDeployModal] = useToggle()

    const [mouseOver, setMouseOver] = useState<boolean>(false)
    const [removing, setRemoving] = useState<boolean>(false)

    const [assetData, setAssetData] = useState<Asset>(asset)
    const [queueStatus, setQueueStatus] = useState<AssetQueueStat>()

    const rarityDeets = getRarityDeets(assetData.tier)

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

    // Subscribe on asset queue position
    useEffect(() => {
        if (state !== WebSocket.OPEN || !gsSubscribe) return
        return gsSubscribe<AssetQueueStat>(
            GameServerKeys.SubAssetQueueStatus,
            (payload) => {
                if (!payload) return
                setQueueStatus(payload)
            },
            { asset_hash: asset.hash },
        )
    }, [state, gsSubscribe])

    const isGameServerUp = gsState == WebSocket.OPEN && !UNDER_MAINTENANCE
    const isRepairing = false // To be implemented on gameserver
    const isInBattle = queueStatus && queueStatus.queue_position && queueStatus.queue_position == -1
    const isInQueue = queueStatus && queueStatus.queue_position && queueStatus.queue_position >= 1

    if (
        !assetData ||
        !user ||
        (renderQueuedOnly && !isInQueue && !isInBattle) ||
        (!renderQueuedOnly && (isInQueue || isInBattle))
    )
        return null

    const { hash, name, label, image_url } = assetData.data.mech

    const StatusArea = () => {
        // If game server is down, don't show deploy button
        if (!isGameServerUp) {
            return (
                <Typography
                    sx={{
                        px: 1,
                        py: 0.34,
                        color: "grey",
                        lineHeight: 1,
                        border: `${"grey"} 1px solid`,
                        borderRadius: 0.3,
                        fontSize: ".75rem",
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
            //             sx={{
            //                 px: 1,
            //                 py: 0.34,
            //                 color: colors.neonBlue,
            //                 lineHeight: 1,
            //                 border: `${colors.neonBlue} 1px solid`,
            //                 borderRadius: 0.3,
            //                 fontSize: ".75rem",
            //             }}
            //         >
            //             REPAIRING
            //         </Typography>
            //         <Stack direction="row" alignItems="center" spacing={0.4} sx={{ pt: 0.3 }}>
            //             {isFastMode && <SvgFastRepair size="10px" fill={colors.neonBlue} />}
            //             <SvgCooldown size="12px" fill={colors.neonBlue} />
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

        if (isInBattle) {
            return (
                <>
                    <Typography
                        sx={{
                            px: 1,
                            py: 0.34,
                            color: colors.orange,
                            lineHeight: 1,
                            border: `${colors.orange} 1px solid`,
                            borderRadius: 0.3,
                            fontSize: ".75rem",
                        }}
                    >
                        IN BATTLE
                    </Typography>
                    {queueStatus.contract_reward && (
                        <Stack direction="row" alignItems="center" sx={{ pt: 0.3 }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="12px" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(queueStatus.contract_reward, 2)}
                            </Typography>
                        </Stack>
                    )}
                </>
            )
        }

        if (isInQueue) {
            return (
                <>
                    <Typography
                        onMouseOver={() => setMouseOver(true)}
                        onMouseLeave={() => setMouseOver(false)}
                        onClick={async () => {
                            if (removing) return
                            setRemoving(true)
                            try {
                                await sendGS(GameServerKeys.LeaveQueue, { asset_hash: asset.hash })
                            } finally {
                                setRemoving(false)
                            }
                        }}
                        sx={{
                            px: 1,
                            py: 0.34,
                            cursor: "pointer",
                            width: 82,
                            textAlign: "center",
                            color: mouseOver ? colors.red : colors.yellow,
                            lineHeight: 1,
                            border: `${mouseOver ? colors.red : colors.yellow} 1px solid`,
                            borderRadius: 0.3,
                            fontSize: ".75rem",
                        }}
                    >
                        {removing ? "LOADING" : mouseOver ? "LEAVE QUEUE" : "IN QUEUE"}
                    </Typography>
                    {queueStatus.contract_reward && (
                        <Stack direction="row" alignItems="center" sx={{ pt: 0.3 }}>
                            <Typography variant="caption">REWARD:&nbsp;</Typography>
                            <SvgSupToken size="12px" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography variant="caption" sx={{ color: colors.yellow }}>
                                {supFormatter(queueStatus.contract_reward, 2)}
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
                onClick={() => toggleIsDeployModal(true)}
                sx={{
                    minWidth: 0,
                    px: 1,
                    py: 0.4,
                    boxShadow: 0,
                    backgroundColor: colors.green,
                    borderRadius: 0.3,
                    ":hover": { backgroundColor: `${colors.green}90` },
                }}
            >
                <Typography
                    sx={{
                        fontSize: ".75rem",
                        lineHeight: 1,
                    }}
                >
                    DEPLOY
                </Typography>
            </Button>
        )
    }

    return (
        <Stack
            direction="row"
            spacing={1.8}
            sx={{
                position: "relative",
                px: 1.3,
                py: 1,
                backgroundColor: `${colors.navy}80`,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    flexShrink: 0,
                    px: 0.6,
                    py: 1,
                    boxShadow: "inset 0 0 8px 6px #00000055",
                    overflow: "hidden",
                    borderRadius: 0.5,
                }}
            >
                <Box
                    sx={{
                        width: 55,
                        height: 55,
                        flexShrink: 0,
                        overflow: "hidden",
                        backgroundImage: `url(${image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                    }}
                />

                {isGameServerUp && isInQueue && queueStatus && queueStatus.queue_position && (
                    <Box sx={{ position: "absolute", top: 0, left: 0 }}>
                        <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>
                            {queueStatus.queue_position}
                        </Typography>
                    </Box>
                )}

                <TooltipHelper text={`Rarity: ${rarityDeets.label}`} placement="right">
                    <Stack
                        direction="row"
                        spacing={0.1}
                        sx={{
                            position: "absolute",
                            bottom: -14,
                            left: 1,
                            height: 42,
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

            <Stack spacing={0.5}>
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

                <Stack alignItems="center" direction="row" spacing={1.2}>
                    <StatusArea />
                </Stack>
            </Stack>

            <Link
                href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                target="_blank"
                sx={{ position: "absolute", top: 6, right: 4 }}
            >
                <SvgExternalLink size="10px" sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }} />
            </Link>

            <DeployConfirmation
                open={isDeployModal}
                asset={asset}
                queueCost={queueCost}
                contractReward={contractReward}
                onClose={() => toggleIsDeployModal(false)}
            />
        </Stack>
    )
}
