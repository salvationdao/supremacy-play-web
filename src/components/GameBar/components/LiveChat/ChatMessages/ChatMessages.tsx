import { Box, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useLayoutEffect, useRef, useState } from "react"
import { ChatMessage } from "../.."
import { SvgScrolldown } from "../../../assets"
import { useAuth } from "../../../containers"
import { colors } from "../../../theme"
import { ChatData } from "../../../types"

export const ChatMessages = ({
    primaryColor,
    secondaryColor,
    chatMessages,
    sentMessages,
    failedMessages,
}: {
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatData[]
    sentMessages: Date[]
    failedMessages: Date[]
}) => {
    const { user } = useAuth()
    const [autoScroll, setAutoScroll] = useState(true)
    const scrollableRef = useRef<HTMLDivElement>(null)

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
                                key={`${c.fromUsername} - ${c.sentAt.toISOString()}`}
                                chat={c}
                                isSent={c.fromUserID != user?.id ? true : sentMessages.includes(c.sentAt)}
                                isFailed={c.fromUserID != user?.id ? false : failedMessages.includes(c.sentAt)}
                            />
                        ))
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{
                                color: colors.grey,
                                textAlign: "center",
                                fontFamily: "Share Tech",
                                fontSize: "0.8rem",
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
