import { IconButton, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { TooltipHelper } from "../.."
import { SvgNotification, SvgSupToken } from "../../../assets"
import { supFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { colors } from "../../../theme/theme"
import { PreferencesModal } from "../../Bar/ProfileCard/PreferencesModal/PreferencesModal"
import { TelegramRegisterModal } from "../../Bar/ProfileCard/PreferencesModal/TelegramRegisterModal"
import { QueueFeed } from "../../Hangar/WarMachinesHangar/WarMachineDetails/Modals/DeployModal"

export const QueueDetails = ({ queueFeed }: { queueFeed?: QueueFeed }) => {
    const [preferencesModalOpen, togglePreferencesModalOpen] = useToggle()
    const [addDeviceModalOpen, toggleAddDeviceModalOpen] = useToggle()
    const [telegramShortcode, setTelegramShortcode] = useState<string>("")

    const queueLength = queueFeed?.queue_length || 0
    const queueCost = queueFeed?.queue_cost || "0"

    return (
        <>
            <Stack spacing="1.5rem" direction="row">
                {queueLength >= 0 && (
                    <AmountItem
                        key={`${queueLength}-queue_length`}
                        title={"NEXT POSITION: "}
                        color="#FFFFFF"
                        value={`${queueLength + 1}`}
                        tooltip="The queue position of your war machine if you deploy now."
                        disableIcon
                    />
                )}

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
