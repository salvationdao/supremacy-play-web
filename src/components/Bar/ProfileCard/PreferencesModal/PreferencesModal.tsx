import { Box, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { BattleQueueNotifications, ClipThing } from "../../.."
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"
import { useGameServerWebsocket, usePassportServerAuth } from "../../../../containers"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"

interface PreferencesModalProps {
    open: boolean
    toggle: (value: boolean) => void
}

export interface PlayerPrefs {
    notifications_battle_queue_sms: boolean
    notifications_battle_queue_browser: boolean
    notifications_battle_queue_push_notifications: boolean
}

export const PreferencesModal = ({ open, toggle }: PreferencesModalProps) => {
    const { user } = usePassportServerAuth()
    const { subscribe, send } = useGameServerWebsocket()
    const [playerPrefs, setPlayerPrefs] = useState<PlayerPrefs>()

    // Subscribe to player preferences
    useEffect(() => {
        if (!user || !subscribe) return
        return subscribe<PlayerPrefs>(GameServerKeys.SubPlayerPrefs, (payload) => {
            setPlayerPrefs(payload)
        })
    }, [user, subscribe])

    // If the user has their browser settings to true, check that the browser has
    // notification permissions (sometimes, user can set time limit etc), if not, requests it again
    useEffect(() => {
        ;(async () => {
            if (!playerPrefs) return
            try {
                if (playerPrefs.notifications_battle_queue_browser) {
                    if (!("Notification" in window)) {
                        throw "This browser does not support notifications."
                    }

                    await Notification.requestPermission()
                }
            } catch (e) {
                console.debug(e)
            }
        })()
    }, [playerPrefs])

    // Subscribe to browser notifications
    useEffect(() => {
        if (!user || !subscribe || !playerPrefs?.notifications_battle_queue_browser || !("Notification" in window))
            return
        return subscribe<string>(GameServerKeys.SubPlayerBattleQueueBrowser, (payload) => {
            if (!payload) return
            if (playerPrefs.notifications_battle_queue_browser) {
                new Notification("Supremacy: get ready for battle!", {
                    body: payload,
                    icon: `${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user?.faction.logo_blob_id}`,
                })
            }
        })
    }, [user, subscribe, playerPrefs?.notifications_battle_queue_browser])

    const primaryColor = (user && user.faction.theme.primary) || colors.neonBlue

    return (
        <Modal open={open} onClose={() => toggle(false)}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40rem",
                    backgroundColor: `${colors.darkNavyBlue}`,
                    outline: "1px solid #FFFFFF60",
                    borderRadius: 1,
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
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: "fontWeightBold" }}>
                            PREFERENCES
                        </Typography>
                        {playerPrefs ? (
                            <BattleQueueNotifications playerPrefs={playerPrefs} send={send} subscribe={subscribe} />
                        ) : (
                            <Typography sx={{ opacity: 0.6 }}>Loading...</Typography>
                        )}
                    </Stack>
                </ClipThing>
            </Box>
        </Modal>
    )
}
