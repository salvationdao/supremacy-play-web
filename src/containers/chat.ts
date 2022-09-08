import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useGlobalNotifications } from "."
import { GlobalAnnouncementType } from "../components/RightDrawer/LiveChat/GlobalAnnouncement"
import { MESSAGES_BUFFER_SIZE } from "../constants"
import { parseString } from "../helpers"
import { useToggle } from "../hooks"
import { useGameServerSubscription, useGameServerSubscriptionFaction } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { BanProposalStruct, ChatMessage, ChatMessageType, FontSizeType, IncomingMessage, SplitOptionType, User } from "../types"

export const ChatContainer = createContainer(() => {
    const { sendBrowserNotification } = useGlobalNotifications()
    const [isPoppedout, setIsPoppedout] = useState(false)

    // Chat settings
    const [tabValue, setTabValue] = useState(0) // 0 is global chat, 1 is faction chat
    const [splitOption, setSplitOption] = useState<SplitOptionType>((localStorage.getItem("chatSplitOption") as SplitOptionType) || SplitOptionType.Tabbed)
    const [onlyShowSystemMessages, toggleOnlyShowSystemMessages] = useToggle(localStorage.getItem("chatOnlyShowSystemMessages") == "true")
    const [fontSize, setFontSize] = useState<FontSizeType>(parseString(localStorage.getItem("chatFontSize2"), 1.2) as FontSizeType)

    // Global announcement message
    const [globalAnnouncement, setGlobalAnnouncement] = useState<GlobalAnnouncementType>()
    const [banProposal, setBanProposal] = useState<BanProposalStruct>()

    // Chat states
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatMessage[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatMessage[]>([])
    const [globalChatUnread, setGlobalChatUnread] = useState<number>(0)
    const [factionChatUnread, setFactionChatUnread] = useState<number>(0)
    // Store list of messages that were successfully sent or failed
    const [failedMessages, setFailedMessages] = useState<string[]>([])
    const userGidRecord = useRef<{ [gid: number]: User }>({})

    // Active users
    const [activePlayers, setActivePlayers] = useState<User[]>([])
    const [globalActivePlayers, setGlobalActivePlayers] = useState<User[]>([])

    // Click to tag a user
    const [clickedOnUser, setClickedOnUser] = useState<User>()

    // Save chat settings to local storage
    useEffect(() => {
        localStorage.setItem("chatSplitOption", splitOption || SplitOptionType.Tabbed)
        localStorage.setItem("chatOnlyShowSystemMessages", onlyShowSystemMessages ? "true" : "false")
        localStorage.setItem("chatFontSize2", fontSize ? fontSize.toString() : "1")
    }, [splitOption, onlyShowSystemMessages, fontSize])

    const addToUserGidRecord = useCallback((user: User) => {
        userGidRecord.current = { ...userGidRecord.current, [user.gid]: user }
    }, [])

    const onFailedMessage = useCallback(
        (id: string) => {
            setFailedMessages((prev) => {
                // Buffer the array
                const newArray = prev.concat(id)
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

    // Logic to reset unread count when chat layout changes
    useEffect(() => {
        if (splitOption === SplitOptionType.Split) {
            setGlobalChatUnread(0)
            setFactionChatUnread(0)
        }
    }, [splitOption])

    // Logic to reset unread count when chat layout changes
    const changeTab = useCallback((newTabValue: number) => {
        setTabValue((prev) => {
            if (prev === 0) {
                setGlobalChatUnread(0)
            } else if (prev === 1) {
                setFactionChatUnread(0)
            }

            return newTabValue
        })
    }, [])

    const handleIncomingMessage = useCallback((incomingMessage: IncomingMessage) => {
        if (!incomingMessage || incomingMessage.messages.length <= 0) return
        const handleMessagesSetState = incomingMessage.faction ? setFactionChatMessages : setGlobalChatMessages
        const handleCounterSetState = incomingMessage.faction ? setFactionChatUnread : setGlobalChatUnread

        handleMessagesSetState((prev) => {
            const oldMessages = [...prev]
            const newMessages: ChatMessage[] = []
            let newMessagesCount = 0

            // If the message is an existing one, update it in the array
            incomingMessage.messages.forEach((m) => {
                const message = { ...m, received_at: new Date() }
                const existingMessageIndex = oldMessages.findIndex((m) => m.id === message.id)
                if (existingMessageIndex > 0) {
                    oldMessages[existingMessageIndex] = message
                } else {
                    // Increment count for unread counter
                    if (message.type !== ChatMessageType.NewBattle) newMessagesCount++
                    newMessages.push(message)
                }
            })

            // We assume if back end sends us multiple messages, its the message history, dont update unread counter
            const isPastMessages = newMessages.length > 1
            if (!isPastMessages) {
                handleCounterSetState((prev) => prev + newMessagesCount)
            }

            // Buffer the results to be no more than X messages
            const finalArray = [...oldMessages, ...newMessages]
            return finalArray.slice(finalArray.length - MESSAGES_BUFFER_SIZE, finalArray.length)
        })
    }, [])

    // Subscribe to global chat messages
    useGameServerSubscription<ChatMessage[]>(
        {
            URI: "/public/global_chat",
            key: GameServerKeys.SubscribeGlobalChat,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return
            handleIncomingMessage({ faction: null, messages: payload })
        },
    )

    // Subscribe to faction chat messages
    useGameServerSubscriptionFaction<ChatMessage[]>(
        {
            URI: "/faction_chat",
            key: GameServerKeys.SubscribeFactionChat,
        },
        (payload) => {
            if (!payload || payload.length <= 0) return
            handleIncomingMessage({ faction: "something", messages: payload })
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

            sendBrowserNotification.current(
                "Ban Proposal Initialized",
                `Reason: ${payload.reason}\nOn: ${payload.reported_player_username}\nFrom: ${payload.issued_by_username}`,
                10000,
            )
        },
    )

    // Subscribe active faction users
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

    // Subscribe active global users
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
        setIsPoppedout,
        tabValue,
        changeTab,
        splitOption,
        setSplitOption,
        onlyShowSystemMessages,
        toggleOnlyShowSystemMessages,
        handleIncomingMessage,
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
        clickedOnUser,
        setClickedOnUser,
    }
})

export const ChatProvider = ChatContainer.Provider
export const useChat = ChatContainer.useContainer
