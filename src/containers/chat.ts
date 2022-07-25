import { useCallback, useEffect, useState, useRef } from "react"
import { useHistory, useLocation } from "react-router"
import { createContainer } from "unstated-next"
import { useAuth } from "."
import { SupremacyPNG } from "../assets"
import { GlobalAnnouncementType } from "../components/RightDrawer/LiveChat/GlobalAnnouncement"
import { MESSAGES_BUFFER_SIZE } from "../constants"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"
import { useGameServerSubscription, useGameServerSubscriptionFaction, useGameServerSubscriptionUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BanProposalStruct, BanUser, ChatMessageType, TextMessageData } from "../types/chat"
import { User } from "../types"

export interface IncomingMessages {
    faction: string | null
    messages: ChatMessageType[]
}

export type SplitOptionType = "tabbed" | "split" | null

export type FontSizeType = 0.8 | 1.2 | 1.35

export const ChatContainer = createContainer(() => {
    const { userID, user } = useAuth()
    const history = useHistory()
    const location = useLocation()
    const [isPoppedout, toggleIsPoppedout] = useToggle()

    // Tabs: 0 is global chat, 1 is faction chat
    const [tabValue, setTabValue] = useState(0)

    // Chat settings
    const [splitOption, setSplitOption] = useState<SplitOptionType>((localStorage.getItem("chatSplitOption") as SplitOptionType) || "tabbed")
    const [filterZerosGlobal, toggleFilterZerosGlobal] = useToggle(localStorage.getItem("chatFilterZerosGlobal") == "true")
    const [filterZerosFaction, toggleFilterZerosFaction] = useToggle(localStorage.getItem("chatFilterZerosFaction") == "true")
    const [filterSystemMessages, toggleFilterSystemMessages] = useToggle(localStorage.getItem("chatFilterSystemMessages") == "true")
    const [fontSize, setFontSize] = useState<FontSizeType>(parseString(localStorage.getItem("chatFontSize2"), 1.2) as FontSizeType)

    // Global announcement message
    const [globalAnnouncement, setGlobalAnnouncement] = useState<GlobalAnnouncementType>()

    // Chat states
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatMessageType[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatMessageType[]>([])
    const [factionChatUnread, setFactionChatUnread] = useState<number>(0)
    const [globalChatUnread, setGlobalChatUnread] = useState<number>(0)
    const [incomingMessages, setIncomingMessages] = useState<IncomingMessages>()
    const [userGidRecord, setUserGidRecord] = useState<{ [gid: number]: User }>({})

    const [banProposal, setBanProposal] = useState<BanProposalStruct>()

    // Store list of messages that were successfully sent or failed
    const [sentMessages, setSentMessages] = useState<Date[]>([])
    const [failedMessages, setFailedMessages] = useState<Date[]>([])

    //active users
    const [activePlayers, setActivePlayers] = useState<User[]>([])
    const [globalActivePlayers, setGlobalActivePlayers] = useState<User[]>([])

    const addToUserGidRecord = (user: User) => {
        setUserGidRecord((prev) => {
            return { ...prev, [user.gid]: user }
        })
    }

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
                const newArray = [...prev, sentAt]
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
    useGameServerSubscription<GlobalAnnouncementType>(
        {
            URI: "/public/global_announcement",
            key: GameServerKeys.SubGlobalAnnouncement,
        },
        (payload: GlobalAnnouncementType) => {
            if (!payload || !payload.message) {
                setGlobalAnnouncement(undefined)
                return
            }
            setGlobalAnnouncement(payload)
        },
    )

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

            const handler = (m: ChatMessageType) => {
                if (m.type === "TEXT" && (m.data as TextMessageData).from_user.id === userID && message.sent_at.getTime() - m.sent_at.getTime() < 5000) {
                    return { ...m, data: { ...m.data, ...newStats } }
                }
                return m
            }

            if (isFaction) {
                setFactionChatMessages((prev) => prev.map(handler))
            } else {
                setGlobalChatMessages((prev) => prev.map(handler))
            }
        },
        [userID, setGlobalChatMessages, setFactionChatMessages],
    )

    const newMessageHandler = useCallback(
        ({ messages, faction }: IncomingMessages) => {
            let newMessagesCount: number = 0
            let newMessages: ChatMessageType[] = []
            const isPastMessages = messages.length > 1

            messages.forEach((message) => {
                if (!message.locallySent && !isPastMessages && message.type === "TEXT" && (message.data as TextMessageData).from_user.id === userID) return
                newMessages = [...newMessages, message]
                if (message.type !== "NEW_BATTLE") newMessagesCount++
            })

            if (faction === null) {
                if (tabValue !== 0 && !isPastMessages && splitOption == "tabbed") setGlobalChatUnread((prev) => prev + newMessagesCount)
                setGlobalChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = [...prev, ...newMessages]
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            } else {
                if (tabValue !== 1 && !isPastMessages && splitOption == "tabbed") setFactionChatUnread((prev) => prev + newMessagesCount)
                setFactionChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = [...prev, ...newMessages]
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            }
        },
        [userID, tabValue, splitOption],
    )

    const readMessage = useCallback(
        (messageID: string) => {
            console.log("sdfkhjsdhjkf")
            if (tabValue === 0) {
                const newMessages = [...globalChatMessages]
                let index = -1
                const msgToRead = newMessages.find((el, i) => {
                    index = i
                    return el.id === messageID
                })
                if (!msgToRead) return
                const md = (msgToRead.data as TextMessageData).metadata
                if (md) {
                    md.tagged_users_read[user.gid] = true
                    newMessages[index] = msgToRead
                    console.log(newMessages)
                    setGlobalChatMessages(newMessages)
                }
            } else {
                console.log("todo")
            }
        },
        [globalChatMessages, user],
    )

    useEffect(() => {
        if (!incomingMessages || incomingMessages.messages.length <= 0) return

        let userStatMessage
        incomingMessages.messages.forEach((message) => {
            if (message.type === "TEXT" && (message.data as TextMessageData).from_user.id === userID) {
                // This will attempt to look through the messages, if it's our own,
                // get the latest message and update userStats with it.
                userStatMessage = message
            }

            return message
        })

        if (userStatMessage) saveUserStats(userStatMessage, !!incomingMessages.faction)
        newMessageHandler(incomingMessages)
        setIncomingMessages(undefined)
    }, [incomingMessages, newMessageHandler, saveUserStats, userID])

    // Subscribe to global chat messages
    useGameServerSubscription<ChatMessageType[]>(
        {
            URI: "/public/global_chat",
            key: GameServerKeys.SubscribeGlobalChat,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return
            setIncomingMessages({ faction: null, messages: payload })
        },
    )

    // Subscribe to faction chat messages
    useGameServerSubscriptionFaction<ChatMessageType[]>(
        {
            URI: "/faction_chat",
            key: GameServerKeys.SubscribeFactionChat,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return
            setIncomingMessages({ faction: "faction_id", messages: payload })
        },
    )

    // Subscribe to ban proposals
    useGameServerSubscriptionFaction<BanProposalStruct>(
        {
            URI: "/punish_vote",
            key: GameServerKeys.SubBanProposals,
        },
        (payload) => {
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
        },
    )

    //subscribe active faction users
    useGameServerSubscriptionFaction<User[]>(
        {
            URI: "",
            key: GameServerKeys.SubPlayerList,
        },
        (payload) => {
            if (!payload) return
            setActivePlayers(payload.sort((a, b) => a.username.localeCompare(b.username)))
        },
    )

    //subscribe active global users
    useGameServerSubscriptionUser<User[]>(
        {
            URI: "",
            key: GameServerKeys.SubGlobalPlayerList,
        },
        (payload) => {
            if (!payload) return
            setGlobalActivePlayers(payload.sort((a, b) => a.username.localeCompare(b.username)))
        },
    )

    // Close right drawer when chat is popped out
    useEffect(() => {
        if (isPoppedout) {
            history.replace(location.pathname)
        }
    }, [history, isPoppedout, location.pathname])

    return {
        isPoppedout,
        toggleIsPoppedout,
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
        globalChatMessages,
        factionChatMessages,
        factionChatUnread,
        globalChatUnread,
        onSentMessage,
        sentMessages,
        failedMessages,
        onFailedMessage,
        fontSize,
        setFontSize,
        globalAnnouncement,
        banProposal,
        userGidRecord,
        addToUserGidRecord,
        activePlayers,
        globalActivePlayers,
        readMessage,
    }
})

export const ChatProvider = ChatContainer.Provider
export const useChat = ChatContainer.useContainer
