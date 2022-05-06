import { Button, Stack, Typography } from "@mui/material"
import { AssetQueue } from "../../../.."
import { SvgCooldown, SvgSupToken } from "../../../../../assets"
import { supFormatter } from "../../../../../helpers"
import { useTimer } from "../../../../../hooks"
import { colors } from "../../../../../theme/theme"
import { RepairStatus } from "../../../../../types"

interface StatusAreaProps {
    isGridView?: boolean
    isGameServerUp: boolean
    isInQueue: boolean
    assetQueue: AssetQueue
    repairStatus?: RepairStatus
    openDeployModal: () => void
    openLeaveModal: () => void
    togglePreventAssetsRefresh: (value?: boolean | undefined) => void
}

export const StatusArea = ({
    isGridView,
    isGameServerUp,
    isInQueue,
    assetQueue,
    repairStatus,
    openDeployModal,
    openLeaveModal,
    togglePreventAssetsRefresh,
}: StatusAreaProps) => {
    if (!isGameServerUp) {
        return (
            <Typography
                variant="body2"
                sx={{
                    width: isGridView ? "unset" : "10rem",
                    alignSelf: isGridView ? "stretch" : "unset",
                    textAlign: "center",
                    px: ".8rem",
                    pt: ".3rem",
                    pb: ".2rem",
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

    if (assetQueue && assetQueue.in_battle) {
        return (
            <>
                <Typography
                    variant="body2"
                    sx={{
                        width: isGridView ? "unset" : "8.5rem",
                        alignSelf: isGridView ? "stretch" : "unset",
                        textAlign: "center",
                        px: ".8rem",
                        pt: ".3rem",
                        pb: ".2rem",
                        color: colors.orange,
                        lineHeight: 1,
                        border: `${colors.orange} 1px solid`,
                        borderRadius: 0.3,
                    }}
                >
                    IN BATTLE
                </Typography>
                {assetQueue.contract_reward && !isGridView && (
                    <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                        <Typography variant="caption">REWARD:&nbsp;</Typography>
                        <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                        <Typography variant="caption" sx={{ color: colors.yellow }}>
                            {supFormatter(assetQueue.contract_reward, 2)}
                        </Typography>
                    </Stack>
                )}
            </>
        )
    }

    if (isInQueue && assetQueue) {
        return (
            <>
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        openLeaveModal()
                        togglePreventAssetsRefresh(true)
                    }}
                    variant="contained"
                    size="small"
                    sx={{
                        position: "relative",
                        display: "inline",
                        padding: 0,
                        width: isGridView ? "unset" : "8.5rem",
                        alignSelf: isGridView ? "stretch" : "unset",
                        px: ".8rem",
                        pt: ".3rem",
                        pb: ".2rem",
                        cursor: "pointer",
                        textAlign: "center",
                        backgroundColor: "transparent",
                        color: colors.yellow,
                        lineHeight: 1,
                        border: `${colors.yellow} 1px solid`,
                        borderRadius: 0.3,
                        whiteSpace: "nowrap",
                        transition: "all 0s",
                        "& > p": {
                            "::after": {
                                content: '"IN QUEUE"',
                            },
                        },
                        ":hover": {
                            color: colors.red,
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            opacity: 1,
                            border: `${colors.red} 1px solid`,
                            "& > p": {
                                color: `${colors.red} !important`,
                                "::after": {
                                    content: '"LEAVE QUEUE"',
                                },
                            },
                        },
                    }}
                >
                    <Typography variant="body2" lineHeight={1} sx={{ color: colors.yellow }}></Typography>
                </Button>
                {assetQueue.position && !isGridView && (
                    <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                        <Typography variant="body2">POSITION:&nbsp;</Typography>
                        <Typography variant="body2" sx={{ color: colors.neonBlue }}>
                            {assetQueue.position}
                        </Typography>
                    </Stack>
                )}
                {assetQueue.contract_reward && !isGridView && (
                    <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }}>
                        <Typography variant="caption">REWARD:&nbsp;</Typography>
                        <SvgSupToken size="1.2rem" fill={colors.yellow} sx={{ pb: 0.4 }} />
                        <Typography variant="caption" sx={{ color: colors.yellow }}>
                            {supFormatter(assetQueue.contract_reward, 2)}
                        </Typography>
                    </Stack>
                )}
            </>
        )
    }

    // Asset is being repaired
    if (repairStatus) {
        const { remain_seconds } = repairStatus
        const repairEndTime = new Date(new Date().getTime() + remain_seconds * 1000)
        return (
            <>
                <Typography
                    variant="body2"
                    sx={{
                        width: isGridView ? "unset" : "8.5rem",
                        alignSelf: isGridView ? "stretch" : "unset",
                        textAlign: "center",
                        px: ".8rem",
                        pt: ".3rem",
                        pb: ".2rem",
                        color: colors.neonBlue,
                        lineHeight: 1,
                        border: `${colors.neonBlue} 1px solid`,
                        borderRadius: 0.3,
                    }}
                >
                    REPAIRING
                </Typography>
                {assetQueue.contract_reward && !isGridView && (
                    <Stack direction="row" alignItems="center" sx={{ pt: ".24rem" }} spacing=".3rem">
                        <SvgCooldown size="1.3rem" sx={{ pb: 0.4 }} />
                        <Typography variant="caption">
                            <RepairCountdown endTime={repairEndTime} />
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
            onClick={(e) => {
                e.stopPropagation()
                openDeployModal()
                togglePreventAssetsRefresh(true)
            }}
            sx={{
                position: "relative",
                width: isGridView ? "unset" : "8.5rem",
                alignSelf: isGridView ? "stretch" : "unset",
                px: ".8rem",
                pt: ".3rem",
                pb: ".2rem",
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

const RepairCountdown = ({ endTime }: { endTime: Date }) => {
    const { hours, minutes, seconds } = useTimer(endTime)

    if (!hours && !minutes && !seconds) return <>---</>

    return (
        <>
            {hours ? `${hours}h` : ""} {minutes ? `${minutes}m` : ""} {`${seconds}s`}
        </>
    )
}
