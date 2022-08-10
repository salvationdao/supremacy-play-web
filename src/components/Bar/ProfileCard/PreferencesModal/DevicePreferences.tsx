import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { FancyButton } from "../../.."
import { SvgInfoCircular } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { colors, fonts } from "../../../../theme/theme"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { GameServerKeys } from "../../../../keys"

interface DevicePreferencesProps {
    toggleAddDeviceModal: () => void
}

interface Device {
    name: string
}

// DevicePreferences manages devices connected to the supremacy companion app
export const DevicePreferences = ({ toggleAddDeviceModal }: DevicePreferencesProps) => {
    const theme = useTheme()
    const [error, setError] = useState<string>()
    const { send } = useGameServerCommandsUser("/user_commander")

    // Get list of devices connected to the companion app
    const [devices, setDevices] = useState<Device[]>([])
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<Device[]>(GameServerKeys.GetPlayerDeviceList)
                if (!resp) return
                setDevices(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get connected devices."
                setError(message)
            }
        })()
    }, [send, toggleAddDeviceModal])

    return (
        <Stack spacing=".3rem" sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08" }}>
            <Stack direction="row" alignItems="center" spacing=".7rem">
                {/* Title */}
                <Typography gutterBottom sx={{ color: colors.lightGrey }}>
                    CONNECTED DEVICES
                </Typography>

                {/* Connected devices' helper information */}
                <TooltipHelper
                    placement="right-start"
                    text={
                        <Box>
                            <Typography sx={{ display: "inline" }}>Devices that are connected to the Supremacy companion app.</Typography>
                        </Box>
                    }
                >
                    <Box>
                        <SvgInfoCircular
                            size="1.3rem"
                            sx={{
                                pb: "1rem",
                                opacity: 0.4,
                                ":hover": { opacity: 1 },
                            }}
                        />
                    </Box>
                </TooltipHelper>
            </Stack>

            {/* List of  connected devices */}
            {devices && devices.length > 0 && (
                <Stack>
                    {devices.map((device) => {
                        return (
                            <Typography key={device.name} sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                {device.name}
                            </Typography>
                        )
                    })}
                </Stack>
            )}

            {error && (
                <Typography variant="body2" sx={{ color: colors.red, pt: "1rem" }}>
                    {error}
                </Typography>
            )}

            {/* Add new device to companion app */}
            <Stack direction="row" spacing="1rem" sx={{ pt: "1rem" }}>
                <FancyButton
                    onClick={toggleAddDeviceModal}
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: theme.factionTheme.background,
                        opacity: 1,
                        border: { borderColor: colors.green, borderThickness: "1.5px" },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1.5rem", py: 0, color: colors.green, minWidth: 0 }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: colors.green,
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        ADD DEVICE
                    </Typography>
                </FancyButton>
            </Stack>
        </Stack>
    )
}
