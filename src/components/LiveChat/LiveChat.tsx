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
import { useDrawer, usePassportServerAuth, usePassportServerWebsocket } from "../../containers"
import { acronym, shadeColor } from "../../helpers"
import { PassportServerKeys } from "../../keys"
import { colors } from "../../theme/theme"
import { ChatData } from "../../types/passport"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"

const DrawerContent = ({
    tabValue,
    setTabValue,
    chatMessages,
    onNewMessage,
    factionUnread,
    globalUnread,
}: {
    globalUnread: number
    factionUnread: number
    tabValue: number
    setTabValue: Dispatch<SetStateAction<number>>
    chatMessages: ChatData[]
    onNewMessage: (newMessage: ChatData, faction_id: string | null) => void
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
                            <Badge badgeContent={globalUnread} color="primary">
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
                                <Badge badgeContent={factionUnread} color="primary">
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
                sentMessages={sentMessages}
                failedMessages={failedMessages}
            />

            {user ? (
                <ChatSend
                    primaryColor={primaryColor}
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
    const { state, subscribe } = usePassportServerWebsocket()

    // Tabs: 0 is global chat, 1 is faction chat
    const [tabValue, setTabValue] = useState(0)
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatData[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatData[]>([])
    const [factionChatUnread, setFactionChatUnread] = useState<number>(0)
    const [globalChatUnread, setGlobalChatUnread] = useState<number>(0)

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

    useEffect(() => {
        if (tabValue === 1 && factionChatUnread !== 0) {
            setFactionChatUnread(0)
        }
        if (tabValue === 0 && globalChatUnread !== 0) {
            setGlobalChatUnread(0)
        }
    }, [tabValue, factionChatUnread])
    // Subscribe to global chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        return subscribe<ChatData>(PassportServerKeys.SubscribeGlobalChat, (m) => {
            if (!m || m.from_user_id === user?.id) return
            newMessageHandler(m, null)
            setGlobalChatUnread(globalChatUnread + 1)
        })
    }, [state, user, subscribe, globalChatUnread])

    // Subscribe to faction chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        if (!user || !user.faction_id || !user.faction) {
            return
        }
        return subscribe<ChatData>(PassportServerKeys.SubscribeFactionChat, (m) => {
            if (!m || m.from_user_id === user?.id) return
            newMessageHandler(m, m.from_user_id)
            setFactionChatUnread(factionChatUnread + 1)
        })
    }, [user, state, subscribe, factionChatUnread])

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
                    factionUnread={factionChatUnread}
                    globalUnread={globalChatUnread}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                    chatMessages={tabValue == 0 ? globalChatMessages : factionChatMessages}
                    onNewMessage={newMessageHandler}
                />
            </Stack>
        </Drawer>
    )
}
