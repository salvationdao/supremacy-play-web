import { Box, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { ChatMessage, UserMultiplierMap } from "../.."
import { SvgScrolldown } from "../../../assets"
import { useGameServerWebsocket, usePassportServerAuth, WebSocketProperties } from "../../../containers"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { ChatData } from "../../../types/passport"

interface GlobalMessage {
    title: string
    games_until: number
    show_until: Date
    message: string
    duration: number
}

interface ChatMessagesProps {
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatData[]
    sentMessages: Date[]
    failedMessages: Date[]
    userMultiplierMap: UserMultiplierMap
    citizenPlayerIDs: string[]
}

export const ChatMessages = (props: ChatMessagesProps) => {
    const { state, subscribe } = useGameServerWebsocket()
    return <ChatMessagesInner {...props} state={state} subscribe={subscribe} />
}

interface ChatMessagesPropsInner extends ChatMessagesProps, Partial<WebSocketProperties> {}

const ChatMessagesInner = ({
    primaryColor,
    secondaryColor,
    chatMessages,
    sentMessages,
    failedMessages,
    state,
    subscribe,
    userMultiplierMap,
    citizenPlayerIDs,
}: ChatMessagesPropsInner) => {
    const { user } = usePassportServerAuth()
    const [autoScroll, setAutoScroll] = useState(true)
    const scrollableRef = useRef<HTMLDivElement>(null)

    // Subscribe to global messages
    const [globalMessage, setGlobalMessage] = useState<GlobalMessage>()
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe) return
        return subscribe<GlobalMessage>(
            GameServerKeys.SubGlobalAnnouncement,
            (payload: GlobalMessage) => {
                if (!payload || !payload.message) {
                    setGlobalMessage(undefined)
                    return
                }
                setGlobalMessage(payload)
            },
            null,
        )
    }, [state, subscribe])

    useLayoutEffect(() => {
        if (!autoScroll || !scrollableRef.current || chatMessages.length === 0) {
            return
        }
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [chatMessages, autoScroll])

    const onClickScrollToBottom = () => {
        if (!scrollableRef.current) return
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { currentTarget } = e
        const extraHeight = currentTarget.scrollHeight - currentTarget.offsetHeight
        const scrollUpTooMuch = currentTarget.scrollTop < extraHeight - 0.5 * currentTarget.offsetHeight

        // Enable autoscroll if they havent scroll more than half of the container
        if (autoScroll && scrollUpTooMuch) {
            setAutoScroll(false)
        } else if (!autoScroll && !scrollUpTooMuch) {
            setAutoScroll(true)
        }
    }

    return (
        <>
            {globalMessage && (
                <Box>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={0.3}
                        sx={{
                            px: 1.6,
                            py: 1.6,
                            backgroundColor: colors.red,
                            boxShadow: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: "center",
                                fontFamily: "Nostromo Regular Heavy",
                            }}
                        >
                            {globalMessage.title}
                        </Typography>

                        <Typography sx={{ textAlign: "center" }}>{globalMessage.message}</Typography>
                    </Stack>
                </Box>
            )}

            <Box
                id="chat-container"
                ref={scrollableRef}
                onScroll={scrollHandler}
                sx={{
                    flex: 1,
                    position: "relative",
                    my: 1,
                    mr: 0.8,
                    pl: 1.9,
                    pr: 2,
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    scrollBehavior: "smooth",
                    "::-webkit-scrollbar": {
                        width: 4,
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: primaryColor,
                        borderRadius: 3,
                    },
                }}
            >
                <Stack spacing={1.3} sx={{ mt: 1.1 }}>
                    {chatMessages && chatMessages.length > 0 ? (
                        chatMessages.map((c) => (
                            <ChatMessage
                                key={`${c.from_username} - ${c.sent_at.toISOString()}`}
                                chat={c}
                                isSent={c.from_user_id != user?.id ? true : sentMessages.includes(c.sent_at)}
                                isFailed={c.from_user_id != user?.id ? false : failedMessages.includes(c.sent_at)}
                                multiplierValue={userMultiplierMap[c.from_user_id]}
                                isCitizen={citizenPlayerIDs.some((cp) => cp === c.from_user_id)}
                            />
                        ))
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{
                                color: colors.grey,
                                textAlign: "center",
                                userSelect: "text",
                            }}
                        >
                            There are no messages yet.
                        </Typography>
                    )}
                </Stack>
            </Box>

            <Fade in={!autoScroll} timeout={2200} easing={{ exit: "cubic-bezier(0,.99,.28,1.01)" }}>
                <IconButton
                    size="small"
                    onClick={onClickScrollToBottom}
                    sx={{
                        position: "absolute",
                        bottom: 78,
                        right: 25,
                        backgroundColor: primaryColor,
                        boxShadow: 3,
                        ":hover": {
                            backgroundColor: primaryColor,
                            opacity: 0.7,
                        },
                    }}
                >
                    <SvgScrolldown size="18px" fill={secondaryColor} sx={{ p: 0 }} />
                </IconButton>
            </Fade>
        </>
    )
}
