import { Box, Button, Link, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import { DeployConfirmation } from ".."
import { SvgExternalLink, SvgFastRepair } from "../../assets"
import { useAuth, useWebsocket } from "../../containers"
import { useToggle } from "../../hooks"
import HubKey from "../../keys"
import { colors } from "../../theme"
import { Asset, AssetDurability, AssetQueueStat } from "../../types/assets"

const ActionButton = ({
    text,
    isOutlined,
    color,
    onClick,
}: {
    text: string
    color: string
    isOutlined?: boolean
    onClick: () => void
}) => {
    return (
        <Button
            variant="contained"
            size="small"
            onClick={onClick}
            sx={{
                minWidth: 0,
                px: 1,
                py: 0.4,
                boxShadow: 0,
                backgroundColor: isOutlined ? "transparent" : color,
                border: isOutlined ? `${color} 1px solid` : "unset",
                borderRadius: 0.3,
                ":hover": { backgroundColor: `${color}90` },
            }}
        >
            <Typography
                sx={{
                    fontSize: ".75rem",
                    fontFamily: "Share Tech",
                    lineHeight: 1,
                    color: isOutlined ? color : colors.text,
                }}
            >
                {text}
            </Typography>
        </Button>
    )
}

export const AssetItem = ({
    index,
    passportWeb,
    asset,
    queueCost,
    contractReward,
    renderQueuedOnly,
}: {
    index: number
    passportWeb: string
    asset: Asset
    queueCost?: string
    contractReward?: string
    renderQueuedOnly?: boolean
}) => {
    const { user } = useAuth()
    const { state, subscribe } = useWebsocket()
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
    }, [state, subscribe, asset])

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
    }, [state, subscribe, asset])

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
    }, [state, subscribe, asset])

    const isRepairing = !!durability?.repairType
    const isInBattle = queuePosition && queuePosition.position && queuePosition.position < 0
    const isInQueue = queuePosition && queuePosition.position && queuePosition.position >= 0
    const contractReward2 =
        queuePosition && queuePosition.contractReward ? queuePosition.contractReward : contractReward

    if (!assetData || !user || (renderQueuedOnly && !isInQueue) || (!renderQueuedOnly && isInQueue)) return null

    const { hash, name, image } = assetData

    const StatusArea = () => {
        if (isRepairing) {
            const { startedAt, expectCompletedAt } = durability

            return (
                <Stack>
                    <Typography
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
                        REPAIRING
                    </Typography>

                    <div>show bar</div>
                </Stack>
            )
        }

        if (isInBattle) {
            return (
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
            )
        }

        if (isInQueue) {
            return (
                <Typography
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
            )
        }

        return <ActionButton text="DEPLOY" onClick={() => toggleIsDeployModal(true)} color={colors.green} />
    }

    return (
        <Stack
            direction="row"
            spacing={1.5}
            sx={{
                position: "relative",
                px: 2,
                py: 1.8,
                backgroundColor: index % 2 === 0 ? colors.navy : undefined,
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
                {isInQueue && queuePosition && queuePosition.position && (
                    <Box sx={{ position: "absolute" }}>{queuePosition.position + 1}</Box>
                )}
            </Box>

            <Stack spacing={0.5}>
                <Typography
                    variant="caption"
                    sx={{ color: "#FFFFFF", fontWeight: "fontWeightBold", wordBreak: "break-word" }}
                >
                    {name}
                </Typography>

                <Stack direction="row" spacing={0.8}>
                    <StatusArea />
                </Stack>
            </Stack>

            <Link
                href={`${passportWeb}/profile/${user.username}/asset/${hash}`}
                target="_blank"
                sx={{ position: "absolute", top: 6, right: 4 }}
            >
                <SvgExternalLink fill="#FFFFFF" size="10px" sx={{ opacity: 0.2, ":hover": { opacity: 0.6 } }} />
            </Link>

            <DeployConfirmation
                open={isDeployModal}
                asset={asset}
                queueCost={queueCost}
                contractReward={contractReward2}
                onClose={() => toggleIsDeployModal(false)}
            />
        </Stack>
    )
}
