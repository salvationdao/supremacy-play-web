import moment from 'moment'
import { GAME_SERVER_HOSTNAME } from '../constants'
import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { httpProtocol, useAuth, Vote } from '.'
import { NOTIFICATION_LINGER, NOTIFICATION_TIME } from '../constants'
import { useArray } from '../hooks'
import HubKey from '../keys'
import { makeid, useWebsocket } from './socket'

interface SecondVoteBarResponse {
    factionID: string
    result: number
}

export interface NotificationResponse {
    type: 'KILL' | 'ACTION' | 'SECOND_VOTE' | 'TEXT'
    data: string | Vote
}

export const NotificationsContainer = createContainer(() => {
    const { state, subscribe } = useWebsocket()
    const { user } = useAuth()
    const [secondVoteBar, setSecondVoteBar] = useState<SecondVoteBarResponse>()

    // Notification array
    const { value: notifications, add: addNotification, removeByID } = useArray([], 'notiID')

    // Second vote bar
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<SecondVoteBarResponse | undefined>(
            HubKey.SubSecondVoteTick,
            (payload) => setSecondVoteBar(payload),
            null,
            true,
            true,
        )
    }, [state, subscribe, user])

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

    // REST call for second vote notifications
    useEffect(() => {
        ;(async () => {
            try {
                const result = await fetch(`${httpProtocol()}://${GAME_SERVER_HOSTNAME}/api/second_votes`, {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                })
                const payload: Vote[] = await result.json()

                if (!payload) return
                payload.forEach((n) => {
                    newNotification({
                        type: 'SECOND_VOTE',
                        data: n,
                    })
                })
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    const newNotification = (notification: NotificationResponse | undefined) => {
        if (!notification) return

        const notiID = makeid()
        let duration = NOTIFICATION_TIME

        if (notification.type == 'SECOND_VOTE') {
            const data = notification.data as Vote
            const d = moment.duration(moment(data.endTime).diff(moment()))
            duration += Math.round(d.asMilliseconds())
        }

        addNotification({ notiID, ...notification, duration })

        // Linger is for the slide animation to play before clearing off the component
        setTimeout(() => {
            removeByID(notiID)
        }, duration + NOTIFICATION_LINGER)
    }

    return {
        notifications,
        secondVoteBar,
    }
})

export const NotificationsProvider = NotificationsContainer.Provider
export const useNotifications = NotificationsContainer.useContainer
