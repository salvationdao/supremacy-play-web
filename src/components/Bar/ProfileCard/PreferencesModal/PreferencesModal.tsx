import { Box, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useGameServerWebsocket, usePassportServerAuth } from "../../../../containers"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { BattleQueueNotifications } from "./BattleQueueNotifications"

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

    useEffect(() => {
        if (!user || !subscribe) return
        return subscribe<PlayerPrefs>(GameServerKeys.SubPlayerPrefs, (payload) => {
            setPlayerPrefs(payload)
        })
    }, [user, subscribe])

    useEffect(() => {
        if (!user || !subscribe || !playerPrefs?.notifications_battle_queue_browser) return
        return subscribe<string>(GameServerKeys.SubPlayerBattleQueueBrowser, (payload) => {
            if (playerPrefs.notifications_battle_queue_browser) {
                const notification = new Notification("Supremacy: Get ready for battle...", { body: payload })
                setTimeout(() => notification.close(), 10000)
            }
        })
    }, [user, subscribe, playerPrefs?.notifications_battle_queue_browser])

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
                    outline: "1px solid #FFFFFF",
                    borderRadius: 1,
                    boxShadow: 24,
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
                    {playerPrefs && setPlayerPrefs ? (
                        <BattleQueueNotifications
                            playerPrefs={playerPrefs}
                            setPlayerPrefs={setPlayerPrefs}
                            send={send}
                        />
                    ) : (
                        <Typography sx={{ opacity: 0.6 }}>Loading...</Typography>
                    )}
                </Stack>
            </Box>
        </Modal>
    )
}
