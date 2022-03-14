import { Badge, Box, Drawer, Stack, Tab, Tabs, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { DrawerButtons } from ".."
import { SvgGlobal } from "../../assets"
import {
    DRAWER_TRANSITION_DURATION,
    GAME_BAR_HEIGHT,
    LIVE_CHAT_DRAWER_WIDTH,
    MESSAGES_BUFFER_SIZE,
    PASSPORT_SERVER_HOST_IMAGES,
} from "../../constants"
import { useDrawer, useGameServerWebsocket, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { acronym, shadeColor } from "../../helpers"
import { GameServerKeys, PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { ChatData } from "../../types/passport"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"

export interface UserMultiplier {
    player_id: string
    total_multiplier: string
}

export interface UserMultiplierMap {
    [player_id: string]: string
}

export interface UserMultiplierResponse {
    multipliers: UserMultiplier[]
    citizen_player_ids: string[]
}

export interface SentChatMessageData {
    global: Date[]
    faction: Date[]
}

const DrawerContent = ({
    tabValue,
    setTabValue,
    chatMessages,
    onNewMessage,
    initialSentDate,
    initialMessageColor,
    factionChatUnread,
    globalChatUnread,
    userMultiplierMap,
    citizenPlayerIDs,
}: {
    globalChatUnread: number
    factionChatUnread: number
    tabValue: number
    initialSentDate: SentChatMessageData
    initialMessageColor?: string
    setTabValue: Dispatch<SetStateAction<number>>
    chatMessages: ChatData[]
    onNewMessage: (newMessage: ChatData, faction_id: string | null) => void
    userMultiplierMap: UserMultiplierMap
    citizenPlayerIDs: string[]
}) => {
    const { user } = usePassportServerAuth()
    // Store list of messages that were successfully sent or failed
    const [sentMessages, setSentMessages] = useState<Date[]>([])
    const [failedMessages, setFailedMessages] = useState<Date[]>([])

    const onSentMessage = (sentAt: Date) => {
        setSentMessages((prev) => {
            // Buffer the array
            const newArray = prev.concat(sentAt)
            return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
        })
    }

    const onFailedMessage = (sentAt: Date) => {
        setFailedMessages((prev) => {
            // Buffer the array
            const newArray = prev.concat(sentAt)
            return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
        })
    }

    const isEnlisted = user && user.faction_id && user.faction
    let faction_id
    let primaryColor
    let secondaryColor
    let bannerBackgroundColor

    if (tabValue == 0) {
        faction_id = null
        primaryColor = colors.globalChat
        secondaryColor = "#FFFFFF"
        bannerBackgroundColor = shadeColor(colors.globalChat, -30)
    } else if (tabValue == 1 && isEnlisted) {
        faction_id = user.faction_id
        primaryColor = user.faction.theme.primary
        secondaryColor = user.faction.theme.secondary
        bannerBackgroundColor = `${primaryColor}25`
    } else {
        return null
    }

    let factionTabLabel = ""
    if (isEnlisted) {
        factionTabLabel = user.faction.label
        if (factionTabLabel.length > 8) factionTabLabel = acronym(factionTabLabel)
        factionTabLabel += " CHAT"
    }

    return (
        <Stack sx={{ flex: 1 }}>
            <Tabs
                value={tabValue}
                variant="fullWidth"
                sx={{
                    height: GAME_BAR_HEIGHT,
                    background: bannerBackgroundColor,
                    ".MuiButtonBase-root": {
                        height: GAME_BAR_HEIGHT,
                    },
                    ".MuiTabs-indicator": {
                        height: "3px",
                        background: "#FFFFFF50",
                    },
                }}
                onChange={(event, newValue) => {
                    setTabValue(newValue)
                }}
            >
                <Tab
                    label={
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.2}>
                            <Badge
                                badgeContent={globalChatUnread}
                                sx={{ ".MuiBadge-badge": { color: "#FFFFFF", backgroundColor: colors.red } }}
                            >
                                <SvgGlobal size="20px" />
                            </Badge>
                            <Typography
                                variant="caption"
                                sx={{
                                    lineHeight: 1,
                                    fontFamily: "Nostromo Regular Black",
                                }}
                            >
                                GLOBAL CHAT
                            </Typography>
                        </Stack>
                    }
                />
                {isEnlisted && (
                    <Tab
                        label={
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.2}>
                                <Badge
                                    badgeContent={factionChatUnread}
                                    sx={{ ".MuiBadge-badge": { color: "#FFFFFF", backgroundColor: colors.red } }}
                                >
                                    <Box
                                        sx={{
                                            width: 21,
                                            height: 21,
                                            flexShrink: 0,
                                            mb: 0.2,
                                            backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logo_blob_id})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "center",
                                            backgroundSize: "contain",
                                            backgroundColor: user.faction.theme.primary,
                                            borderRadius: 0.5,
                                            border: `${user.faction.theme.primary} solid 1px`,
                                        }}
                                    />
                                </Badge>
                                <Typography
                                    variant="caption"
                                    sx={{ lineHeight: 1, fontFamily: "Nostromo Regular Black" }}
                                >
                                    {factionTabLabel}
                                </Typography>
                            </Stack>
                        }
                    />
                )}
            </Tabs>

            <ChatMessages
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                chatMessages={chatMessages}
                sentMessages={sentMessages.concat(initialSentDate.global, initialSentDate.faction)}
                failedMessages={failedMessages}
                userMultiplierMap={userMultiplierMap}
                citizenPlayerIDs={citizenPlayerIDs}
            />

            {user ? (
                <ChatSend
                    primaryColor={primaryColor}
                    initialMessageColor={initialMessageColor}
                    faction_id={faction_id}
                    onNewMessage={onNewMessage}
                    onSentMessage={onSentMessage}
                    onFailedMessage={onFailedMessage}
                />
            ) : (
                <Box sx={{ px: 2, py: 0.5, backgroundColor: colors.red }}>
                    <Typography
                        sx={{
                            textAlign: "center",
                            lineHeight: 1,
                            fontSize: (theme) => theme.typography.pxToRem(15),
                        }}
                    >
                        You must be signed in to send messages.
                    </Typography>
                </Box>
            )}
        </Stack>
    )
}

