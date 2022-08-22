import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useAuth, useGlobalNotifications } from "."
import { GlobalAnnouncementType } from "../components/RightDrawer/LiveChat/GlobalAnnouncement"
import { MESSAGES_BUFFER_SIZE } from "../constants"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BanProposalStruct, ChatMessageType, FontSizeType, IncomingMessages, SplitOptionType, TextMessageData, User } from "../types"

export const ChatContainer = createContainer(() => {
    const { sendBrowserNotification } = useGlobalNotifications()
    const { userID } = useAuth()
    const [isPoppedout, toggleIsPoppedout] = useToggle()

    // Tabs: 0 is global chat, 1 is faction chat
    const [tabValue, setTabValue] = useState(0)

    // Chat settings
    const [splitOption, setSplitOption] = useState<SplitOptionType>((localStorage.getItem("chatSplitOption") as SplitOptionType) || SplitOptionType.Tabbed)
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
    const [failedMessages, setFailedMessages] = useState<Date[]>([])

    //active users
    const [activePlayers, setActivePlayers] = useState<User[]>([])
    const [globalActivePlayers, setGlobalActivePlayers] = useState<User[]>([])

    const addToUserGidRecord = useCallback((user: User) => {
        setUserGidRecord((prev) => {
            return { ...prev, [user.gid]: user }
        })
    }, [])

    // Save chat settings to local storage
    useEffect(() => {
        localStorage.setItem("chatSplitOption", splitOption || "tabbed")
        localStorage.setItem("chatFilterSystemMessages", filterSystemMessages ? "true" : "false")
        localStorage.setItem("chatFontSize2", fontSize ? fontSize.toString() : "1")
    }, [splitOption, filterSystemMessages, fontSize])

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
        if (splitOption === SplitOptionType.Split) {
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
                if (tabValue !== 0 && !isPastMessages && splitOption === SplitOptionType.Tabbed) setGlobalChatUnread((prev) => prev + newMessagesCount)
                setGlobalChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = [...prev, ...newMessages]
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            } else {
                if (tabValue !== 1 && !isPastMessages && splitOption === SplitOptionType.Tabbed) setFactionChatUnread((prev) => prev + newMessagesCount)
                setFactionChatMessages((prev) => {
                    // Buffer the messages
                    const newArray = [...prev, ...newMessages]
                    return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
                })
            }
        },
        [userID, tabValue, splitOption],
    )

    const updateMessageHandler = useCallback(
        (updatedMessage: ChatMessageType, faction: string | null): boolean => {
            const genericUpdate = (chatMessages: ChatMessageType[], setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>) => {
                const updatedArr = [...chatMessages]
                const i = updatedArr.findIndex((m) => m.id === updatedMessage.id)
                if (i === -1) return false
                updatedArr[i] = updatedMessage
                setChatMessages(updatedArr)
                return true
            }

            //global chat
            if (!faction) {
                return genericUpdate(globalChatMessages, setGlobalChatMessages)
            }
            if (faction) {
                return genericUpdate(factionChatMessages, setFactionChatMessages)
            }
            return false
        },
        [globalChatMessages, factionChatMessages],
    )

    useEffect(() => {
        if (!incomingMessages || incomingMessages.messages.length <= 0) return

        let userStatMessage
        let isUpdate = false
        incomingMessages.messages.forEach((message) => {
            if (message.type === "TEXT") {
                isUpdate = updateMessageHandler(message, incomingMessages.faction)
                // This will attempt to look through the messages, if it's our own,
                // get the latest message and update userStats with it.
                if ((message.data as TextMessageData).from_user.id === userID) {
                    userStatMessage = message
                }
            }

            return message
        })

        setIncomingMessages(undefined)
        if (isUpdate) return
        if (userStatMessage) saveUserStats(userStatMessage, !!incomingMessages.faction)
        newMessageHandler(incomingMessages)
    }, [incomingMessages, newMessageHandler, saveUserStats, userID, updateMessageHandler])

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

            sendBrowserNotification(
                "Ban Proposal Initialized",
                `Reason: ${payload.reason}\nOn: ${payload.reported_player_username}\nFrom: ${payload.issued_by_username}`,
                10000,
            )
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
    useGameServerSubscription<User[]>(
        {
            URI: "/public/global_active_players",
            key: GameServerKeys.SubGlobalPlayerList,
        },
        (payload) => {
            if (!payload) return
            setGlobalActivePlayers(payload.sort((a, b) => a.username.localeCompare(b.username)))
        },
    )

    return {
        isPoppedout,
        toggleIsPoppedout,
        tabValue,
        setTabValue,
        newMessageHandler,
        splitOption,
        setSplitOption,
        filterSystemMessages,
        toggleFilterSystemMessages,
        globalChatMessages,
        factionChatMessages,
        factionChatUnread,
        globalChatUnread,
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
    }
})

export const ChatProvider = ChatContainer.Provider
export const useChat = ChatContainer.useContainer
