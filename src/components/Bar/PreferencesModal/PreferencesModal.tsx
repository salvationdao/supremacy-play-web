import { Box, Button, Modal, Stack, Switch, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar, WebSocketProperties } from "../../../containers"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

interface PreferencesModalProps {
    open: boolean
    toggle: (value: boolean) => void
    setTelegramShortcode: (code: string) => void
}

export interface PlayerProfile {
    enable_telegram_notifications: boolean
    enable_sms_notifications: boolean
    enable_push_notifications: boolean
    mobile_number: string
}

export const PreferencesModal = ({ open, toggle, setTelegramShortcode }: PreferencesModalProps) => {
    const { user } = usePassportServerAuth()
    const { subscribe, send } = useGameServerWebsocket()
    const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>()
    const { newSnackbarMessage } = useSnackbar()

    // get player profile
    useEffect(() => {
        if (!user || !send) return
        ;(async () => {
            try {
                const resp = await send<PlayerProfile | null>(GameServerKeys.GetPlayerProfile)

                setPlayerProfile(resp)
            } catch (err) {
                newSnackbarMessage(typeof err === "string" ? err : "Issue getting player preferences", "error")
            }
        })()
    }, [user, send])
    useCallback(async () => {
        if (!user || !send) return

        const res = await send<PlayerProfile | null>(GameServerKeys.GetPlayerProfile)
        console.log("bruh, ", res)

        setPlayerProfile(res)
    }, [user, send])

    const primaryColor = (user && user.faction && user.faction.theme.primary) || colors.neonBlue

    return (
        <Modal open={open} onClose={() => toggle(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40rem",
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
                            backgroundColor: (user && user.faction && user.faction.theme.background) || colors.darkNavyBlue,
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                            PREFERENCES
                        </Typography>
                        {playerProfile ? (
                            <BattleQueueNotifications
                                borderColour={primaryColor}
                                setTelegramShortcode={setTelegramShortcode}
                                playerProfile={playerProfile}
                                send={send}
                                subscribe={subscribe}
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

interface BattleQueueNotifcationsProps extends Partial<WebSocketProperties> {
    playerProfile: PlayerProfile
    setTelegramShortcode: (code: string) => void
    borderColour: string
    toggle: (value: boolean) => void
}

export const BattleQueueNotifications = ({ playerProfile, send, setTelegramShortcode, toggle, borderColour }: BattleQueueNotifcationsProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const [newPlayerProfile, setNewPlayerProfile] = useState<PlayerProfile>(playerProfile)

    const [error, setError] = useState<string>()

    const updatePlayerProfile = async () => {
        if (!send || !newPlayerProfile) return

        try {
            const resp = await send(GameServerKeys.UpdatePlayerProfile, {
                enable_telegram_notifications: newPlayerProfile.enable_telegram_notifications,
                enable_sms_notifications: newPlayerProfile.enable_sms_notifications,
                enable_push_notifications: newPlayerProfile.enable_push_notifications,
                mobile_number: newPlayerProfile.mobile_number,
            })

            console.log("resp", resp)

            if (!resp) return

            if (resp.shortcode && !resp.telegram_id) {
                setTelegramShortcode(resp.shortcode)
            }

            setError(undefined)
            newSnackbarMessage("Saved notification preference.", "success")
        } catch (e) {
            setError(typeof e === "string" ? e : "Unable to update SMS preference, please try again or contact support.")
        }
    }

    return (
        <Stack sx={{ px: "1.5rem", py: ".8rem", backgroundColor: "#FFFFFF08", borderRadius: 1 }}>
            <Typography gutterBottom sx={{ opacity: 0.8 }}>
                NOTIFICATIONS
            </Typography>

            <PreferenceToggle
                title="Enable battle queue SMS notifications:"
                checked={!!newPlayerProfile?.enable_sms_notifications}
                onChangeFunction={(e) => setNewPlayerProfile({ ...newPlayerProfile, enable_sms_notifications: e.currentTarget.checked })}
            />

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography>Phone number: </Typography>
                <TextField
                    sx={{
                        flexGrow: "2",
                        mt: "-1px",
                        pl: "1rem",
                        input: { px: ".5rem", py: "1px" },
                    }}
                    defaultValue={newPlayerProfile.mobile_number}
                    value={newPlayerProfile.mobile_number}
                    onChange={(e) => {
                        setNewPlayerProfile({ ...newPlayerProfile, mobile_number: e.currentTarget.value })
                    }}
                />
            </Box>

            <PreferenceToggle
                title="Enable battle queue Telegram notifications:"
                checked={!!newPlayerProfile?.enable_telegram_notifications}
                onChangeFunction={(e) => setNewPlayerProfile({ ...newPlayerProfile, enable_telegram_notifications: e.currentTarget.checked })}
            />

            <Box>
                <Button
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
                        fontFamily: "Nostromo Regular Bold",
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
                        fontFamily: "Nostromo Regular Bold",
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
    onChangeFunction: (e: any) => void
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