export const LiveChat = () => {
    const { isLiveChatOpen } = useDrawer()
    const { user } = usePassportServerAuth()
    const { state, subscribe, send } = usePassportServerWebsocket()
    const { state: gsState, subscribe: gsSubscribe } = useGameServerWebsocket()

    // Tabs: 0 is global chat, 1 is faction chat
    const [tabValue, setTabValue] = useState(0)

    const [initialSentDate, setInitialSentDate] = useState<SentChatMessageData>({ global: [], faction: [] })
    const [initialMessageColor, setInitialMessageColor] = useState<string>()
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatData[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatData[]>([])
    const [factionChatUnread, setFactionChatUnread] = useState<number>(0)
    const [globalChatUnread, setGlobalChatUnread] = useState<number>(0)
    const [userMultiplierMap, setUserMultiplierMap] = useState<UserMultiplierMap>({})
    const [citizenPlayerIDs, setCitizenPlayerIDs] = useState<string[]>([])

    const newMessageHandler = (message: ChatData, faction_id: string | null) => {
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
    }

    // Collect Past Messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        send<ChatData[]>(PassportServerKeys.ChatPastMessages).then((resp) => {
            setGlobalChatMessages(resp)
            setInitialSentDate((prev) => ({
                ...prev,
                global: resp.map((m) => m.sent_at),
            }))
        })
    }, [state, send])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !user || !user.faction_id || !user.faction) return
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
    }, [state, user, send])

    useEffect(() => {
        if (tabValue === 1 && factionChatUnread !== 0) {
            setFactionChatUnread(0)
        }
        if (tabValue === 0 && globalChatUnread !== 0) {
            setGlobalChatUnread(0)
        }
    }, [tabValue, factionChatUnread])

    // subscribe to the chat
    useEffect(() => {
        if (gsState !== WebSocket.OPEN) return
        return gsSubscribe<UserMultiplierResponse>(GameServerKeys.SubscribeMultiplierMap, (payload) => {
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

    // Subscribe to global chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        return subscribe<ChatData>(PassportServerKeys.SubscribeGlobalChat, (m) => {
            if (!m || m.from_user_id === user?.id) return
            newMessageHandler(m, null)
            if (tabValue !== 0) setGlobalChatUnread(globalChatUnread + 1)
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
            if (tabValue !== 1) setFactionChatUnread(factionChatUnread + 1)
        })
    }, [user, state, subscribe, tabValue, factionChatUnread])

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isLiveChatOpen}
            variant="persistent"
            anchor="right"
            sx={{
                width: LIVE_CHAT_DRAWER_WIDTH,
                flexShrink: 0,
                zIndex: 9999,
                "& .MuiDrawer-paper": {
                    width: LIVE_CHAT_DRAWER_WIDTH,
                    backgroundColor: colors.darkNavy,
                },
            }}
        >
            <Stack
                direction="row"
                sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor:
                        tabValue == 1 && user && user.faction
                            ? `${user?.faction.theme.primary}06`
                            : `${colors.globalChat}13`,
                }}
            >
                <DrawerButtons isFixed={false} />

                <DrawerContent
                    factionChatUnread={factionChatUnread}
                    globalChatUnread={globalChatUnread}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                    initialSentDate={initialSentDate}
                    initialMessageColor={initialMessageColor}
                    chatMessages={tabValue == 0 ? globalChatMessages : factionChatMessages}
                    onNewMessage={newMessageHandler}
                    userMultiplierMap={userMultiplierMap}
                    citizenPlayerIDs={citizenPlayerIDs}
                />
            </Stack>
        </Drawer>
    )
}
