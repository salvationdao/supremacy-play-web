import { Box, Stack } from '@mui/material'
import { NotificationItem, TextAlert } from '..'
import { NOTIFICATION_LINGER, NOTIFICATION_TIME, UI_OPACITY } from '../../constants'
import { colors } from '../../theme/theme'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { makeid, useAuth, useDimension, useWebsocket } from '../../containers'
import { useEffect } from 'react'
import HubKey from '../../keys'
import { useArray } from '../../hooks'

// KILL: when a war machine is destroyed
// LOCATION_SELECTING: user is choosing a target location on map
// BATTLE_ABILITY: when a faction has initiated a battle ability
// FACTION_ABILITY: when a faction has initiated a faction ability
// WARMACHINE_ABILITY: when a faction has initiated a war machine ability
// TEXT: generic notification with no styles, just text
interface NotificationResponse {
    type: 'KILL' | 'LOCATION_SELECTING' | 'BATTLE_ABILITY' | 'WARMACHINE_ABILITY' | 'TEXT'
    data: string
}

export const Notifications = () => {
    const { state, subscribe } = useWebsocket()
    const { user } = useAuth()
    const theme = useTheme<Theme>()
    const {
        iframeDimensions: { height },
    } = useDimension()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray([], 'notiID')

    // Notifications
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<NotificationResponse | undefined>(
            HubKey.SubGameNotification,
            (payload) => newNotification(payload),
            null,
            true,
        )
    }, [state, subscribe, user])

    // Function to add new notification to array, and will clear itself out after certain time
    const newNotification = (notification: NotificationResponse | undefined) => {
        if (!notification) return

        const notiID = makeid()
        const duration = NOTIFICATION_TIME
        addNotification({ notiID, ...notification, duration })

        // Linger is for the slide animation to play before clearing off the component
        setTimeout(() => {
            removeByID(notiID)
        }, duration + NOTIFICATION_LINGER)
    }

    const notificationsJsx = notifications
        .filter((n) => !!n)
        .reverse()
        .map((n) => {
            if (!n) return null

            switch (n.type) {
                case 'KILL':
                case 'ACTION':
                case 'TEXT':
                    return (
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <TextAlert data={n.data} />
                            </NotificationItem>
                        </Box>
                    )
            }
        })

    return (
        <Stack
            sx={{
                position: 'absolute',
                bottom: 138,
                right: 10,
                zIndex: 15,
                overflow: 'hidden',
                opacity: UI_OPACITY,
            }}
        >
            <Box>
                <Box
                    sx={{
                        flex: 1,
                        // 100vh, 2 x 5px gap above, 150px gap bottom
                        // mini map: 200px total height, 65px above it
                        maxHeight: `calc(${height}px - 5px - 150px - 5px - 200px - 65px)`,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        pr: 1,
                        py: 0.2,
                        direction: 'ltr',
                        scrollbarWidth: 'none',
                        '::-webkit-scrollbar': {
                            width: 4,
                        },
                        '::-webkit-scrollbar-track': {
                            boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
                            borderRadius: 3,
                        },
                        '::-webkit-scrollbar-thumb': {
                            background: theme.factionTheme.primary,
                            borderRadius: 3,
                        },
                    }}
                >
                    <Box sx={{ direction: 'ltr' }}>
                        <Stack spacing={0.6}>{notificationsJsx}</Stack>
                    </Box>
                </Box>
            </Box>
        </Stack>
    )
}
