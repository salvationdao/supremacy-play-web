import { Box, Checkbox, CircularProgress, Stack, Switch, TextField, Typography } from "@mui/material"
import { Dispatch, useEffect, useState } from "react"
import { FancyButton } from "../../.."
import { SvgInfoCircular } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { colors, fonts } from "../../../../theme/theme"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { GameServerKeys } from "../../../../keys"

interface DevicePreferencesProps {
    toggleAddDeviceModal: () => void
}

//todo: comment here
export const DevicePreferences = ({ toggleAddDeviceModal }: DevicePreferencesProps) => {
    const theme = useTheme()
    const [loading, setLoading] = useToggle(false)
    const [error, setError] = useState<string>()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")

    // Get list of devices connected to the companion app
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<{ token: string; expired_at: Date }>(GameServerKeys.AuthGenOneTimeToken)
                if (!resp) return
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get connected devices."
                console.error(err)
            }
        })()
    }, [send])

    // Add device
    const addDevice = () => {
        //todo: Check if user has selected a faction

        // If user has a faction toggle the add device modal
        toggleAddDeviceModal()
    }

    return (
        <Stack spacing=".3rem" sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08" }}>
            <Stack direction="row" alignItems="center" spacing=".7rem">
                <Typography gutterBottom sx={{ color: colors.lightGrey }}>
                    DEVICES
                </Typography>

                {/*todo: add tooltip helper info*/}
                <TooltipHelper
                    placement="right-start"
                    text={
                        <Box>
                            <Typography sx={{ display: "inline" }}>ADD INFO HERE</Typography>
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

            {/*todo: add list of devices here*/}

            {error && (
                <Typography variant="body2" sx={{ color: colors.red, pt: "1rem" }}>
                    {error}
                </Typography>
            )}
            <Stack direction="row" spacing="1rem" sx={{ pt: "1rem" }}>
                <FancyButton
                    onClick={addDevice}
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: theme.factionTheme.background,
                        opacity: 1,
                        border: { borderColor: colors.green, borderThickness: "1.5px" },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1.5rem", py: 0, color: colors.green, minWidth: 0 }}
                    disabled={loading}
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
