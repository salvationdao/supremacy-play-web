import { Box, Button, Link, Stack, Typography } from "@mui/material"
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { DeployConfirmation } from ".."
import { SvgCooldown, SvgExternalLink, SvgFastRepair, SvgSupToken } from "../../assets"
import { useAuth, useWebsocket } from "../../containers"
import { supFormatter } from "../../helpers"
import { useToggle } from "../../hooks"
import { useInterval } from "../../hooks/useInterval"
import HubKey from "../../keys"
import { colors } from "../../theme"
import { Asset, AssetDurability, AssetQueueStat } from "../../types/assets"
import keys from "../../keys"

const RepairCountdown = ({ endTime }: { endTime: Date }) => {
    const [, setTimeRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        if (endTime) {
            setDelay(1000)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTimeRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [])

    useInterval(() => {
        setTimeRemain((t) => Math.max(t - 1, 0))
        const d = moment.duration(moment(endTime).diff(moment()))
        const hours = Math.floor(d.asHours())
        const minutes = Math.floor(d.asMinutes()) - hours * 60
        const seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - minutes * 60
        setHours(Math.max(hours, 0))
        setMinutes(Math.max(minutes, 0))
        setSeconds(Math.max(seconds, 0))
    }, delay)

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
    const { state, subscribe, send } = useWebsocket()
    const [isDeployModal, toggleIsDeployModal] = useToggle()

    const [assetData, setAssetData] = useState<Asset>(asset)
    const [queuePosition, setQueuePosition] = useState<AssetQueueStat>()
    const [durability, setDurability] = useState<AssetDurability>()

    const [mouseOver, setMouseOver] = useState<boolean>(false)
    const [removing, setRemoving] = useState<boolean>(false)

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
                            <SvgSupToken size="12px" fill={colors.yellow} />
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
                        onMouseOver={() => setMouseOver(true)}
                        onMouseLeave={() => setMouseOver(false)}
                        onClick={async () => {
                            if (removing) return
                            setRemoving(true)
                            try {
                                await send(keys.LeaveQueue, asset.hash)
                            } catch(err) {
                                setRemoving(false)
                            }
                            setRemoving(false)
                        }}
                        sx={{
                            px: 1,
                            py: 1,
                            cursor: "pointer",
                            width: "90px",
                            textAlign: "center",
                            color: mouseOver ? colors.red : colors.yellow,
                            lineHeight: 1,
                            border: `${mouseOver ? colors.red : colors.yellow} 1px solid`,
                            borderRadius: 0.3,
                            fontSize: ".75rem",
                            fontFamily: "Share Tech",
                        }}
                    >
                        {removing ? "LOADING" : (mouseOver ? "LEAVE QUEUE" : "IN QUEUE")}
                    </Typography>
                    {contractReward2 && (
                        <Stack direction="row" alignItems="center" sx={{ pt: 0.3 }}>
                            <Typography variant="caption" sx={{ fontFamily: "Share Tech" }}>
                                <Box sx={{ fontSize: "0.9rem" }}>REWARD:&nbsp;</Box>
                            </Typography>
                            <SvgSupToken size="15px" fill={colors.yellow} />
                            <Typography variant="caption" sx={{ fontFamily: "Share Tech", color: colors.yellow }}>
                                <Box sx={{ fontSize: "0.9rem" }}>{supFormatter(contractReward2)}</Box>
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
                // backgroundColor: index % 2 === 0 ? colors.navy : undefined,
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
                {isInQueue && queuePosition && queuePosition.position && (
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
