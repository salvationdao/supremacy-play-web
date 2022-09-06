import { Box, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { TooltipHelper } from "../.."
import { SvgNotification, SvgSupToken } from "../../../assets"
import { supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { PreferencesModal } from "../../Bar/ProfileCard/PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../../Bar/ProfileCard/PreferencesModal/TelegramRegisterModal"
import { QueueFeed } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"
import { PlayerQueueStatus } from "./QuickDeploy"

interface QueueDetailsProps {
    queueFeed?: QueueFeed
    playerQueueStatus?: PlayerQueueStatus
}

export const QueueDetails = ({ queueFeed, playerQueueStatus }: QueueDetailsProps) => {
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
    const [addDeviceModalOpen, toggleAddDeviceModalOpen] = useToggle()
    const [telegramShortcode, setTelegramShortcode] = useState<string>("")

    const queueCost = queueFeed?.queue_cost || "0"

    return (
        <>
            <Stack spacing="1.5rem" direction="row" width="100%">
                <AmountItem
                    key={`${queueFeed?.minimum_wait_time_seconds}-${queueFeed?.average_game_length_seconds}-queue_time`}
                    title={"WAIT TIME: "}
                    color={colors.offWhite}
                    value={queueFeed ? <QueueETA queueETASeconds={queueFeed.minimum_wait_time_seconds} /> : undefined}
                    tooltip="The minimum time it will take before your mech is placed into battle."
                    disableIcon
                />

                {queueCost && (
                    <AmountItem
                        title={"FEE: "}
                        color={colors.yellow}
                        value={supFormatter(queueCost, 2)}
                        tooltip="The cost to place your war machine into the battle queue."
                    />
                )}

                {playerQueueStatus && (
                    <AmountItem
                        title="LIMIT: "
                        color={playerQueueStatus.total_queued / playerQueueStatus.queue_limit === 1 ? colors.red : "white"}
                        value={`${playerQueueStatus.total_queued} / ${playerQueueStatus.queue_limit}`}
                        tooltip="The total amount of mechs you have queued."
                        disableIcon
                    />
                )}

                <IconButton size="small" onClick={() => togglePreferencesModalOpen(true)}>
                    <SvgNotification size="1.3rem" />
                </IconButton>
            </Stack>

            {/* preferences modal */}
            {preferencesModalOpen && (
                <PreferencesModal
                    onClose={() => togglePreferencesModalOpen(false)}
                    setTelegramShortcode={setTelegramShortcode}
                    toggleAddDeviceModal={() => toggleAddDeviceModalOpen(!addDeviceModalOpen)}
                />
            )}

            {/* telegram register modal */}
            {!!telegramShortcode && <TelegramRegisterModal code={telegramShortcode} onClose={() => setTelegramShortcode("")} />}
        </>
    )
}

const AmountItem = ({
    title,
    color,
    value,
    tooltip,
    disableIcon,
}: {
    title: string
    color: string
    value?: React.ReactNode
    tooltip: string
    disableIcon?: boolean
}) => {
    return (
        <TooltipHelper placement="bottom-start" text={tooltip}>
            <Stack direction="row" alignItems="center">
                <Typography sx={{ mr: ".4rem", fontWeight: "fontWeightBold" }}>{title}</Typography>

                {!disableIcon && <SvgSupToken size="1.7rem" fill={color} sx={{ mr: ".1rem", pb: ".2rem" }} />}

                <Typography sx={{ color: color, fontWeight: "fontWeightBold" }}>{value || "---"}</Typography>
            </Stack>
        </TooltipHelper>
    )
}

interface QueueETAProps {
    queueETASeconds: number
}

const QueueETA = ({ queueETASeconds }: QueueETAProps) => {
    const countdownRef = useRef<HTMLDivElement>()
    const secondsLeftRef = useRef(queueETASeconds)

    useEffect(() => {
        const t = setInterval(() => {
            if (!countdownRef.current) return
            secondsLeftRef.current -= 10
            countdownRef.current.innerText =
                secondsLeftRef.current < 60
                    ? "< 1 MINUTE"
                    : `${Math.round(secondsLeftRef.current / 60)} MINUTE${Math.round(secondsLeftRef.current / 60) > 1 ? "S" : ""}`
        }, 1000 * 10) // Every 10 seconds

        return () => clearInterval(t)
    }, [queueETASeconds])

    return (
        <Box ref={countdownRef}>
            {queueETASeconds < 60 ? "< 1 MINUTE" : `${Math.round(queueETASeconds / 60)} MINUTE${Math.round(queueETASeconds / 60) > 1 ? "S" : ""}`}
        </Box>
    )
}
