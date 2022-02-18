import { Box, Stack } from '@mui/material'
import {
    BattleAbilityAlert,
    FactionAbilityAlert,
    LocationSelectAlert,
    NotificationItem,
    TextAlert,
    WarMachineAbilityAlert,
} from '..'
import { NOTIFICATION_LINGER, NOTIFICATION_TIME, UI_OPACITY } from '../../constants'
import { colors } from '../../theme/theme'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { makeid, useAuth, useDimension, useWebsocket } from '../../containers'
import { useEffect } from 'react'
import HubKey from '../../keys'
import { useArray } from '../../hooks'
import {
    locationSelectNoti,
    locationSelectNoti2,
    locationSelectNoti3,
    locationSelectNoti4,
    locationSelectNoti5,
    battleAbilityNoti,
    factionAbilityNoti,
    warMachineAbilityNoti,
    textNoti,
} from '../../samepleData'

const SPAWN_TEST_NOTIFICATIONS = false

/*
KILL: when a war machine is destroyed
LOCATION_SELECTING: user is choosing a target location on map
BATTLE_ABILITY: when a faction has initiated a battle ability
FACTION_ABILITY: when a faction has initiated a faction ability
WARMACHINE_ABILITY: when a faction has initiated a war machine ability
TEXT: generic notification with no styles, just text
*/
export interface NotificationResponse {
    type: 'TEXT' | 'LOCATION_SELECT' | 'BATTLE_ABILITY' | 'FACTION_ABILITY' | 'WAR_MACHINE_ABILITY'
    data: any
}

export const Notifications = () => {
    const { state, subscribe } = useWebsocket()
    const { user } = useAuth()
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { height },
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

    // Test cases
    useEffect(() => {
        if (!SPAWN_TEST_NOTIFICATIONS) return

        newNotification(locationSelectNoti)
        newNotification(locationSelectNoti2)
        newNotification(locationSelectNoti3)
        newNotification(locationSelectNoti4)
        newNotification(locationSelectNoti5)
        newNotification(battleAbilityNoti)
        newNotification(factionAbilityNoti)
        newNotification(warMachineAbilityNoti)
        newNotification(textNoti)
    }, [])

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
                case 'TEXT':
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <TextAlert data={n.data} />
                        </NotificationItem>
                    )
                case 'LOCATION_SELECT':
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <LocationSelectAlert data={n.data} />
                        </NotificationItem>
                    )
                case 'BATTLE_ABILITY':
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <BattleAbilityAlert data={n.data} />
                        </NotificationItem>
                    )
                case 'FACTION_ABILITY':
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <FactionAbilityAlert data={n.data} />
                        </NotificationItem>
                    )
                case 'WAR_MACHINE_ABILITY':
                    return (
                        <NotificationItem key={n.notiID} duration={n.duration}>
                            <WarMachineAbilityAlert data={n.data} />
                        </NotificationItem>
                    )
            }
        })

    return (
        <Stack
            sx={{
                position: 'absolute',
                top: 10,
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
                        // 100vh, 110px gap bottom
                        maxHeight: `calc(${height}px - 110px)`,
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
