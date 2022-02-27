import { Box, Drawer, Stack, Tab, Tabs, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import LanguageIcon from "@mui/icons-material/Language"
import { SvgGlobal } from "../../assets"
import { DRAWER_TRANSITION_DURATION, LIVE_CHAT_DRAWER_WIDTH, MESSAGES_BUFFER_SIZE } from "../../constants"
import { useAuth, useDrawer, useWebsocket } from "../../containers"
import { colors } from "../../theme"
import { ChatData, ChatStreamType } from "../../types"
import { ChatMessages } from "./ChatMessages/ChatMessages"
import { ChatSend } from "./ChatSend/ChatSend"
import { DrawerButtons } from "../DrawerButtons"
import HubKey from "../../keys"
import { acronym } from "../../../../helpers"
import { PASSPORT_SERVER_HOST_IMAGES } from "../../../../constants"

const DrawerContent = ({
    passportWeb,
    selectedChatStream,
    setSelectedChatStream,
    chatMessages,
    onNewMessage,
}: {
    passportWeb: string
    selectedChatStream: ChatStreamType
    setSelectedChatStream: Dispatch<SetStateAction<ChatStreamType>>
    chatMessages: ChatData[]
    onNewMessage: (newMessage: ChatData, factionID: string | null) => void
}) => {
    const { user } = useAuth()
    // Store list of messages that were successfully sent or failed
    const [sentMessages, setSentMessages] = useState<Date[]>([])
    const [failedMessages, setFailedMessages] = useState<Date[]>([])

    const [value, setValue] = useState(0)

    const onSentMessage = (sentAt: Date) => {
        setSentMessages((prev) => {
            // Buffer the array
            const newArray = prev.concat(sentAt)
            return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
        })
    }

    useEffect(() => {
        setSelectedChatStream(value === 0 ? "GLOBAL" : "FACTION")
    }, [value])

    const onFailedMessage = (sentAt: Date) => {
        setFailedMessages((prev) => {
            // Buffer the array
            const newArray = prev.concat(sentAt)
            return newArray.slice(newArray.length - MESSAGES_BUFFER_SIZE, newArray.length)
        })
    }

    const isEnlisted = user && user.factionID && user.faction
    let factionID
    let primaryColor
    let secondaryColor
    let bannerTitle
    let bannerBackgroundColor
    let bannerLogo

    if (selectedChatStream == "GLOBAL") {
        factionID = null
        primaryColor = colors.globalChat
        secondaryColor = colors.text
        bannerTitle = "GLOBAL LIVE CHAT"
        bannerBackgroundColor = colors.globalChat
        bannerLogo = <SvgGlobal size="23px" fill={colors.text} />
    } else if (selectedChatStream == "FACTION" && isEnlisted) {
        factionID = user.factionID
        primaryColor = user.faction.theme.primary
        secondaryColor = user.faction.theme.secondary
        bannerTitle = user.faction.label
        bannerBackgroundColor = `${primaryColor}65`
    } else {
        return null
    }
    let label = ""
    if (isEnlisted) {
        label = user.faction.label
        if (label.length > 8) {
            label = acronym(label)
        }
        label += " CHAT"
    }

    return (
        <Stack sx={{ flex: 1 }}>
            <Tabs
                value={value}
                variant="fullWidth"
                sx={{
                    ".MuiTabs-flexContainer": {
                        background: bannerBackgroundColor,
                    },
                }}
                onChange={(event, newValue) => {
                    setValue(newValue)
                }}
            >
                <Tab icon={<LanguageIcon fontSize={"large"} />} label="GLOBAL CHAT" />
                {isEnlisted && (
                    <Tab
                        icon={
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    flexShrink: 0,
                                    backgroundImage: `url(${PASSPORT_SERVER_HOST_IMAGES}/api/files/${user.faction.logoBlobID})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "contain",
                                }}
                            />
                        }
                        label={label}
                    />
                )}
            </Tabs>

            <ChatMessages
                primaryColor={primaryColor}
                chatMessages={chatMessages}
                passportWeb={passportWeb}
                sentMessages={sentMessages}
                failedMessages={failedMessages}
            />

            {user ? (
                <ChatSend
                    primaryColor={primaryColor}
                    factionID={factionID}
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
                            fontFamily: "Share Tech",
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

export const LiveChat = ({ passportWeb }: { passportWeb: string }) => {
    const { isLiveChatOpen } = useDrawer()
    const { user } = useAuth()
    const { state, subscribe } = useWebsocket()

    const [selectedChatStream, setSelectedChatStream] = useState<ChatStreamType>("GLOBAL")
    const [globalChatMessages, setGlobalChatMessages] = useState<ChatData[]>([])
    const [factionChatMessages, setFactionChatMessages] = useState<ChatData[]>([])

    const newMessageHandler = (message: ChatData, factionID: string | null) => {
        if (factionID === null) {
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

    // Subscribe to global chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        return subscribe<ChatData>(HubKey.SubscribeGlobalChat, (m) => {
            if (!m || m.fromUserID === user?.id) return
            newMessageHandler(m, null)
        })
    }, [state, user, subscribe])

    // Subscribe to faction chat messages
    useEffect(() => {
        if (state !== WebSocket.OPEN) return
        if (!user || !user.factionID || !user.faction) {
            return
        }
        return subscribe<ChatData>(HubKey.SubscribeFactionChat, (m) => {
            if (!m || m.fromUserID === user?.id) return
            newMessageHandler(m, m.fromUserID)
        })
    }, [user, state, subscribe])

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
                        selectedChatStream == "FACTION" && user && user.faction
                            ? `${user?.faction.theme.primary}06`
                            : `${colors.globalChat}13`,
                }}
            >
                <DrawerButtons isFixed={false} />

                <DrawerContent
                    passportWeb={passportWeb}
                    selectedChatStream={selectedChatStream}
                    setSelectedChatStream={setSelectedChatStream}
                    chatMessages={selectedChatStream == "GLOBAL" ? globalChatMessages : factionChatMessages}
                    onNewMessage={newMessageHandler}
                />
            </Stack>
        </Drawer>
    )
}
