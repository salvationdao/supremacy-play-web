import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useGameServerAuth, useGameServerWebsocket, useSnackbar } from "."
import { SupremacyPNG } from "../assets"
import { GlobalAnnouncementType } from "../components/RightDrawer/LiveChat/GlobalAnnouncement"
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
    const { userID, factionID } = useGameServerAuth()
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
    const [newMessage, setNewMessage] = useState<{ f: string | null; m: ChatMessageType }>()

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
    }, [state, send, newSnackbarMessage])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !userID || !factionID) return
        try {
            send<ChatMessageType[]>(GameServerKeys.ChatPastMessages, { faction_id: factionID }).then((resp) => {
                setFactionChatMessages(resp)
                setInitialSentDate((prev) => ({
                    ...prev,
                    faction: resp.map((m) => m.sent_at),
                }))
                const selfMessage = resp.filter((m) => m.type === "TEXT").find((m) => (m.data as TextMessageData).from_user.id === userID)
                if (selfMessage) {
                    setInitialMessageColor((selfMessage.data as TextMessageData).message_color)
                }
            })
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to retrieve syndicate chat history.", "error")
            console.debug(e)
            return
        }
    }, [state, userID, factionID, send, newSnackbarMessage])

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
    }, [tabValue, factionChatUnread, globalChatUnread, splitOption])

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
                        if (
                            m.type === "TEXT" &&
                            (m.data as TextMessageData).from_user.id === userID &&
                            message.sent_at.getTime() - m.sent_at.getTime() < 5000
                        ) {
                            return { ...m, data: { ...m.data, ...newStats } }
                        }
                        return m
                    })
                })
            } else {
                setGlobalChatMessages((prev) =>
                    prev.map((m) => {
                        if (
                            m.type === "TEXT" &&
                            (m.data as TextMessageData).from_user.id === userID &&
                            message.sent_at.getTime() - m.sent_at.getTime() < 5000
                        ) {
                            return { ...m, data: { ...m.data, ...newStats } }
                        }
                        return m
                    }),
                )
            }
        },
        [userID, setGlobalChatMessages, setFactionChatMessages],
    )

    const newMessageHandler = useCallback(
        (message: ChatMessageType, faction_id: string | null) => {
            if (faction_id === null) {
                if (tabValue !== 0 && splitOption == "tabbed") setGlobalChatUnread((prev) => prev + 1)
                setGlobalChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = [...prev, message]
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            } else {
                if (tabValue !== 1 && splitOption == "tabbed") setFactionChatUnread((prev) => prev + 1)
                setFactionChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = [...prev, message]
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            }
        },
        [tabValue, splitOption, setGlobalChatMessages, setFactionChatMessages, setGlobalChatUnread, setFactionChatUnread],
    )

    useEffect(() => {
        if (!newMessage) return
        if (newMessage.m.type === "TEXT" && (newMessage.m.data as TextMessageData).from_user.id === userID) {
            saveUserStats(newMessage.m, !!newMessage.f)
            return
        }
        newMessageHandler(newMessage.m, newMessage.f)
        setNewMessage(undefined)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newMessage, userID])

    // Subscribe to global chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<ChatMessageType>(GameServerKeys.SubscribeGlobalChat, (m) => {
            if (!m) return
            setNewMessage({ f: null, m })
        })
    }, [state, subscribe])

    // Subscribe to faction chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || !factionID) return
        return subscribe<ChatMessageType>(GameServerKeys.SubscribeFactionChat, (m) => {
            if (!m) return
            setNewMessage({ f: "faction_id", m })
        })
    }, [userID, factionID, state, subscribe])

    // Subscribe to ban proposals
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !userID || !factionID) return
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
    }, [userID, factionID, state, subscribe])

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
