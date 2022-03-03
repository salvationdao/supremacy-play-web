import { Box, Button, Link, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { DeployConfirmation } from ".."
import { SvgCooldown, SvgExternalLink, SvgFastRepair, SvgSupToken } from "../../assets"
import { useAuth, useWebsocket } from "../../containers"
import { useWebsocket as useGSWebsocket } from "../../../../containers"
import { supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import HubKey from "../../keys"
import { colors } from "../../theme"
import { Asset, AssetDurability, AssetQueueStat } from "../../types/assets"
import { UNDER_MAINTENANCE } from "../../../../constants"
import { useTimer } from "../../../../hooks"

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
    passportWeb,
    asset,
    queueCost,
    queueLength,
    contractReward,
    renderQueuedOnly,
}: {
    passportWeb: string
    asset: Asset
    queueCost: string
    queueLength: number
    contractReward?: string
    renderQueuedOnly?: boolean
}) => {
    const { user } = useAuth()
    const { state, subscribe } = useWebsocket()
    const { send } = useGSWebsocket()
    const { state: gsState } = useGSWebsocket()
    const [isDeployModal, toggleIsDeployModal] = useToggle()

    const [assetData, setAssetData] = useState<Asset>(asset)
    const [queuePosition, setQueuePosition] = useState<AssetQueueStat>()
    const [durability, setDurability] = useState<AssetDurability>()

    // Subscribe on asset data
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !asset) return
        return subscribe<Asset>(
            HubKey.SubAssetData,
            (payload) => {
                if (!payload) return
                setAssetData(payload)
            },
            { assetHash: asset.hash },
        )
    }, [state, subscribe])

    // Subscribe on asset durability
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !asset) return
        return subscribe<AssetDurability>(
            HubKey.SubAssetDurability,
            (payload) => {
                if (!payload) return
                setDurability(payload)
            },
            { assetHash: asset.hash },
        )
    }, [state, subscribe])

    // Subscribe on asset queue position
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !asset) return
        return subscribe<AssetQueueStat>(
            HubKey.SubAssetQueuePosition,
            (payload) => {
                if (!payload) return
                setQueuePosition(payload)
            },
            { assetHash: asset.hash },
        )
    }, [state, subscribe])

    const isGameServerUp = gsState == WebSocket.OPEN && !UNDER_MAINTENANCE
    const isRepairing = !!durability?.repairType
    const isInBattle = queuePosition && queuePosition.position && queuePosition.position == -1
    const isInQueue = queuePosition && queuePosition.position && queuePosition.position >= 1
    const contractReward2 = useMemo(
        () => (queuePosition && queuePosition.contractReward ? queuePosition.contractReward : contractReward),
        [queuePosition, contractReward],
    )

    if (
        !assetData ||
        !user ||
        (renderQueuedOnly && !isInQueue && !isInBattle) ||
        (!renderQueuedOnly && (isInQueue || isInBattle))
    )
        return null

    const { hash, name, image } = assetData

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
                        fontFamily: "Share Tech",
                        opacity: 0.6,
                    }}
                >
                    GAME OFFLINE
                </Typography>
            )
        }

        if (isRepairing) {
            const { startedAt, expectCompletedAt } = durability
            const isFastMode = durability.repairType == "FAST"

            return (
                <>
                    <Typography
                        sx={{
                            px: 1,
                            py: 0.34,
                            color: colors.neonBlue,
                            lineHeight: 1,
                            border: `${colors.neonBlue} 1px solid`,
                            borderRadius: 0.3,
                            fontSize: ".75rem",
                            fontFamily: "Share Tech",
                        }}
                    >
                        REPAIRING
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.4} sx={{ pt: 0.3 }}>
                        {isFastMode && <SvgFastRepair size="10px" fill={colors.neonBlue} />}
                        <SvgCooldown size="12px" fill={colors.neonBlue} />
                        <Typography
                            variant="caption"
                            sx={{ lineHeight: 1, fontFamily: "Share Tech", color: colors.neonBlue }}
                        >
                            <RepairCountdown endTime={expectCompletedAt} />
                        </Typography>
                    </Stack>
                </>
            )
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
                            fontFamily: "Share Tech",
                        }}
                    >
                        IN BATTLE
                    </Typography>
                    {contractReward2 && (
                        <Stack direction="row" alignItems="center" sx={{ pt: 0.3 }}>
                            <Typography variant="caption" sx={{ fontFamily: "Share Tech" }}>
                                REWARD:&nbsp;
                            </Typography>
                            <SvgSupToken size="12px" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: "Share Tech", ml: 0.1, color: colors.yellow }}
                            >
                                {supFormatter(contractReward2)}
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
                        // Leave queue
                        onClick={async () => {
                            try {
                                console.log("leaving")
                                await send(HubKey.LeaveQueue, asset.hash)
                            } catch (e) {
                                console.log(e)
                            }
                        }}
                        sx={{
                            px: 1,
                            py: 0.34,
                            color: colors.yellow,
                            lineHeight: 1,
                            border: `${colors.yellow} 1px solid`,
                            borderRadius: 0.3,
                            fontSize: ".75rem",
                            fontFamily: "Share Tech",
                        }}
                    >
                        IN QUEUE
                    </Typography>
                    {contractReward2 && (
                        <Stack direction="row" alignItems="center" sx={{ pt: 0.3 }}>
                            <Typography variant="caption" sx={{ fontFamily: "Share Tech" }}>
                                REWARD:&nbsp;
                            </Typography>
                            <SvgSupToken size="12px" fill={colors.yellow} sx={{ pb: 0.4 }} />
                            <Typography
                                variant="caption"
                                sx={{ fontFamily: "Share Tech", ml: 0.1, color: colors.yellow }}
                            >
                                {supFormatter(contractReward2)}
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
                        fontFamily: "Share Tech",
                        lineHeight: 1,
                        color: colors.text,
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
            spacing={1.5}
            sx={{
                position: "relative",
                px: 2,
                py: 1.8,
                backgroundColor: `${colors.navy}80`,
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: 55,
                    height: 55,
                    flexShrink: 0,
                    overflow: "hidden",
                    backgroundImage: `url(${image})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }}
            >
                {isGameServerUp && isInQueue && queuePosition && queuePosition.position && (
                    <Box sx={{ position: "absolute" }}>{queuePosition.position}</Box>
                )}
            </Box>

            <Stack spacing={0.5}>
                <Typography
                    variant="caption"
                    sx={{ color: "#FFFFFF", fontWeight: "fontWeightBold", wordBreak: "break-word" }}
                >
                    {name}
                </Typography>

                <Stack alignItems="center" direction="row" spacing={1.2}>
                    <StatusArea />
                </Stack>
            </Stack>

            <Link
                href={`${passportWeb}profile/${user.username}/asset/${hash}`}
                target="_blank"
                sx={{ position: "absolute", top: 6, right: 4 }}
            >
                <SvgExternalLink fill="#FFFFFF" size="10px" sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }} />
            </Link>

            <DeployConfirmation
                open={isDeployModal}
                asset={asset}
                queueCost={queueCost}
                queueLength={queueLength}
                contractReward={contractReward2}
                onClose={() => toggleIsDeployModal(false)}
            />
        </Stack>
    )
}
