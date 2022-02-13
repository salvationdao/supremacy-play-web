import { Box, Stack } from '@mui/material'
import { BattleFactionAbilityAlert, LocationSelectAlert, NotificationItem, TextAlert, WarMachineAbilityAlert } from '..'
import { CONTROLS_HEIGHT, GAMEBAR_HEIGHT, NOTIFICATION_LINGER, NOTIFICATION_TIME, UI_OPACITY } from '../../constants'
import { colors } from '../../theme/theme'
import { useTheme } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { makeid, useAuth, useDimension, useWebsocket } from '../../containers'
import { useEffect } from 'react'
import HubKey from '../../keys'
import { useArray } from '../../hooks'

const SPAWN_TEST_NOTIFICATIONS = false

/*
KILL: when a war machine is destroyed
LOCATION_SELECTING: user is choosing a target location on map
BATTLE_ABILITY: when a faction has initiated a battle ability
FACTION_ABILITY: when a faction has initiated a faction ability
WARMACHINE_ABILITY: when a faction has initiated a war machine ability
TEXT: generic notification with no styles, just text
*/
interface NotificationResponse {
    type: 'TEXT' | 'LOCATION_SELECT' | 'BATTLE_ABILITY' | 'FACTION_ABILITY' | 'WAR_MACHINE_ABILITY'
    data: any
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

    // Test cases
    useEffect(() => {
        if (!SPAWN_TEST_NOTIFICATIONS) return

        const locationSelectNoti: NotificationResponse = {
            type: 'LOCATION_SELECT',
            data: {
                type: 'TRIGGER',
                x: 7,
                y: 5,
                currentUser: {
                    username: 'Jayli3n',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
                reason: '',
            },
        }

        const locationSelectNoti2: NotificationResponse = {
            type: 'LOCATION_SELECT',
            data: {
                type: 'FAILED_TIMEOUT',
                x: 7,
                y: 5,
                currentUser: {
                    username: 'Jayli3n',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                nextUser: {
                    username: 'Darren-Hung',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Boston Cybernetics',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
                reason: '',
            },
        }

        const locationSelectNoti3: NotificationResponse = {
            type: 'LOCATION_SELECT',
            data: {
                type: 'FAILED_DISCONNECTED',
                x: 7,
                y: 5,
                currentUser: {
                    username: 'Jayli3n',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                nextUser: {
                    username: 'Darren-Hung',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Boston Cybernetics',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
                reason: '',
            },
        }

        const locationSelectNoti4: NotificationResponse = {
            type: 'LOCATION_SELECT',
            data: {
                type: 'CANCELLED_NO_PLAYER',
                x: 7,
                y: 5,
                currentUser: {
                    username: 'Jayli3n',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
                reason: '',
            },
        }

        const locationSelectNoti5: NotificationResponse = {
            type: 'LOCATION_SELECT',
            data: {
                type: 'CANCELLED_DISCONNECT',
                x: 7,
                y: 5,
                currentUser: {
                    username: 'Jayli3n',
                    avatarID: '949fd2b8-1c8f-4938-8c78-d4d40f8e12ef',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
                reason: '',
            },
        }

        const battleAbilityNoti: NotificationResponse = {
            type: 'BATTLE_ABILITY',
            data: {
                user: {
                    username: 'Jayli3n',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
            },
        }

        const warMachineAbilityNoti: NotificationResponse = {
            type: 'WAR_MACHINE_ABILITY',
            data: {
                user: {
                    username: 'Jayli3n',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
                ability: {
                    label: 'AIRSTRIKE',
                    imageUrl: 'https://i.pinimg.com/originals/b1/92/4d/b1924dce177345b5485bb5490ab3441f.jpg',
                    colour: '#428EC1',
                },
                warMachine: {
                    name: 'Zaibatsu WREX Tenshi Mk1 B',
                    imageUrl: '',
                    faction: {
                        label: 'Red Mountain Offworld Mining Corporation',
                        logoBlobID: '91dae11d-eb07-4906-bbdd-6417b880770a',
                        theme: {
                            primary: '#C24242',
                            secondary: '#FFFFFF',
                            background: '#0D0404',
                        },
                    },
                },
            },
        }

        const textNoti: NotificationResponse = {
            type: 'TEXT',
            data: 'Just a test notification text to see how it looks.',
        }

        newNotification(locationSelectNoti)
        newNotification(locationSelectNoti2)
        newNotification(locationSelectNoti3)
        newNotification(locationSelectNoti4)
        newNotification(locationSelectNoti5)
        newNotification(battleAbilityNoti)
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
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <TextAlert data={n.data} />
                            </NotificationItem>
                        </Box>
                    )
                case 'LOCATION_SELECT':
                    return (
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <LocationSelectAlert data={n.data} />
                            </NotificationItem>
                        </Box>
                    )
                case 'BATTLE_ABILITY':
                case 'FACTION_ABILITY':
                    return (
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <BattleFactionAbilityAlert data={n.data} />
                            </NotificationItem>
                        </Box>
                    )
                case 'WAR_MACHINE_ABILITY':
                    return (
                        <Box key={n.notiID}>
                            <NotificationItem duration={n.duration}>
                                <WarMachineAbilityAlert data={n.data} />
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
                        // 100vh, 138px gap bottom, gamebar height, controls height
                        // mini map: 230px total height
                        maxHeight: `calc(${height}px - 138px - 230px - ${GAMEBAR_HEIGHT}px - ${CONTROLS_HEIGHT}px)`,
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
