import { Box, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useLayoutEffect, useRef, useState } from "react"
import { ChatMessage } from "../.."
import { SvgScrolldown } from "../../../assets"
import { useAuth } from "../../../containers"
import { colors } from "../../../theme"
import { ChatData } from "../../../types"

export const ChatMessages = ({
    primaryColor,
    chatMessages,
    sentMessages,
    failedMessages,
}: {
    primaryColor: string
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
        const scrollHeight = currentTarget.scrollHeight - currentTarget.offsetHeight

        // Check whether auto scroll can be enabled
        if (autoScroll && currentTarget.scrollTop < scrollHeight) {
            setAutoScroll(false)
        } else if (!autoScroll && currentTarget.scrollTop === scrollHeight) {
            setAutoScroll(true)
        }
    }

    return (
        <>
            <Box
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

            <Fade in={!autoScroll} timeout={2000}>
                <IconButton
                    size="small"
                    onClick={onClickScrollToBottom}
                    sx={{
                        position: "absolute",
                        bottom: 78,
                        right: 25,
                        backgroundColor: primaryColor,
                        ":hover": {
                            backgroundColor: primaryColor,
                            opacity: 0.7,
                        },
                    }}
                >
                    <SvgScrolldown size="18px" sx={{ p: 0 }} />
                </IconButton>
            </Fade>
        </>
    )
}
