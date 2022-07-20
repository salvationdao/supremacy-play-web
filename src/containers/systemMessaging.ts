import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { SystemMessage } from "../types"

interface SystemMessageDismissable extends SystemMessage {
    isDismissed?: boolean
}

const SystemMessagingContainer = createContainer(() => {
    const [messages, setMessages] = useState<SystemMessageDismissable[]>([])

    useGameServerSubscriptionUser<SystemMessage>(
        {
            URI: "/system_messages",
            key: GameServerKeys.SubSystemMessages,
        },
        (payload) => {
            if (!payload) return

            console.log(payload)
            setMessages((prev) => [...prev, payload])
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
