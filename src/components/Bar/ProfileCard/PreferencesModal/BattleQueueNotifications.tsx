import { Stack, Switch, Typography } from "@mui/material"
import { Dispatch, useCallback, useEffect, useState } from "react"
import { PlayerPrefs } from "../../.."
import { WebSocketProperties } from "../../../../containers"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"

interface BattleQueueNotifcationsProps extends Partial<WebSocketProperties> {
    playerPrefs: PlayerPrefs
    setPlayerPrefs: Dispatch<React.SetStateAction<PlayerPrefs | undefined>>
}

export const BattleQueueNotifications = ({ playerPrefs, setPlayerPrefs, send }: BattleQueueNotifcationsProps) => {
    const [error, setError] = useState<string>()

    const toggleNotificationsBattleQueueSMS = useCallback(async () => {
        if (!send) return

        try {
            await send(GameServerKeys.TogglePlayerBattleQueueNotifications, {
                battle_queue_sms: !playerPrefs?.notifications_battle_queue_sms,
            })

            setPlayerPrefs((prev) => {
                if (!prev) return prev
                return { ...prev, notifications_battle_queue_sms: !prev.notifications_battle_queue_sms }
            })

            setError(undefined)
        } catch (e) {
            if (typeof e === "string") return setError(e)
            setError("Unable to update SMS preference, please try again.")
        }
    }, [send, playerPrefs, setPlayerPrefs])

    const toggleNotificationsBattleQueueBrowser = useCallback(async () => {
        if (!send) return

        try {
            if (!("Notification" in window)) {
                throw "This browser does not support notifications."
            }
            if (!playerPrefs.notifications_battle_queue_browser) {
                const permission = await Notification.requestPermission()
                if (permission === "denied") {
                    throw "Notification permissions denied, please enable them in your browser."
                }
            }
            await send(GameServerKeys.TogglePlayerBattleQueueNotifications, {
                battle_queue_browser: !playerPrefs?.notifications_battle_queue_browser,
            })

            setPlayerPrefs((prev) => {
                if (!prev) return prev
                return { ...prev, notifications_battle_queue_browser: !prev.notifications_battle_queue_browser }
            })

            setError(undefined)
        } catch (e) {
            if (typeof e === "string") return setError(e)
            setError("Unable to update browser preference, please try again or contact support.")
        }
    }, [send, playerPrefs, setPlayerPrefs])

    useEffect(() => {
        //if the user has their browser settings to true, checking that the browser has notification permissions (sometimes, user can set time limit), if not, requests it again
        ;(async () => {
            try {
                if (playerPrefs.notifications_battle_queue_browser) {
                    if (!("Notification" in window)) {
                        throw "This browser does not support notifications."
                    }

                    await Notification.requestPermission()
                }
            } catch (e) {
                if (typeof e === "string") return setError(e)
                setError("This browser does not support notifications.")
            }
        })()
    }, [playerPrefs])

    return (
        <Stack sx={{ px: "1.2rem", py: ".6rem", backgroundColor: "#FFFFFF05", borderRadius: 1 }}>
            <PreferenceToggle
                title="Enable Battle Queue SMS Notifications:"
                checked={!!playerPrefs?.notifications_battle_queue_sms}
                onChangeFunction={toggleNotificationsBattleQueueSMS}
            />
            <PreferenceToggle
                title="Enable Battle Queue Browser Notifications:"
                checked={!!playerPrefs?.notifications_battle_queue_browser}
                onChangeFunction={toggleNotificationsBattleQueueBrowser}
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
