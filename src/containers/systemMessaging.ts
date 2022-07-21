import React, { useCallback, useState } from "react"
import { createContainer } from "unstated-next"
import { SvgAnnouncement, SvgDamage1, SvgListView, SvgWrapperProps } from "../assets"
import { useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { SystemMessage, SystemMessageType } from "../types"

export interface SystemMessageDisplayable extends SystemMessage {
    id: number
    icon: React.VoidFunctionComponent<SvgWrapperProps>
}

const SystemMessagingContainer = createContainer(() => {
    const [messages, setMessages] = useState<SystemMessageDisplayable[]>([])

    useGameServerSubscriptionUser<SystemMessage>(
        {
            URI: "/system_messages",
            key: GameServerKeys.SubSystemMessages,
        },
        (payload) => {
            if (!payload) return
            console.log(payload)
            setMessages((prev) => {
                let icon = SvgAnnouncement
                switch (payload.type) {
                    case SystemMessageType.MechQueue:
                        icon = SvgListView
                        break
                    case SystemMessageType.MechBattleComplete:
                        icon = SvgDamage1
                        break
                }
                return [
                    ...prev,
                    {
                        ...payload,
                        id: prev.length,
                        icon,
                    },
                ]
            })
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
        messages,
        dismissMessage,
    }
})

export const SystemMessagingProvider = SystemMessagingContainer.Provider
export const useSystemMessaging = SystemMessagingContainer.useContainer
