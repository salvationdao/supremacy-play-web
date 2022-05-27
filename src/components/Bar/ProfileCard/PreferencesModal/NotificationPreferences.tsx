import { Box, Checkbox, CircularProgress, Stack, Switch, TextField, Typography } from "@mui/material"
import { Dispatch, useEffect, useState } from "react"
import { FancyButton } from "../../.."
import { SvgInfoCircular, SvgSupToken } from "../../../../assets"
import { useSnackbar } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { TooltipHelper } from "../../../Common/TooltipHelper"

interface PreferencesResponse {
    shortcode: string
    telegram_id: string
}

interface NotificationPreferences {
    enable_telegram_notifications: boolean
    enable_sms_notifications: boolean
    enable_push_notifications: boolean
    mobile_number: string
}

interface NotificationPreferencesProps {
    setTelegramShortcode: (code: string) => void
}

export const NotificationPreferences = (props: NotificationPreferencesProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>()

    // Get player preferences
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<NotificationPreferences>(GameServerKeys.GetNotificationPreferences)
                if (!resp) return
                setNotificationPreferences(resp)
            } catch (err) {
                newSnackbarMessage(typeof err === "string" ? err : "Failed to get player preferences.", "error")
                console.error(err)
            }
        })()
    }, [send, newSnackbarMessage])

    if (!notificationPreferences) {
        return (
            <Stack direction="row" alignItems="center" spacing=".6rem">
                <CircularProgress size="1.3rem" sx={{ color: "#FFFFFF" }} />
                <Typography sx={{ color: colors.lightGrey }}>LOADING...</Typography>
            </Stack>
        )
    }

    return <NotificationPreferencesInner notificationPreferences={notificationPreferences} setNotificationPreferences={setNotificationPreferences} {...props} />
}

interface InnerProps extends NotificationPreferencesProps {
    notificationPreferences: NotificationPreferences
    setNotificationPreferences: Dispatch<React.SetStateAction<NotificationPreferences | undefined>>
}

