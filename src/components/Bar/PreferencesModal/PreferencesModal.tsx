import { Alert, Box, Button, Checkbox, Modal, Stack, Switch, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgInfoCircular, SvgSupToken } from "../../../assets"
import { useAuth, useSnackbar } from "../../../containers"
import { SendFunc } from "../../../containers/ws"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { TooltipHelper } from "../../Common/TooltipHelper"

interface PreferencesModalProps {
    open: boolean
    toggle: () => void
    setTelegramShortcode: (code: string) => void
}

export interface PlayerPreferences {
    enable_telegram_notifications: boolean
    enable_sms_notifications: boolean
    enable_push_notifications: boolean
    mobile_number: string
}

export const PreferencesModal = ({ open, toggle, setTelegramShortcode }: PreferencesModalProps) => {
    const { user } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [playerPreferences, setPlayerPreferences] = useState<PlayerPreferences | null>()

    const { newSnackbarMessage } = useSnackbar()

    // get player preferences
    useEffect(() => {
        if (!user || !send) return
        ;(async () => {
            try {
                const resp = await send<PlayerPreferences | null>(GameServerKeys.GetPlayerPreferences)
                setPlayerPreferences(resp)
            } catch (err) {
                newSnackbarMessage(typeof err === "string" ? err : "Issue getting player preferences", "error")
            }
        })()
    }, [user, send, newSnackbarMessage])

    const primaryColor = colors.neonBlue
    return (
        <Modal open={open} onClose={toggle}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "69rem",
                    boxShadow: 24,
                }}
            >
                <ClipThing
                    clipSize="0"
                    border={{
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                >
                    <Stack
                        spacing=".7rem"
                        sx={{
                            position: "relative",
                            px: "1.8rem",
                            py: "1.6rem",
                            pb: "1.6rem",
                            backgroundColor: colors.darkNavyBlue,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                            PREFERENCES
                        </Typography>
                        {playerPreferences ? (
                            <BattleQueueNotifications
                                borderColour={primaryColor}
                                setTelegramShortcode={setTelegramShortcode}
                                playerPreferences={playerPreferences}
                                setPlayerPreferences={setPlayerPreferences}
                                send={send}
                                toggle={toggle}
                            />
                        ) : (
                            <Typography sx={{ opacity: 0.6 }}>Loading...</Typography>
                        )}
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}

interface BattleQueueNotificationsProps {
    playerPreferences: PlayerPreferences
    setPlayerPreferences: (p: PlayerPreferences) => void
    setTelegramShortcode: (code: string) => void
    borderColour: string
    toggle: (value: boolean) => void
    send: SendFunc
}

interface ProfileResponse {
    shortcode: string
    telegram_id: string
}

export const BattleQueueNotifications = ({
    playerPreferences,
    setPlayerPreferences,
    setTelegramShortcode,
    toggle,
    borderColour,
    send,
}: BattleQueueNotificationsProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const [newPlayerPreferences, setNewPlayerPreferences] = useState<PlayerPreferences>(playerPreferences)
    const [agreeToBeCharged, setAgreeToBeCharged] = useState<boolean>(false)
    const [loading, setLoading] = useToggle(false)
    const [error, setError] = useState<string>()

    const settingsChanged =
        playerPreferences.enable_telegram_notifications != newPlayerPreferences.enable_telegram_notifications ||
        playerPreferences.enable_sms_notifications != newPlayerPreferences.enable_sms_notifications

    const hasAnyNotifications = newPlayerPreferences.enable_telegram_notifications || newPlayerPreferences.enable_sms_notifications

    const hadNotificationsTurnedOff = !playerPreferences.enable_telegram_notifications && !playerPreferences.enable_sms_notifications

    const updatePlayerProfile = async () => {
        if (!send || !newPlayerPreferences) return

        if (newPlayerPreferences.enable_sms_notifications && !newPlayerPreferences.mobile_number) {
            setError("Please enter mobile number to enable sms notifications")
            return
        }

        if (settingsChanged && hadNotificationsTurnedOff && hasAnyNotifications && !agreeToBeCharged) {
            setError("Please agree to 'You have read and agreed to be charge 5 sups per notification'")
            return
        }

        try {
            setLoading(true)
            const prefs = {
                enable_telegram_notifications: newPlayerPreferences.enable_telegram_notifications,
                enable_sms_notifications: newPlayerPreferences.enable_sms_notifications,
                enable_push_notifications: newPlayerPreferences.enable_push_notifications,
                mobile_number: newPlayerPreferences.mobile_number,
            }
            const resp = await send<ProfileResponse>(GameServerKeys.UpdatePlayerPreferences, prefs)

            if (!resp) {
                setError("Unable to update preferences, please try again or contact support.")
                setLoading(false)
                return
            }

            if (resp.shortcode && !resp.telegram_id) {
                setTelegramShortcode(resp.shortcode)
            }

            setLoading(false)
            setError(undefined)
            newSnackbarMessage("Saved notification preference.", "success")
            setPlayerPreferences(prefs)
        } catch (e) {
            setError(typeof e === "string" ? e : "Unable to update preferences, please try again or contact support.")
            setLoading(false)
        }
    }

    return (
        <Stack sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08", borderRadius: 1 }}>
            <Box sx={{ display: "flex" }}>
                <Typography gutterBottom sx={{ opacity: 0.8 }}>
                    NOTIFICATIONS
                </Typography>
                <TooltipHelper
                    placement="right-start"
                    text={
                        <Box>
                            You will be notified you via your chosen notification preference(s) when your war machine is within the top 10 in queue. Once the
                            notification is sent you will be charged
                            <SvgSupToken
                                sx={{
                                    width: "10px",
                                    display: "inline",
                                    marginTop: "10px",
                                    marginLeft: "5px",
                                }}
                                size="1.2rem"
                                fill={colors.yellow}
                                margin={0}
                            />
                            5
                        </Box>
                    }
                >
                    <Box>
                        <SvgInfoCircular
                            size="1.2rem"
                            sx={{
                                ml: ".5rem",
                                mt: ".2rem",
                                paddingBottom: 0,
                                opacity: 0.4,
                                ":hover": { opacity: 1 },
                            }}
                        />
                    </Box>
                </TooltipHelper>
            </Box>

            <PreferenceToggle
                disabled={loading}
                title="Enable battle queue SMS notifications:"
                checked={!!newPlayerPreferences?.enable_sms_notifications}
                onChangeFunction={(e) => setNewPlayerPreferences({ ...newPlayerPreferences, enable_sms_notifications: e.currentTarget.checked })}
            />
            {newPlayerPreferences.enable_sms_notifications && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography>Phone number: </Typography>
                    <TextField
                        disabled={loading}
                        sx={{
                            flexGrow: "2",
                            mt: "-1px",
                            pl: "1rem",
                            input: { px: ".5rem", py: "1px" },
                        }}
                        value={newPlayerPreferences.mobile_number}
                        onChange={(e) => {
                            setNewPlayerPreferences({ ...newPlayerPreferences, mobile_number: e.currentTarget.value })
                        }}
                    />
                </Box>
            )}

            <PreferenceToggle
                disabled={loading}
                title="Enable battle queue Telegram notifications:"
                checked={!!newPlayerPreferences?.enable_telegram_notifications}
                onChangeFunction={(e) => setNewPlayerPreferences({ ...newPlayerPreferences, enable_telegram_notifications: e.currentTarget.checked })}
            />

            {settingsChanged && hadNotificationsTurnedOff && hasAnyNotifications && (
                <>
                    <br />
                    <Alert
                        severity="warning"
                        sx={{
                            alignItems: "center",
                            ".MuiAlert-message": {
                                pt: "1.12rem",
                                fontSize: "1.3rem",
                                fontWeight: "fontWeightBold",
                                fontFamily: fonts.nostromoBold,
                            },
                        }}
                    >
                        <Box
                            sx={{
                                fontFamily: fonts.shareTech,
                                fontSize: "12.35px",
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            You will be notified you via your chosen notification preference(s) when your war machine is within the top 10 in queue. Once the
                            notification is sent you will be charged
                            <SvgSupToken
                                sx={{
                                    width: "10px",
                                    display: "inline",
                                    marginTop: "10px",
                                    marginLeft: "5px",
                                }}
                                size="1.2rem"
                                fill={colors.yellow}
                                margin={0}
                            />
                            5{" "}
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                                You have read and agreed to be charge 5 sups per notification
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
                        </Box>
                    </Alert>
                </>
            )}

            <Box>
                <Button
                    disabled={loading || !settingsChanged}
                    variant="outlined"
                    onClick={() => {
                        updatePlayerProfile()
                        setTelegramShortcode("")
                    }}
                    sx={{
                        justifySelf: "flex-end",
                        mr: 1,
                        mt: 1,
                        pt: ".7rem",
                        pb: ".4rem",
                        width: "9rem",
                        color: borderColour,
                        backgroundColor: colors.darkNavy,
                        borderRadius: 0.7,
                        fontFamily: fonts.nostromoBold,
                        border: `${borderColour} 1px solid`,
                        ":hover": {
                            opacity: 0.8,
                            border: `${borderColour} 1px solid`,
                        },
                    }}
                >
                    Save
                </Button>
                <Button
                    disabled={loading}
                    variant="outlined"
                    onClick={() => {
                        setTelegramShortcode("")
                        toggle(false)
                    }}
                    sx={{
                        justifySelf: "flex-end",
                        mt: 1,
                        pt: ".7rem",
                        pb: ".4rem",
                        width: "9rem",
                        color: borderColour,
                        backgroundColor: colors.darkNavy,
                        borderRadius: 0.7,
                        fontFamily: fonts.nostromoBold,
                        border: `${borderColour} 1px solid`,
                        ":hover": {
                            opacity: 0.8,
                            border: `${borderColour} 1px solid`,
                        },
                    }}
                >
                    Close
                </Button>
            </Box>

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
