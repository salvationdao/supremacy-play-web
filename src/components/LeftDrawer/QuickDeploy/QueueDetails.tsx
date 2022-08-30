import { IconButton, Stack, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { TooltipHelper } from "../.."
import { SvgNotification, SvgSupToken } from "../../../assets"
import { supFormatter, timeSinceInWords } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { PreferencesModal } from "../../Bar/ProfileCard/PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../../Bar/ProfileCard/PreferencesModal/TelegramRegisterModal"
import { QueueFeed } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"

interface QueueDetailsProps {
    queueFeed?: QueueFeed
    ownerQueueLength: number
}

export const QueueDetails = ({ queueFeed, ownerQueueLength }: QueueDetailsProps) => {
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
    const [addDeviceModalOpen, toggleAddDeviceModalOpen] = useToggle()
    const [telegramShortcode, setTelegramShortcode] = useState<string>("")

    const estimatedTimeOfBattle = useMemo(() => {
        if (typeof queueFeed?.minimum_wait_time_seconds === "undefined") return

        const actualWaitTime = queueFeed.minimum_wait_time_seconds + queueFeed.average_game_length_seconds * ownerQueueLength
        if (actualWaitTime < 60) {
            return "LESS THAN A MINUTE"
        }

        const t = new Date()
        t.setSeconds(t.getSeconds() + actualWaitTime)
        return timeSinceInWords(new Date(), t)
    }, [ownerQueueLength, queueFeed])
    const queueCost = queueFeed?.queue_cost || "0"

    return (
        <>
            <Stack spacing="1.5rem" direction="row">
                <AmountItem
                    key={`${queueFeed?.minimum_wait_time_seconds}-${queueFeed?.average_game_length_seconds}-queue_time`}
                    title={"WAIT TIME: "}
                    color={colors.offWhite}
                    value={estimatedTimeOfBattle || "UNKNOWN"}
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
    value: string | number
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
