import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerAuth, useGameServerWebsocket, useSnackbar } from "."
import { SupremacyPNG } from "../assets"
import { GlobalAnnouncementType } from "../components/LiveChat/GlobalAnnouncement"
import { MESSAGES_BUFFER_SIZE } from "../constants"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"
import { GameServerKeys } from "../keys"
import { BanProposalStruct, ChatMessageType, TextMessageData } from "../types/chat"

interface SentChatMessageData {
    global: Date[]
    faction: Date[]
}

export type SplitOptionType = "tabbed" | "split" | null

export type FontSizeType = 0.8 | 1.1 | 1.35

export const ChatContainer = createContainer(() => {
    const { newSnackbarMessage } = useSnackbar()
    const { user } = useGameServerAuth()
    const { state, send, subscribe } = useGameServerWebsocket()

    // Tabs: 0 is global chat, 1 is faction chat
    const [tabValue, setTabValue] = useState(0)

    // Chat settings
    const [splitOption, setSplitOption] = useState<SplitOptionType>((localStorage.getItem("chatSplitOption") as SplitOptionType) || "tabbed")
    const [filterZerosGlobal, toggleFilterZerosGlobal] = useToggle(localStorage.getItem("chatFilterZerosGlobal") == "true")
    const [filterZerosFaction, toggleFilterZerosFaction] = useToggle(localStorage.getItem("chatFilterZerosFaction") == "true")
    const [filterSystemMessages, toggleFilterSystemMessages] = useToggle(localStorage.getItem("chatFilterSystemMessages") == "true")
    const [fontSize, setFontSize] = useState<FontSizeType>(parseString(localStorage.getItem("chatFontSize2"), 1.1) as FontSizeType)

    // Global announcement message
    const [globalAnnouncement, setGlobalAnnouncement] = useState<GlobalAnnouncementType>()

    // Chat states
    const [initialSentDate, setInitialSentDate] = useState<SentChatMessageData>({ global: [], faction: [] })
    const [initialMessageColor, setInitialMessageColor] = useState<string>()
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatMessageType[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatMessageType[]>([])
    const [factionChatUnread, setFactionChatUnread] = useState<number>(0)
    const [globalChatUnread, setGlobalChatUnread] = useState<number>(0)

    const [banProposal, setBanProposal] = useState<BanProposalStruct>()

    // Store list of messages that were successfully sent or failed
    const [sentMessages, setSentMessages] = useState<Date[]>([])
    const [failedMessages, setFailedMessages] = useState<Date[]>([])

    // Save chat settings to local storage
    useEffect(() => {
        localStorage.setItem("chatSplitOption", splitOption || "tabbed")
        localStorage.setItem("chatFilterZerosGlobal", filterZerosGlobal ? "true" : "false")
        localStorage.setItem("chatFilterZerosFaction", filterZerosFaction ? "true" : "false")
        localStorage.setItem("chatFilterSystemMessages", filterSystemMessages ? "true" : "false")
        localStorage.setItem("chatFontSize2", fontSize ? fontSize.toString() : "1")
    }, [splitOption, filterZerosGlobal, filterZerosFaction, filterSystemMessages, fontSize])

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
        (message: ChatMessageType, faction_id: string | null) => {
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

    // Global announcements
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<GlobalAnnouncementType>(
            GameServerKeys.SubGlobalAnnouncement,
            (payload: GlobalAnnouncementType) => {
                if (!payload || !payload.message) {
                    setGlobalAnnouncement(undefined)
                    return
                }
                setGlobalAnnouncement(payload)
            },
            null,
        )
    }, [state, subscribe])

    // Collect Past Messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        try {
            send<ChatMessageType[]>(GameServerKeys.ChatPastMessages).then((resp) => {
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
            send<ChatMessageType[]>(GameServerKeys.ChatPastMessages, { faction_id: user.faction_id }).then((resp) => {
                setFactionChatMessages(resp)
                setInitialSentDate((prev) => ({
                    ...prev,
                    faction: resp.map((m) => m.sent_at),
                }))
                const selfMessage = resp.filter((m) => m.type === "TEXT").find((m) => (m.data as TextMessageData).from_user.id === user.id)
                if (selfMessage) {
                    setInitialMessageColor((selfMessage.data as TextMessageData).message_color)
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

    const saveUserStats = useCallback(
        (message: ChatMessageType, isFaction: boolean) => {
            const data = message.data as TextMessageData
            const newStats = {
                total_multiplier: data.total_multiplier,
                is_citizen: data.is_citizen,
                from_user_stat: data.from_user_stat,
            }

            if (isFaction) {
                setFactionChatMessages((prev) => {
                    return prev.map((m) => {
                        if (m.type === "TEXT" && message.sent_at.getTime() - m.sent_at.getTime() < 5000) {
                            return { ...m, data: { ...m.data, ...newStats } }
                        }
                        return m
                    })
                })
            } else {
                setGlobalChatMessages((prev) =>
                    prev.map((m) => {
                        if (m.type === "TEXT" && message.sent_at.getTime() - m.sent_at.getTime() < 5000) {
                            return { ...m, data: { ...m.data, ...newStats } }
                        }
                        return m
                    }),
                )
            }
        },
        [user, setGlobalChatMessages, setFactionChatMessages],
    )

    // Subscribe to global chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        return subscribe<ChatMessageType>(GameServerKeys.SubscribeGlobalChat, (m) => {
            if (!m) return
            if (m.type === "TEXT" && (m.data as TextMessageData).from_user.id === user?.id) {
                saveUserStats(m, false)
                return
            }

            newMessageHandler(m, null)
            if (tabValue !== 0 && splitOption == "tabbed") setGlobalChatUnread(globalChatUnread + 1)
        })
    }, [state, user, subscribe, tabValue, globalChatUnread])

    // Subscribe to faction chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN || !user || !user.faction_id || !user.faction) return
        return subscribe<ChatMessageType>(GameServerKeys.SubscribeFactionChat, (m) => {
            if (!m) return
            if (m.type === "TEXT" && (m.data as TextMessageData).from_user.id === user?.id) {
                saveUserStats(m, true)
                return
            }

            newMessageHandler(m, "faction_id")
            if (tabValue !== 1 && splitOption == "tabbed") setFactionChatUnread(factionChatUnread + 1)
        })
    }, [user, state, subscribe, tabValue, factionChatUnread])

    // Subscribe to ban proposals
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user || !user.faction_id || !user.faction) return
        return subscribe<BanProposalStruct>(GameServerKeys.SubBanProposals, (payload) => {
            if (!payload) return setBanProposal(undefined)

            const startedAtTime = payload.started_at.getTime()
            const nowTime = new Date().getTime()
            const duration = payload.ended_at.getTime() - startedAtTime
            const endTime = new Date(Math.min(startedAtTime, nowTime) + duration)

            setBanProposal({
                ...payload,
                ended_at: endTime,
            })

            if (!("Notification" in window)) {
                return
            }

            const notification = new Notification("Ban Proposal Initialised", {
                body: `Reason: ${payload.reason}\nOn: ${payload.reported_player_username}\nFrom: ${payload.issued_by_username}`,
                badge: SupremacyPNG,
                icon: SupremacyPNG,
                image: SupremacyPNG,
            })

            setTimeout(() => notification.close(), 10000)
        })
    }, [user, state, subscribe])

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
        filterSystemMessages,
        toggleFilterSystemMessages,
        initialSentDate,
        initialMessageColor,
        globalChatMessages,
        factionChatMessages,
        factionChatUnread,
        globalChatUnread,
        onSentMessage,
        sentMessages: sentMessages.concat(initialSentDate.global, initialSentDate.faction),
        failedMessages,
        onFailedMessage,
        fontSize,
        setFontSize,
        globalAnnouncement,
        banProposal,
    }
})

export const ChatProvider = ChatContainer.Provider
export const useChat = ChatContainer.useContainer
