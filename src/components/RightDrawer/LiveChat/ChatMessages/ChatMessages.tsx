import { Box, IconButton, Stack, Typography } from "@mui/material"
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { PunishMessage, TextMessage } from "../../.."
import { SvgScrolldown } from "../../../../assets"
import { useAuth, useChat } from "../../../../containers"
import { colors } from "../../../../theme/theme"
import { ChatMessageType, NewBattleMessageData, PunishMessageData, SplitOptionType, SystemBanMessageData } from "../../../../types"
import { BanProposal } from "../BanProposal/BanProposal"
import { GlobalAnnouncement } from "../GlobalAnnouncement"
import { NewBattleMessage } from "./MessageTypes/NewBattleMessage"
import { SystemBanMessage } from "./MessageTypes/SystemBanMessage"

interface ChatMessagesProps {
    primaryColor: string
    secondaryColor: string
    faction_id: string | null
}

export const ChatMessages = React.memo(function ChatMessages({ faction_id, primaryColor, secondaryColor }: ChatMessagesProps) {
    const { userID } = useAuth()
    const { splitOption, fontSize, globalAnnouncement, globalChatMessages, factionChatMessages, onlyShowSystemMessages } = useChat()
    const [autoScroll, setAutoScroll] = useState(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const chatMessages = useMemo(() => (faction_id ? factionChatMessages : globalChatMessages), [faction_id, factionChatMessages, globalChatMessages])
    const latestMessage = useMemo(() => chatMessages[chatMessages.length - 1], [chatMessages])

    // Scroll related stuff
    const [isScrolling, setIsScrolling] = useState(false)
    const scrollableRef = useRef<HTMLDivElement>(null)
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

    // Scroll related stuff
    useLayoutEffect(() => {
        // Auto scroll to the bottom if enabled, has messages and user login/logout state changed
        if (!autoScroll || !scrollableRef.current || chatMessages.length === 0) {
            return
        }
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [chatMessages, autoScroll, userID])

    // Scroll related stuff
    const onClickScrollToBottom = useCallback(() => {
        if (!scrollableRef.current) return
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [])

    // Scroll related stuff
    const scrollHandler = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            scrollTimeout.current && clearTimeout(scrollTimeout.current)
            setIsScrolling(true)

            const { currentTarget } = e
            const extraHeight = currentTarget.scrollHeight - currentTarget.offsetHeight
            const scrollUpTooMuch = currentTarget.scrollTop < extraHeight - 0.5 * currentTarget.offsetHeight

            // Enable autoscroll if they haven't scroll more than half of the container
            if (autoScroll && scrollUpTooMuch) {
                setAutoScroll(false)
            } else if (!autoScroll && !scrollUpTooMuch) {
                setAutoScroll(true)
            }

            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false)
                scrollTimeout.current && clearTimeout(scrollTimeout.current)
            }, 300)
        },
        [autoScroll],
    )

    return useMemo(
        () => (
            <>
                {globalAnnouncement && (splitOption === SplitOptionType.Tabbed || (splitOption === SplitOptionType.Split && faction_id == null)) && (
                    <GlobalAnnouncement globalAnnouncement={globalAnnouncement} />
                )}

                {faction_id != null && <BanProposal />}

                <Box
                    id="chat-container"
                    ref={scrollableRef}
                    onScroll={scrollHandler}
                    sx={{
                        flex: 1,
                        position: "relative",
                        ml: "1.5rem",
                        mr: ".8rem",
                        pr: "1.6rem",
                        my: "1rem",
                        overflowY: "auto",
                        overflowX: "hidden",
                        direction: "ltr",

                        scrollBehavior: "smooth",
                        "::-webkit-scrollbar": {
                            width: ".4rem",
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
                    <Box sx={{ height: 0 }}>
                        <Stack spacing=".6rem" sx={{ mt: ".88rem" }}>
                            {chatMessages && chatMessages.length > 0 ? (
                                chatMessages.map((message, i) => {
                                    if (message.type === ChatMessageType.Text) {
                                        if (onlyShowSystemMessages) return null
                                        return (
                                            <TextMessage
                                                key={`${message.id}-${message.sent_at.toISOString()}`}
                                                message={message}
                                                containerRef={scrollableRef}
                                                isScrolling={isScrolling}
                                                previousMessage={chatMessages[i - 1]}
                                                latestMessage={latestMessage}
                                            />
                                        )
                                    } else if (message.type === ChatMessageType.PunishVote) {
                                        const data = message.data as PunishMessageData
                                        return (
                                            <PunishMessage
                                                key={`${message.id}-${message.sent_at.toISOString()}`}
                                                data={data}
                                                sentAt={message.sent_at}
                                                fontSize={fontSize}
                                            />
                                        )
                                    } else if (message.type === ChatMessageType.SystemBan) {
                                        const data = message.data as SystemBanMessageData
                                        return (
                                            <SystemBanMessage
                                                key={`${message.id}-${message.sent_at.toISOString()}`}
                                                data={data}
                                                sentAt={message.sent_at}
                                                fontSize={fontSize}
                                            />
                                        )
                                    } else if (message.type === ChatMessageType.NewBattle) {
                                        const data = message.data as NewBattleMessageData
                                        return <NewBattleMessage key={`${message.id}-${message.sent_at.toISOString()}`} data={data} sentAt={message.sent_at} />
                                    }

                                    return null
                                })
                            ) : (
                                <Typography
                                    sx={{
                                        color: colors.grey,
                                        textAlign: "center",
                                    }}
                                >
                                    There are no messages yet.
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Box>

                <IconButton
                    size="small"
                    onClick={onClickScrollToBottom}
                    sx={{
                        position: "absolute",
                        bottom: "8.2rem",
                        right: "2.5rem",
                        backgroundColor: primaryColor,
                        boxShadow: 3,
                        opacity: autoScroll ? 0 : 1,
                        transition: "all .8s ease-out",
                        ":hover": {
                            backgroundColor: primaryColor,
                            opacity: 0.7,
                        },
                    }}
                >
                    <SvgScrolldown size="1.8rem" fill={secondaryColor} sx={{ p: 0 }} />
                </IconButton>
            </>
        ),
        [
            autoScroll,
            chatMessages,
            faction_id,
            fontSize,
            globalAnnouncement,
            isScrolling,
            latestMessage,
            onClickScrollToBottom,
            onlyShowSystemMessages,
            primaryColor,
            scrollHandler,
            secondaryColor,
            splitOption,
        ],
    )
})
