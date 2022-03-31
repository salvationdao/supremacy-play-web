import { Box, Fade, IconButton, Stack, Typography } from "@mui/material"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { ChatMessage } from "../.."
import { SvgScrolldown } from "../../../assets"
import {
    FontSizeType,
    SplitOptionType,
    useChat,
    useGameServerAuth,
    UserIDMap,
    UserMultiplierMap,
} from "../../../containers"
import { colors } from "../../../theme/theme"
import { ChatData } from "../../../types"
import { BanProposal } from "../BanProposal"
import { GlobalAnnouncement, GlobalAnnouncementType } from "../GlobalAnnouncement"

interface ChatMessagesProps {
    primaryColor: string
    secondaryColor: string
    chatMessages: ChatData[]
    faction_id: string | null
}

export const ChatMessages = (props: ChatMessagesProps) => {
    const {
        filterZerosGlobal,
        filterZerosFaction,
        sentMessages,
        failedMessages,
        userMultiplierMap,
        citizenPlayerIDs,
        splitOption,
        fontSize,
        userStatMap,
        globalAnnouncement,
    } = useChat()

    return (
        <ChatMessagesInner
            {...props}
            filterZeros={props.faction_id ? filterZerosFaction : filterZerosGlobal}
            sentMessages={sentMessages}
            failedMessages={failedMessages}
            userMultiplierMap={userMultiplierMap}
            citizenPlayerIDs={citizenPlayerIDs}
            faction_id={props.faction_id}
            splitOption={splitOption}
            fontSize={fontSize}
            userStatMap={userStatMap}
            globalAnnouncement={globalAnnouncement}
        />
    )
}

interface ChatMessagesInnerProps extends ChatMessagesProps {
    filterZeros?: boolean
    sentMessages: Date[]
    failedMessages: Date[]
    userMultiplierMap: UserMultiplierMap
    citizenPlayerIDs: string[]
    splitOption: SplitOptionType
    fontSize: FontSizeType
    userStatMap: UserIDMap
    globalAnnouncement?: GlobalAnnouncementType
}

const ChatMessagesInner = ({
    primaryColor,
    secondaryColor,
    chatMessages,
    filterZeros,
    sentMessages,
    failedMessages,
    userMultiplierMap,
    citizenPlayerIDs,
    faction_id,
    splitOption,
    fontSize,
    userStatMap,
    globalAnnouncement,
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
                        chatMessages.map((c) => (
                            <ChatMessage
                                key={`${c.from_username} - ${c.sent_at.toISOString()}`}
                                chat={c}
                                filterZeros={filterZeros}
                                isSent={c.from_user_id != user?.id ? true : sentMessages.includes(c.sent_at)}
                                isFailed={c.from_user_id != user?.id ? false : failedMessages.includes(c.sent_at)}
                                multiplierValue={userMultiplierMap[c.from_user_id]}
                                isCitizen={citizenPlayerIDs.some((cp) => cp === c.from_user_id)}
                                fontSize={fontSize}
                                userStat={userStatMap[c.from_user_id]}
                            />
                        ))
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
