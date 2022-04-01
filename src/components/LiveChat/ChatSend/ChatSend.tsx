import { IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useState, useRef, useMemo, useCallback } from "react"
import { ChatSettings, EmojiPopover } from "../.."
import { SvgEmoji, SvgSend } from "../../../assets"
import { MAX_CHAT_MESSAGE_LENGTH } from "../../../constants"
import { useChat, useGameServerAuth, useSnackbar, WebSocketProperties, useGameServerWebsocket } from "../../../containers"
import { useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { User, UserStat } from "../../../types"
import { ChatMessageType } from "../../../types/chat"

interface ChatSendProps {
    primaryColor: string
    faction_id: string | null
}

export const ChatSend = (props: ChatSendProps) => {
    const { state, send } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const { onSentMessage, onFailedMessage, newMessageHandler, initialMessageColor, userStats } = useChat()

    return (
        <ChatSendInner
            {...props}
            state={state}
            send={send}
            user={user}
            onSentMessage={onSentMessage}
            onFailedMessage={onFailedMessage}
            newMessageHandler={newMessageHandler}
            initialMessageColor={initialMessageColor}
            userStats={userStats.current}
        />
    )
}

interface ChatSendInnerProps extends ChatSendProps, Partial<WebSocketProperties> {
    user?: User
    onSentMessage: (sentAt: Date) => void
    onFailedMessage: (sentAt: Date) => void
    newMessageHandler: (message: ChatMessageType, faction_id: string | null) => void
    initialMessageColor?: string
    userStats?: {
        total_multiplier?: number
        is_citizen?: boolean
        from_user_stat?: UserStat
    }
}

const ChatSendInner = ({
    primaryColor,
    faction_id,
    state,
    send,
    user,
    onSentMessage,
    onFailedMessage,
    newMessageHandler,
    initialMessageColor,
    userStats,
}: ChatSendInnerProps) => {
    const { newSnackbarMessage } = useSnackbar()
    // Message field
    const [message, setMessage] = useState("")
    // Emoji
    const popoverRef = useRef(null)
    const [isEmojiOpen, toggleIsEmojiOpen] = useToggle()

    const messageColor = useMemo(() => initialMessageColor || getRandomChatColor(), [initialMessageColor])

    const setMessageWithCheck = useCallback(
        (newMessage: string, append?: boolean) => {
            setMessage((prev) => {
                const m = append ? prev + newMessage : newMessage
                if (m.length > MAX_CHAT_MESSAGE_LENGTH) return prev
                return m
            })
        },
        [setMessage],
    )

    const sendMessage = useCallback(async () => {
        if (!message.trim() || !user || state !== WebSocket.OPEN || !send) return

        const sentAt = new Date()

        newMessageHandler(
            {
                data: {
                    from_user_id: user.id,
                    from_user_faction_id: user.faction_id,
                    from_username: user.username,
                    message_color: messageColor,
                    avatar_id: user.avatar_id,
                    message,
                    ...userStats,
                    self: true,
                },
                type: "TEXT",
                sent_at: sentAt,
            },
            faction_id,
        )

        try {
            setMessage("")
            const resp = await send<boolean>(GameServerKeys.SendChatMessage, {
                faction_id,
                message,
                message_color: messageColor,
            })
            if (resp) onSentMessage(sentAt)
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to send chat message.", "error")
            onFailedMessage(sentAt)
            console.debug(e)
        }
    }, [message, user, state, send, newSnackbarMessage])

    const showCharCount = message.length >= MAX_CHAT_MESSAGE_LENGTH

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
            }}
        >
            <Stack
                justifyContent="flex-end"
                sx={{
                    position: "relative",
                    px: "1.28rem",
                    pt: ".32rem",
                    pb: showCharCount ? "2.4rem" : "1.1rem",
                }}
            >
                <TextField
                    value={message}
                    placeholder="Send a message..."
                    onChange={(e) => setMessageWithCheck(e.currentTarget.value)}
                    type="text"
                    multiline
                    maxRows={4}
                    hiddenLabel
                    size="small"
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        e.stopPropagation()
                        if (e.key == "Enter") {
                            e.preventDefault()
                            sendMessage()
                        }
                    }}
                    sx={{
                        borderRadius: 1,
                        "& .MuiInputBase-root": {
                            backgroundColor: "#49494970",
                            fontFamily: "Share Tech",
                            pt: "1rem",
                            pb: ".8rem",
                        },
                        ".Mui-disabled": {
                            WebkitTextFillColor: "unset",
                            color: "#FFFFFF70",
                        },
                        ".Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: `${primaryColor} !important`,
                        },
                        textarea: {
                            color: "#FFFFFF",
                            overflow: "hidden",
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <ChatSettings primaryColor={primaryColor} faction_id={faction_id} />
                                <IconButton
                                    ref={popoverRef}
                                    onClick={() => toggleIsEmojiOpen()}
                                    edge="end"
                                    size="small"
                                    sx={{
                                        mr: 0,
                                        opacity: isEmojiOpen ? 1 : 0.5,
                                        ":hover": { opacity: 1 },
                                        transition: "all .1s",
                                    }}
                                >
                                    <SvgEmoji size="1.4rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                                </IconButton>
                                <IconButton
                                    onClick={sendMessage}
                                    edge="end"
                                    size="small"
                                    sx={{ opacity: 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}
                                >
                                    <SvgSend size="1.4rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {showCharCount && (
                    <Typography
                        variant="caption"
                        sx={{
                            position: "absolute",
                            bottom: ".5rem",
                            right: "1.5rem",
                            opacity: showCharCount ? 1 : 0.4,
                            color: showCharCount ? colors.red : "#FFFFFF",
                        }}
                    >
                        {message.length}/{MAX_CHAT_MESSAGE_LENGTH}
                    </Typography>
                )}
            </Stack>

            <EmojiPopover
                primaryColor={primaryColor}
                setMessage={setMessageWithCheck}
                popoverRef={popoverRef}
                isEmojiOpen={isEmojiOpen}
                toggleIsEmojiOpen={toggleIsEmojiOpen}
            />
        </form>
    )
}

// Returns a random chat color for non faction users
const getRandomChatColor = () => {
    let color = "#"
    for (let i = 0; i < 3; i++) color += ("0" + Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)).slice(-2)
    return color
}
