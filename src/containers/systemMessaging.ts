import React, { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { SvgAnnouncement, SvgDamage1, SvgListView, SvgWrapperProps } from "../assets"
import { useGameServerCommandsUser, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { SystemMessage, SystemMessageType } from "../types"

export interface SystemMessageDisplayable extends SystemMessage {
    icon: React.VoidFunctionComponent<SvgWrapperProps>
}

const SystemMessagingContainer = createContainer(() => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])
    const [error, setError] = useState<string>()

    const fetchMessages = useCallback(async () => {
        try {
            const resp = await send<SystemMessage[]>(GameServerKeys.SystemMessageList)
            console.log(resp)

            if (!resp) return

            const displayables = resp.map<SystemMessageDisplayable>((r) => {
                let icon = SvgAnnouncement
                switch (r.type) {
                    case SystemMessageType.MechQueue:
                        icon = SvgListView
                        break
                    case SystemMessageType.MechBattleComplete:
                        icon = SvgDamage1
                        break
                }

                return {
                    ...r,
                    icon,
                }
            })
            setMessages(displayables)
        } catch (err) {
            let message = "Failed to get system messages."
            if (typeof err === "string") {
                message = err
            } else if (err instanceof Error) {
                message = err.message
            }
            setError(message)
            console.error(err)
        }
    }, [send])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    useGameServerSubscriptionUser<boolean>(
        {
            URI: "/system_messages",
            key: GameServerKeys.SubSystemMessageListUpdated,
        },
        (payload) => {
            if (!payload) return
            fetchMessages()
        },
    )

    const dismissMessage = useCallback(
        (index: number) => {
            if (typeof messages[index] === "undefined") return

            setMessages((prev) => {
                prev.splice(index, 1)
                return [...prev]
            })
        },
        [messages],
    )

    return {
        error,
        messages,
        dismissMessage,
    }
})

export const SystemMessagingProvider = SystemMessagingContainer.Provider
export const useSystemMessaging = SystemMessagingContainer.useContainer
