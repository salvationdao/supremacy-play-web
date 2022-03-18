import { Box, Button, Link, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { DeployConfirmation, TooltipHelper } from ".."
import { SvgExternalLink, SvgSupToken } from "../../assets"
import { PASSPORT_WEB, UNDER_MAINTENANCE } from "../../constants"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { getRarityDeets, supFormatter } from "../../helpers"
import { useTimer, useToggle } from "../../hooks"
import { PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { Asset, AssetQueueStat } from "../../types/assets"
import { LeaveConfirmation } from "./LeaveConfirmation"

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
    assetQueueStatus,
    queueCost,
    contractReward,
}: {
    asset: Asset
    assetQueueStatus?: AssetQueueStat
    queueCost: string
    contractReward: string
}) => {
    const { user } = usePassportServerAuth()
    const { state, subscribe } = usePassportServerWebsocket()
    const { state: gsState } = useGameServerWebsocket()
    const [deployModalOpen, toggleDeployModalOpen] = useToggle()
    const [leaveModalOpen, toggleLeaveModalOpen] = useToggle()

    const [mouseOver, setMouseOver] = useState<boolean>(false)

    const [assetData, setAssetData] = useState<Asset>(asset)

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

    const isGameServerUp = gsState == WebSocket.OPEN && !UNDER_MAINTENANCE
    const isRepairing = false // To be implemented on gameserver
    const isInBattle = assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position === -1
    const isInQueue = assetQueueStatus && assetQueueStatus.queue_position && assetQueueStatus.queue_position >= 1

    if (!assetData || !user) return null

    const { hash, name, label, image_url } = assetData.data.mech

    const StatusArea = () => {
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
            //         <Stack direction="row" alignItems="center" spacing={".32rem"} sx={{ pt: '.24rem' }}>
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

        if (isInBattle) {
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

        if (isInQueue) {
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
                        <Typography variant="body2" lineHeight={1}>{mouseOver ? "LEAVE QUEUE" : "IN QUEUE"}</Typography>
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
    }

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
                        <Typography sx={{ fontFamily: "Nostromo Regular Black" }}>
                            {assetQueueStatus.queue_position}
                        </Typography>
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

            <Stack spacing=".4rem">
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
                    <StatusArea />
                </Stack>
            </Stack>

            <Link
                href={`${PASSPORT_WEB}profile/${user.username}/asset/${hash}`}
                target="_blank"
                sx={{ position: "absolute", top: ".6rem", right: ".4rem" }}
            >
                <SvgExternalLink size="1rem" sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }} />
            </Link>

            <DeployConfirmation
                open={deployModalOpen}
                asset={asset}
                queueCost={queueCost}
                contractReward={contractReward}
                onClose={() => toggleDeployModalOpen(false)}
            />
            <LeaveConfirmation open={leaveModalOpen} asset={asset} onClose={() => toggleLeaveModalOpen(false)} />
        </Stack>
    )
}
