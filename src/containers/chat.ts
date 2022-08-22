import { useCallback, useEffect, useRef, useState } from "react"
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
    const [incomingMessages, setIncomingMessages] = useState<IncomingMessages>()
    const globalChatMessages = useRef<ChatMessageType[]>([])
    const factionChatMessages = useRef<ChatMessageType[]>([])
    const userGidRecord = useRef<{ [gid: number]: User }>({})
    const globalChatUnread = useRef<number>(0)
    const factionChatUnread = useRef<number>(0)
    // Store list of messages that were successfully sent or failed
    const failedMessages = useRef<string[]>([])

    const [banProposal, setBanProposal] = useState<BanProposalStruct>()

    //active users
    const [activePlayers, setActivePlayers] = useState<User[]>([])
    const [globalActivePlayers, setGlobalActivePlayers] = useState<User[]>([])

    // Save chat settings to local storage
    useEffect(() => {
        localStorage.setItem("chatSplitOption", splitOption || "tabbed")
        localStorage.setItem("chatFilterSystemMessages", filterSystemMessages ? "true" : "false")
        localStorage.setItem("chatFontSize2", fontSize ? fontSize.toString() : "1")
    }, [splitOption, filterSystemMessages, fontSize])

    const addToUserGidRecord = useCallback((user: User) => {
        userGidRecord.current = { ...userGidRecord.current, [user.gid]: user }
    }, [])

    const onFailedMessage = useCallback((id: string) => {
        const newArray = failedMessages.current.concat(id)
        failedMessages.current = newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
    }, [])

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
            globalChatUnread.current = 0
            factionChatUnread.current = 0
            return
        }

        if (tabValue === 1 && factionChatUnread.current !== 0) {
            factionChatUnread.current = 0
        }
        if (tabValue === 0 && globalChatUnread.current !== 0) {
            globalChatUnread.current = 0
        }
    }, [tabValue, splitOption])

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
                if (tabValue !== 0 && !isPastMessages && splitOption === SplitOptionType.Tabbed) {
                    globalChatUnread.current += newMessagesCount
                }

                const newArray = [...globalChatMessages.current, ...newMessages]
                globalChatMessages.current = newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
            } else {
                if (tabValue !== 1 && !isPastMessages && splitOption === SplitOptionType.Tabbed) {
                    factionChatUnread.current += newMessagesCount
                }

                const newArray = [...factionChatMessages.current, ...newMessages]
                factionChatMessages.current = newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
            }
        },
        [userID, tabValue, splitOption],
    )

    const updateMessageHandler = useCallback(
        (updatedMessage: ChatMessageType, faction: string | null): boolean => {
            const genericUpdate = (globalChatMessages: React.MutableRefObject<ChatMessageType[]>) => {
                const updatedArr = [...globalChatMessages.current]
                const i = updatedArr.findIndex((m) => m.id === updatedMessage.id)
                if (i === -1) return false
                updatedArr[i] = updatedMessage
                globalChatMessages.current = updatedArr
                return true
            }

            //global chat
            if (!faction) {
                return genericUpdate(globalChatMessages)
            }
            if (faction) {
                return genericUpdate(factionChatMessages)
            }
            return false
        },
        [globalChatMessages, factionChatMessages],
    )

    useEffect(() => {
        if (!incomingMessages || incomingMessages.messages.length <= 0) return

        let isUpdate = false
        incomingMessages.messages.forEach((message) => {
            if (message.type === "TEXT") {
                isUpdate = updateMessageHandler(message, incomingMessages.faction)
            }

            return message
        })

        setIncomingMessages(undefined)
        if (isUpdate) return
        newMessageHandler(incomingMessages)
    }, [incomingMessages, newMessageHandler, userID, updateMessageHandler])

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
