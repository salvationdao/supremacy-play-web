import { Box, Divider, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { PunishMessage, TextMessage } from "../../.."
import { SvgScrolldown } from "../../../../assets"
import { FontSizeType, SplitOptionType, useAuth, useChat, useSupremacy } from "../../../../containers"
import { checkIfIsEmoji, dateFormatter } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"
import { ChatMessageType, Faction, NewBattleMessageData, PunishMessageData, SystemBanMessageData, TextMessageData, User } from "../../../../types"
import { BanProposal } from "../BanProposal/BanProposal"
import { GlobalAnnouncement, GlobalAnnouncementType } from "../GlobalAnnouncement"
import { SystemBanMessage } from "./MessageTypes/SystemBanMessage"

interface ChatMessagesProps {
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatMessageType[]
    faction_id: string | null
}

export const ChatMessages = (props: ChatMessagesProps) => {
    const { user } = useAuth()
    const { filterSystemMessages, sentMessages, failedMessages, splitOption, fontSize, globalAnnouncement } = useChat()
    const { getFaction } = useSupremacy()

    return (
        <ChatMessagesInner
            {...props}
            user={user}
            filterSystemMessages={filterSystemMessages}
            sentMessages={sentMessages}
            failedMessages={failedMessages}
            faction_id={props.faction_id}
            splitOption={splitOption}
            fontSize={fontSize}
            globalAnnouncement={globalAnnouncement}
            getFaction={getFaction}
        />
    )
}

interface ChatMessagesInnerProps extends ChatMessagesProps {
    user: User
    filterSystemMessages?: boolean
    sentMessages: Date[]
    failedMessages: Date[]
    splitOption: SplitOptionType
    fontSize: FontSizeType
    globalAnnouncement?: GlobalAnnouncementType
    getFaction: (factionID: string) => Faction
}

const ChatMessagesInner = ({
    user,
    primaryColor,
    secondaryColor,
    chatMessages,
    filterSystemMessages,
    sentMessages,
    failedMessages,
    faction_id,
    splitOption,
    fontSize,
    globalAnnouncement,
    getFaction,
}: ChatMessagesInnerProps) => {
    const scrollableRef = useRef<HTMLDivElement>(null)
    const [autoScroll, setAutoScroll] = useState(true)
    const [isScrolling, setIsScrolling] = useState(false)

    useLayoutEffect(() => {
        // Auto scroll to the bottom if enabled, has messages and user login/logout state changed
        if (!autoScroll || !scrollableRef.current || chatMessages.length === 0) {
            return
        }
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [chatMessages, autoScroll, user])

    const onClickScrollToBottom = useCallback(() => {
        if (!scrollableRef.current) return
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [])

    const scrollHandler = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
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

            setTimeout(() => {
                setIsScrolling(false)
            }, 150)
        },
        [autoScroll],
    )

    return (
        <>
            {globalAnnouncement && (splitOption == "tabbed" || (splitOption == "split" && faction_id == null)) && (
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
                    my: ".6rem",
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
                    <Stack spacing=".5rem" sx={{ mt: ".88rem" }}>
                        {chatMessages && chatMessages.length > 0 ? (
                            chatMessages.map((message, i) => {
                                if (message.type == "TEXT") {
                                    const data = message.data as TextMessageData
                                    const isEmoji: boolean = checkIfIsEmoji(data.message)
                                    return (
                                        <TextMessage
                                            key={`${data.from_user.id} - ${message.sent_at.toISOString()}`}
                                            data={data}
                                            sentAt={message.sent_at}
                                            fontSize={fontSize}
                                            filterSystemMessages={filterSystemMessages}
                                            isSent={message.locallySent ? sentMessages.includes(message.sent_at) : true}
                                            isFailed={data.from_user.id === user?.id ? failedMessages.includes(message.sent_at) : false}
                                            getFaction={getFaction}
                                            user={user}
                                            isEmoji={isEmoji}
                                            previousMessage={chatMessages[i - 1]}
                                            containerRef={scrollableRef}
                                            isScrolling={isScrolling}
                                            chatMessages={chatMessages}
                                        />
                                    )
                                } else if (message.type == "PUNISH_VOTE") {
                                    const data = message.data as PunishMessageData
                                    return (
                                        <PunishMessage
                                            key={`${data.issued_by_user.id} - ${message.sent_at.toISOString()}`}
                                            data={data}
                                            sentAt={message.sent_at}
                                            fontSize={fontSize}
                                        />
                                    )
                                } else if (message.type == "SYSTEM_BAN") {
                                    const data = message.data as SystemBanMessageData
                                    return (
                                        <SystemBanMessage
                                            key={`${data.banned_user.id} - ${message.sent_at.toISOString()}`}
                                            data={data}
                                            sentAt={message.sent_at}
                                            fontSize={fontSize}
                                        />
                                    )
                                } else if (message.type === "NEW_BATTLE") {
                                    const data = message.data as NewBattleMessageData
                                    return (
                                        <Stack
                                            key={`${data.battle_number} - ${message.sent_at.toISOString()}`}
                                            direction={"row"}
                                            alignItems={"center"}
                                            sx={{ pb: "0.5rem" }}
                                        >
                                            <Divider sx={{ flex: "1" }} />
                                            <Typography
                                                variant={"caption"}
                                                sx={{ color: colors.grey, flexShrink: "0", px: "1rem", fontFamily: fonts.nostromoBold }}
                                            >
                                                BATTLE #{data ? data.battle_number : null} ({dateFormatter(message.sent_at)})
                                            </Typography>
                                            <Divider sx={{ flex: "1" }} />
                                        </Stack>
                                    )
                                }

                                return null
                            })
                        ) : (
                            <Typography
                                sx={{
                                    color: colors.grey,
                                    textAlign: "center",
                                    userSelect: "tex !important",
                                }}
                            >
                                There are no messages yet.
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Box>

            <Fade in={!autoScroll} timeout={2200} easing={{ exit: "cubic-bezier(0,.99,.28,1.01)" }}>
                <IconButton
                    size="small"
                    onClick={onClickScrollToBottom}
                    sx={{
                        position: "absolute",
                        bottom: "6.2rem",
                        right: "2.5rem",
                        backgroundColor: primaryColor,
                        boxShadow: 3,
                        ":hover": {
                            backgroundColor: primaryColor,
                            opacity: 0.7,
                        },
                    }}
                >
                    <SvgScrolldown size="1.8rem" fill={secondaryColor} sx={{ p: 0 }} />
                </IconButton>
            </Fade>
        </>
    )
}