export const NotificationPreferencesInner = ({ notificationPreferences, setNotificationPreferences, setTelegramShortcode }: InnerProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [loading, setLoading] = useToggle(false)
    const [error, setError] = useState<string>()

    const [newNotificationPreferences, setNewNotificationPreferences] = useState<NotificationPreferences>(notificationPreferences)
    const [agreeToBeCharged, setAgreeToBeCharged] = useState<boolean>(false)

    const settingsChanged =
        notificationPreferences.enable_telegram_notifications != newNotificationPreferences.enable_telegram_notifications ||
        notificationPreferences.enable_sms_notifications != newNotificationPreferences.enable_sms_notifications

    const hadNotificationsTurnedOff = !notificationPreferences.enable_telegram_notifications && !notificationPreferences.enable_sms_notifications
    const hasAnyNotifications = newNotificationPreferences.enable_telegram_notifications || newNotificationPreferences.enable_sms_notifications

    const updateNotificationPreferences = async () => {
        if (!newNotificationPreferences) return

        if (newNotificationPreferences.enable_sms_notifications && !newNotificationPreferences.mobile_number) {
            setError("Please enter mobile number to enable sms notifications.")
            return
        }

        if (settingsChanged && hadNotificationsTurnedOff && hasAnyNotifications && !agreeToBeCharged) {
            setError("Please agree to 'You have read and agreed to be charge 5 sups per notification'.")
            return
        }

        try {
            setLoading(true)
            const resp = await send<PreferencesResponse, NotificationPreferences>(GameServerKeys.UpdateNotificationPreferences, newNotificationPreferences)
            if (!resp) {
                setError("Failed update preferences, please try again or contact support.")
                return
            }

            if (resp.shortcode && !resp.telegram_id) {
                setTelegramShortcode(resp.shortcode)
            }

            setNotificationPreferences(newNotificationPreferences)
            newSnackbarMessage("Saved notification preferences.", "success")
            setError(undefined)
        } catch (e) {
            setError(typeof e === "string" ? e : "Failed update preferences, please try again or contact support.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Stack spacing=".3rem" sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08" }}>
            <Stack direction="row" alignItems="center" spacing=".4rem">
                <Typography gutterBottom sx={{ color: colors.lightGrey }}>
                    NOTIFICATIONS
                </Typography>

                <TooltipHelper
                    placement="right-start"
                    text={
                        <Box>
                            <Typography sx={{ display: "inline" }}>
                                You will be notified via your chosen notification preference(s) when your war machine is within the top 10 position in the
                                battle queue. You will be charged when the notification has been delivered to you.
                            </Typography>
                            <SvgSupToken sx={{ display: "inline" }} size="1.4rem" fill={colors.yellow} />
                            <Typography sx={{ display: "inline" }}>5</Typography>
                        </Box>
                    }
                >
                    <Box>
                        <SvgInfoCircular
                            size="1.2rem"
                            sx={{
                                pb: ".7rem",
                                opacity: 0.4,
                                ":hover": { opacity: 1 },
                            }}
                        />
                    </Box>
                </TooltipHelper>
            </Stack>

            <Stack>
                <PreferenceToggle
                    disabled={loading}
                    title="Enable battle queue SMS notifications:"
                    checked={!!newNotificationPreferences?.enable_sms_notifications}
                    onChangeFunction={(e) =>
                        setNewNotificationPreferences({ ...newNotificationPreferences, enable_sms_notifications: e.currentTarget.checked })
                    }
                />

                {newNotificationPreferences?.enable_sms_notifications && (
                    <Stack direction="row" alignItems="center" sx={{ mt: ".2rem", mb: ".4rem", ml: "1.5rem", pl: "1rem", borderLeft: "#FFFFFF50 1px solid" }}>
                        <Typography>Phone number: </Typography>
                        <TextField
                            disabled={loading}
                            sx={{
                                flexGrow: "2",
                                pl: "1rem",
                                input: { px: ".8rem", py: "2px" },
                            }}
                            value={newNotificationPreferences?.mobile_number}
                            onChange={(e) => {
                                setNewNotificationPreferences({ ...newNotificationPreferences, mobile_number: e.currentTarget.value })
                            }}
                        />
                    </Stack>
                )}
            </Stack>

            <Stack>
                <PreferenceToggle
                    disabled={loading}
                    title="Enable battle queue Telegram notifications:"
                    checked={!!newNotificationPreferences?.enable_telegram_notifications}
                    onChangeFunction={(e) =>
                        setNewNotificationPreferences({ ...newNotificationPreferences, enable_telegram_notifications: e.currentTarget.checked })
                    }
                />

                {settingsChanged && hadNotificationsTurnedOff && hasAnyNotifications && (
                    <Stack spacing=".4rem" sx={{ mt: ".3rem", px: "1.7rem", py: ".8rem", backgroundColor: `${colors.orange}20` }}>
                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ fontWeight: "fontWeightBold" }}>NOTIFICATION FEE:&nbsp;</Typography>
                            <SvgSupToken size="1.4rem" fill={colors.yellow} />
                            <Typography>5</Typography>
                        </Stack>

                        <Box>
                            <Typography>
                                You will be notified via your chosen notification preference(s) when your war machine is within the top 10 position in the
                                battle queue. You will be charged when the notification has been delivered to you.
                            </Typography>
                        </Box>

                        <Stack direction="row" alignItems="center">
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold", span: { color: colors.yellow } }}>
                                You have read and agreed to be charge <span>5</span> sups per notification:
                            </Typography>
                            <Checkbox
                                disabled={loading}
                                size="small"
                                checked={agreeToBeCharged}
                                onChange={(e) => {
                                    setAgreeToBeCharged(e.currentTarget.checked)
                                }}
                                sx={{
                                    transform: "scale(1.2)",
                                    ".Mui-checked": { color: colors.neonBlue },
                                    ".Mui-checked+.MuiSwitch-track": { backgroundColor: `${colors.neonBlue}50` },
                                }}
                            />
                        </Stack>
                    </Stack>
                )}
            </Stack>

            <Stack direction="row" spacing="1rem" sx={{ pt: "1rem" }}>
                <FancyButton
                    excludeCaret
                    clipThingsProps={{
                        clipSize: "5px",
                        backgroundColor: theme.factionTheme.background,
                        opacity: 1,
                        border: { borderColor: colors.green, borderThickness: "1.5px" },
                        sx: { position: "relative" },
                    }}
                    sx={{ px: "1.5rem", py: 0, color: colors.green, minWidth: 0 }}
                    onClick={() => {
                        updateNotificationPreferences()
                        setTelegramShortcode("")
                    }}
                    disabled={loading || !settingsChanged}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            color: colors.green,
                            fontFamily: fonts.nostromoBold,
                        }}
                    >
                        SAVE
                    </Typography>
                </FancyButton>
            </Stack>

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
    disabled: boolean
    onChangeFunction: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const PreferenceToggle = ({ title, checked, onChangeFunction, disabled }: PreferenceToggleProps) => {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>{title}</Typography>
            <Switch
                disabled={disabled}
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
