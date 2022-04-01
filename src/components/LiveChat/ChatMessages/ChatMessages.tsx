import { Box, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { PunishMessage, TextMessage } from "../.."
import { SvgScrolldown } from "../../../assets"
import { FactionsAll, FontSizeType, SplitOptionType, useChat, useGame, useGameServerAuth, UserIDMap, UserMultiplierMap } from "../../../containers"
import { colors } from "../../../theme/theme"
import { ChatMessageType, PunishMessageData, TextMessageData } from "../../../types/chat"
import { BanProposal } from "../BanProposal"
import { GlobalAnnouncement, GlobalAnnouncementType } from "../GlobalAnnouncement"

interface ChatMessagesProps {
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatMessageType[]
    faction_id: string | null
}

export const ChatMessages = (props: ChatMessagesProps) => {
    const { filterZerosGlobal, filterZerosFaction, sentMessages, failedMessages, splitOption, fontSize, globalAnnouncement } = useChat()
    const { factionsAll } = useGame()

    return (
        <ChatMessagesInner
            {...props}
            filterZeros={props.faction_id ? filterZerosFaction : filterZerosGlobal}
            sentMessages={sentMessages}
            failedMessages={failedMessages}
            faction_id={props.faction_id}
            splitOption={splitOption}
            fontSize={fontSize}
            globalAnnouncement={globalAnnouncement}
            factionsAll={factionsAll}
        />
    )
}

interface ChatMessagesInnerProps extends ChatMessagesProps {
    filterZeros?: boolean
    sentMessages: Date[]
    failedMessages: Date[]
    splitOption: SplitOptionType
    fontSize: FontSizeType
    globalAnnouncement?: GlobalAnnouncementType
    factionsAll: FactionsAll
}

const ChatMessagesInner = ({
    primaryColor,
    secondaryColor,
    chatMessages,
    filterZeros,
    sentMessages,
    failedMessages,
    faction_id,
    splitOption,
    fontSize,
    globalAnnouncement,
    factionsAll,
}: ChatMessagesInnerProps) => {
    const { user } = useGameServerAuth()
    const [autoScroll, setAutoScroll] = useState(true)
    const scrollableRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        if (!autoScroll || !scrollableRef.current || chatMessages.length === 0) {
            return
        }
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [chatMessages, autoScroll])

    const onClickScrollToBottom = useCallback(() => {
        if (!scrollableRef.current) return
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight
    }, [])

    const scrollHandler = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const { currentTarget } = e
            const extraHeight = currentTarget.scrollHeight - currentTarget.offsetHeight
            const scrollUpTooMuch = currentTarget.scrollTop < extraHeight - 0.5 * currentTarget.offsetHeight

            // Enable autoscroll if they havent scroll more than half of the container
            if (autoScroll && scrollUpTooMuch) {
                setAutoScroll(false)
            } else if (!autoScroll && !scrollUpTooMuch) {
                setAutoScroll(true)
            }
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
                    my: ".8rem",
                    mr: ".64rem",
                    pl: "1.52rem",
                    pr: "1.6rem",
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
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
                <Stack spacing="1rem" sx={{ mt: ".88rem" }}>
                    {chatMessages && chatMessages.length > 0 ? (
                        chatMessages.map((message) => {
                            if (message.type == "PUNISH_VOTE") {
                                const data = message.data as PunishMessageData
                                return (
                                    <PunishMessage
                                        key={`${data.issued_by_player_id} - ${message.sent_at.toISOString()}`}
                                        data={data}
                                        sentAt={message.sent_at}
                                        fontSize={fontSize}
                                    />
                                )
                            }

                            if (message.type == "TEXT") {
                                const data = message.data as TextMessageData
                                return (
                                    <TextMessage
                                        key={`${data.from_user_id} - ${message.sent_at.toISOString()}`}
                                        data={data}
                                        sentAt={message.sent_at}
                                        fontSize={fontSize}
                                        filterZeros={filterZeros}
                                        isSent={data.from_user_id != user?.id ? true : sentMessages.includes(message.sent_at)}
                                        isFailed={data.from_user_id != user?.id ? false : failedMessages.includes(message.sent_at)}
                                        factionsAll={factionsAll}
                                    />
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
