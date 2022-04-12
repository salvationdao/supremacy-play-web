import { Box, Button, Modal, Stack, Switch, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useGameServerWebsocket, usePassportServerAuth, useSnackbar, WebSocketProperties } from "../../../containers"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"

interface PreferencesModalProps {
    open: boolean
    toggle: (value: boolean) => void
}

export interface PlayerProfile {
    enable_telegram_notifications: boolean
    enable_sms_notifications: boolean
    enable_push_notifications: boolean
    mobile_number: string
}

export const PreferencesModal = ({ open, toggle }: PreferencesModalProps) => {
    const { user } = usePassportServerAuth()
    const { subscribe, send } = useGameServerWebsocket()
    const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>()

    // get player profile
    useEffect(() => {
        if (!user || !send) return
        ;(async () => {
            try {
                const resp = await send<PlayerProfile | null>(GameServerKeys.GetPlayerProfile)

                setPlayerProfile(resp)
            } catch (err) {
                // newSnackbarMessage(typeof err === "string" ? err : "Issue getting settings, try again or contact support.", "error")
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
                            <BattleQueueNotifications playerProfile={playerProfile} send={send} subscribe={subscribe} />
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
}

export const BattleQueueNotifications = ({ playerProfile, send }: BattleQueueNotifcationsProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const [newPlayerProfile, setNewPlayerProfile] = useState<PlayerProfile>()

    const [error, setError] = useState<string>()

    const updatePlayerProfile = async () => {
        console.log("hello")

        if (!send || !newPlayerProfile) return

        console.log("hello2", newPlayerProfile)

        try {
            const r = await send(GameServerKeys.UpdatePlayerProfile, {
                enable_telegram_notifications: newPlayerProfile.enable_telegram_notifications,
                enable_sms_notifications: newPlayerProfile.enable_sms_notifications,
                enable_push_notifications: newPlayerProfile.enable_push_notifications,
                mobile_number: newPlayerProfile.mobile_number,
            })

            console.log("r", r)

            setError(undefined)
            newSnackbarMessage("Saved notification preference.", "success")
        } catch (e) {
            setError(typeof e === "string" ? e : "Unable to update SMS preference, please try again or contact support.")
        }
    }
    useEffect(() => {
        if (!playerProfile) {
            setNewPlayerProfile({
                enable_telegram_notifications: false,
                enable_sms_notifications: false,
                enable_push_notifications: false,
                mobile_number: "",
            })
            return
        }
        setNewPlayerProfile(playerProfile)
    }, [])

    if (!newPlayerProfile) return <></>
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

            <PreferenceToggle
                title="Enable battle queue Telegram notifications:"
                checked={!!newPlayerProfile?.enable_telegram_notifications}
                onChangeFunction={(e) => setNewPlayerProfile({ ...newPlayerProfile, enable_telegram_notifications: e.currentTarget.checked })}
            />

            <Button onClick={updatePlayerProfile}>Save</Button>
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
