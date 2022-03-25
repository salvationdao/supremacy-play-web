import { Stack, Switch, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { PlayerPrefs } from "../../.."
import { useSnackbar, WebSocketProperties } from "../../../../containers"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"

interface BattleQueueNotifcationsProps extends Partial<WebSocketProperties> {
    playerPrefs: PlayerPrefs
}

export const BattleQueueNotifications = ({ playerPrefs, send }: BattleQueueNotifcationsProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const [error, setError] = useState<string>()

    const toggleNotificationsBattleQueueSMS = useCallback(async () => {
        if (!send) return

        try {
            await send(GameServerKeys.TogglePlayerBattleQueueNotifications, {
                battle_queue_sms: !playerPrefs?.notifications_battle_queue_sms,
                battle_queue_browser: playerPrefs?.notifications_battle_queue_browser,
            })

            setError(undefined)
            newSnackbarMessage("Saved notification preference.", "success")
        } catch (e) {
            setError(
                typeof e === "string" ? e : "Unable to update SMS preference, please try again or contact support.",
            )
        }
    }, [send, playerPrefs])

    const toggleNotificationsBattleQueueBrowser = useCallback(async () => {
        if (!send) return

        try {
            if (!("Notification" in window)) {
                throw "This browser does not support notifications."
            }

            // If user updates to enabled, then check permissions again
            if (!playerPrefs.notifications_battle_queue_browser) {
                const permission = await Notification.requestPermission()
                if (permission === "denied") {
                    throw "Notification permissions denied, please enable them in your browser."
                }
            }

            await send(GameServerKeys.TogglePlayerBattleQueueNotifications, {
                battle_queue_browser: !playerPrefs?.notifications_battle_queue_browser,
                battle_queue_sms: playerPrefs?.notifications_battle_queue_sms,
            })

            setError(undefined)
            newSnackbarMessage("Saved notification preference.", "success")
        } catch (e) {
            setError(
                typeof e === "string" ? e : "Unable to update browser preference, please try again or contact support.",
            )
        }
    }, [send, playerPrefs])

    return (
        <Stack sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08", borderRadius: 1 }}>
            <Typography gutterBottom sx={{ opacity: 0.8 }}>
                NOTIFICATIONS
            </Typography>

            <PreferenceToggle
                title="Enable battle queue browser notifications:"
                checked={!!playerPrefs?.notifications_battle_queue_browser}
                onChangeFunction={toggleNotificationsBattleQueueBrowser}
            />

            <PreferenceToggle
                title="Enable battle queue SMS notifications:"
                checked={!!playerPrefs?.notifications_battle_queue_sms}
                onChangeFunction={toggleNotificationsBattleQueueSMS}
            />

            {error && (
                <Typography variant="body2" sx={{ color: colors.red }}>
                    {error}
                </Typography>
            )}
        </Stack>
    )
}

interface PreferenceToggleProps {
    title: string
    checked: boolean
    onChangeFunction: () => Promise<void>
}

const PreferenceToggle = ({ title, checked, onChangeFunction }: PreferenceToggleProps) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>{title}</Typography>
            <Switch
                size="small"
                checked={checked}
                onChange={onChangeFunction}
                sx={{
                    transform: "scale(.7)",
                    ".Mui-checked": { color: colors.neonBlue },
                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50` },
                }}
            />
        </Stack>
    )
}
