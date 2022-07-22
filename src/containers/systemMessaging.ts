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
        } catch (e) {
            let message = "Failed to get system messages."
            if (typeof e === "string") {
                message = e
            } else if (e instanceof Error) {
                message = e.message
            }
            setError(message)
            console.error(e)
        }
    }, [send])

    const dismissMessage = useCallback(
        async (id: string) => {
            try {
                await send<
                    SystemMessage[],
                    {
                        id: string
                    }
                >(GameServerKeys.SystemMessageDismiss, {
                    id,
                })
            } catch (e) {
                let message = "Failed to dismiss system message."
                if (typeof e === "string") {
                    message = e
                } else if (e instanceof Error) {
                    message = e.message
                }
                setError(message)
                console.error(e)
            }
        },
        [send],
    )

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

    return {
        error,
        messages,
        dismissMessage,
    }
})

export const SystemMessagingProvider = SystemMessagingContainer.Provider
export const useSystemMessaging = SystemMessagingContainer.useContainer
