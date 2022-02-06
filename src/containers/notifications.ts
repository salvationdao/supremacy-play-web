import { useEffect } from 'react'
import { createContainer } from 'unstated-next'
import { useAuth } from '.'
import { NOTIFICATION_LINGER, NOTIFICATION_TIME } from '../constants'
import { useArray } from '../hooks'
import HubKey from '../keys'
import { makeid, useWebsocket } from './socket'

export interface NotificationResponse {
    type: 'KILL' | 'ACTION' | 'TEXT'
    data: string
}

export const NotificationsContainer = createContainer(() => {
    const { state, subscribe } = useWebsocket()
    const { user } = useAuth()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray([], 'notiID')

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

    return {
        notifications,
    }
})

export const NotificationsProvider = NotificationsContainer.Provider
export const useNotifications = NotificationsContainer.useContainer
