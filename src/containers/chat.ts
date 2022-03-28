import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket, useSnackbar } from "."
import { MESSAGES_BUFFER_SIZE } from "../constants"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"
import { GameServerKeys, PassportServerKeys } from "../keys"
import { ChatData, UserStat } from "../types/passport"

export interface UserMultiplier {
    player_id: string
    total_multiplier: string
}

export interface UserMultiplierMap {
    [player_id: string]: string
}

export interface UserIDMap {
    [player_id: string]: UserStat
}

export interface UserMultiplierResponse {
    multipliers: UserMultiplier[]
    citizen_player_ids: string[]
}

export interface SentChatMessageData {
    global: Date[]
    faction: Date[]
}

export type SplitOptionType = "tabbed" | "split" | null

export type FontSizeType = 0.8 | 1 | 1.35

export const ChatContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { user } = usePassportServerAuth()
    const { state, subscribe, send } = usePassportServerWebsocket()
    const { state: gsState, subscribe: gsSubscribe } = useGameServerWebsocket()

    // Tabs: 0 is global chat, 1 is faction chat
    const [tabValue, setTabValue] = useState(0)

    // Chat settings
    const [splitOption, setSplitOption] = useState<SplitOptionType>(
        (localStorage.getItem("chatSplitOption") as SplitOptionType) || "tabbed",
    )
    const [filterZerosGlobal, toggleFilterZerosGlobal] = useToggle(
        localStorage.getItem("chatFilterZerosGlobal") == "true",
    )
    const [filterZerosFaction, toggleFilterZerosFaction] = useToggle(
        localStorage.getItem("chatFilterZerosFaction") == "true",
    )

    const [fontSize, setFontSize] = useState<FontSizeType>(
        parseString(localStorage.getItem("chatFontSize"), 1) as FontSizeType,
    )

    // Chat states
    const [initialSentDate, setInitialSentDate] = useState<SentChatMessageData>({ global: [], faction: [] })
    const [initialMessageColor, setInitialMessageColor] = useState<string>()
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatData[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatData[]>([])
    const [factionChatUnread, setFactionChatUnread] = useState<number>(0)
    const [globalChatUnread, setGlobalChatUnread] = useState<number>(0)
    const [userMultiplierMap, setUserMultiplierMap] = useState<UserMultiplierMap>({})
    const [citizenPlayerIDs, setCitizenPlayerIDs] = useState<string[]>([])
    const [userStatMap, setUserStatMap] = useState<UserIDMap>({})

    // Store list of messages that were successfully sent or failed
    const [sentMessages, setSentMessages] = useState<Date[]>([])
    const [failedMessages, setFailedMessages] = useState<Date[]>([])

    // Save chat settings to local storage
    useEffect(() => {
        localStorage.setItem("chatSplitOption", splitOption || "tabbed")
        localStorage.setItem("chatFilterZerosGlobal", filterZerosGlobal ? "true" : "false")
        localStorage.setItem("chatFilterZerosFaction", filterZerosFaction ? "true" : "false")
        localStorage.setItem("chatFontSize", fontSize ? fontSize.toString() : "1")
    }, [splitOption, filterZerosGlobal, filterZerosFaction, fontSize])

    const onSentMessage = useCallback(
        (sentAt: Date) => {
            setSentMessages((prev) => {
                // Buffer the array
                const newArray = prev.concat(sentAt)
                return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
            })
        },
        [setSentMessages],
    )

    const onFailedMessage = useCallback(
        (sentAt: Date) => {
            setFailedMessages((prev) => {
                // Buffer the array
                const newArray = prev.concat(sentAt)
                return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
            })
        },
        [setFailedMessages],
    )

    const newMessageHandler = useCallback(
        (message: ChatData, faction_id: string | null) => {
            if (faction_id === null) {
                setGlobalChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = prev.concat(message)
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            } else {
                setFactionChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = prev.concat(message)
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            }
        },
        [setGlobalChatMessages, setFactionChatMessages],
    )

    // Collect Past Messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        try {
            send<ChatData[]>(PassportServerKeys.ChatPastMessages).then((resp) => {
                setGlobalChatMessages(resp)
                setInitialSentDate((prev) => ({
                    ...prev,
                    global: resp.map((m) => m.sent_at),
                }))
            })
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve global chat history.", "error")
            console.debug(e)
            return
        }
    }, [state, send])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !user || !user.faction_id || !user.faction) return
        try {
            send<ChatData[]>(PassportServerKeys.ChatPastMessages, { faction_id: user.faction_id }).then((resp) => {
                setFactionChatMessages(resp)
                setInitialSentDate((prev) => ({
                    ...prev,
                    faction: resp.map((m) => m.sent_at),
                }))
                const selfMessage = resp.find((m) => m.from_user_id === user.id)
                if (selfMessage) {
                    setInitialMessageColor(selfMessage.message_color)
                }
            })
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve syndicate chat history.", "error")
            console.debug(e)
            return
        }
    }, [state, user, send])

    useEffect(() => {
        if (splitOption == "split") {
            setGlobalChatUnread(0)
            setFactionChatUnread(0)
            return
        }

        if (tabValue === 1 && factionChatUnread !== 0) {
            setFactionChatUnread(0)
        }
        if (tabValue === 0 && globalChatUnread !== 0) {
            setGlobalChatUnread(0)
        }
    }, [tabValue, factionChatUnread, splitOption])

    // Subscribe to multiplier map
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSubscribe) return
        return gsSubscribe<UserMultiplierResponse>(GameServerKeys.SubMultiplierMap, (payload) => {
            if (!payload) {
                setUserMultiplierMap({})
                setCitizenPlayerIDs([])
                return
            }

            const um: UserMultiplierMap = {}
            payload.multipliers.forEach((m) => {
                um[m.player_id] = m.total_multiplier
            })

            setUserMultiplierMap(um)
            setCitizenPlayerIDs(payload.citizen_player_ids)
        })
    }, [gsState, gsSubscribe])

    // Subscribe to user stats
    useEffect(() => {
        if (gsState !== WebSocket.OPEN || !gsSubscribe) return
        return gsSubscribe<UserStat[]>(
            GameServerKeys.SubscribeChatUserStats,
            (payload: UserStat[]) => {
                if (!payload) {
                    setUserStatMap({})
                    return
                }

                const um: UserIDMap = {}
                payload.forEach((m) => {
                    um[m.id] = m
                })

                setUserStatMap(um)
            },
            null,
            true,
        )
    }, [gsState, gsSubscribe])

    // Subscribe to global chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        return subscribe<ChatData>(PassportServerKeys.SubscribeGlobalChat, (m) => {
            if (!m || m.from_user_id === user?.id) return
            newMessageHandler(m, null)
            if (tabValue !== 0 && splitOption == "tabbed") setGlobalChatUnread(globalChatUnread + 1)
        })
    }, [state, user, subscribe, tabValue, globalChatUnread])

    // Subscribe to faction chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        if (!user || !user.faction_id || !user.faction) {
            return
        }
        return subscribe<ChatData>(PassportServerKeys.SubscribeFactionChat, (m) => {
            if (!m || m.from_user_id === user?.id) return
            newMessageHandler(m, m.from_user_id)
            if (tabValue !== 1 && splitOption == "tabbed") setFactionChatUnread(factionChatUnread + 1)
        })
    }, [user, state, subscribe, tabValue, factionChatUnread])

    return {
        tabValue,
        setTabValue,
        newMessageHandler,
        splitOption,
        setSplitOption,
        filterZerosGlobal,
        toggleFilterZerosGlobal,
        filterZerosFaction,
        toggleFilterZerosFaction,
        initialSentDate,
        initialMessageColor,
        globalChatMessages,
        factionChatMessages,
        factionChatUnread,
        globalChatUnread,
        userMultiplierMap,
        citizenPlayerIDs,
        onSentMessage,
        sentMessages: sentMessages.concat(initialSentDate.global, initialSentDate.faction),
        failedMessages,
        onFailedMessage,
        fontSize,
        setFontSize,
        userStatMap,
    }
})

export const ChatProvider = ChatContainer.Provider
export const useChat = ChatContainer.useContainer
