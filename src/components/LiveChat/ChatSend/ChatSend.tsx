import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { BaseEmoji, emojiIndex } from "emoji-mart"
import { useCallback, useMemo, useRef, useState } from "react"
import { ChatSettings, EmojiPopover } from "../.."
import { SvgEmoji, SvgEmojiSelector, SvgSend } from "../../../assets"
import { MAX_CHAT_MESSAGE_LENGTH } from "../../../constants"
import { useChat, useGameServerAuth, useSnackbar, WebSocketProperties, useGameServerWebsocket } from "../../../containers"
import { useToggle } from "../../../hooks"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { User, UserRank, UserStat } from "../../../types"
import { ChatMessageType } from "../../../types/chat"

interface ChatSendProps {
    primaryColor: string
    faction_id: string | null
}

export const ChatSend = (props: ChatSendProps) => {
    const { state, send } = useGameServerWebsocket()
    const { user, userRank } = useGameServerAuth()
    const { onSentMessage, onFailedMessage, newMessageHandler, initialMessageColor, userStats } = useChat()

    return (
        <ChatSendInner
            {...props}
            state={state}
            send={send}
            user={user}
            userRank={userRank}
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
    userRank?: UserRank
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
    userRank,
    onSentMessage,
    onFailedMessage,
    newMessageHandler,
    initialMessageColor,
    userStats,
}: ChatSendInnerProps) => {
    const { newSnackbarMessage } = useSnackbar()
    // Message field
    const [message, setMessage] = useState("")

    // Emoji Shortcut
    const [emojis, setEmojis] = useState<BaseEmoji[]>([])
    const [caretPosition, setCaretPosition] = useState<number | null>(null)
    const [caretMsg, setCaretMsg] = useState<string>("")
    const [emojiSelect, setEmojiSelect] = useState<number>()
    const textfieldRef = useRef<HTMLInputElement>()

    //Emoji Popup
    const [isEmojiOpen, toggleIsEmojiOpen] = useToggle()
    const popoverRef = useRef(null)

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
                    from_user: user,
                    user_rank: userRank,
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

    //After user has selected an emoji- deconstructs string before and after the emoji enter point and reconstructs the message string
    const handleOnEmojiSelect = useCallback(
        (emoji: BaseEmoji) => {
            //getting the index of the last colon of the string from the start of the message to the caret (cursor) position
            const index = caretMsg.lastIndexOf(":")
            //if there is an index, run the next block of code
            if (index != -1) {
                //saving the string before the colon
                const stringBefore = caretMsg.substring(0, index)
                //initializing the full string to be the string before the colon and the chosen emoji
                let fullString = `${stringBefore + emoji.native}`
                //caretPosition can be null if elements not focused, but shouldn't be in this use case, getting string after the caret position in case user uses this in middle of message
                if (caretPosition) {
                    //finding the string after the caret position
                    const stringAfter = message.substring(caretPosition, message.length)
                    //setting the full string to add the string after
                    fullString = `${fullString + stringAfter}`
                }
                //setting message
                setMessageWithCheck(fullString)
                //setting Emojis Array, to close out the Emoji selector
                setEmojis([])
                //setting the Select to no emojis
                setEmojiSelect(undefined)
            }
        },
        [caretPosition, message],
    )

    //While the user is using :emoji short cut- finding the search phrase and setting caret (cursor) positioning
    const handleEmojiShortcut = useCallback((caretStartPosition: number | null, msg: string) => {
        //there should always be a caret position or the element is not focused
        if (caretStartPosition) {
            //set the caret position
            setCaretPosition(caretStartPosition)
            //finds the string from the start of the message to the caret string- allows for multiple colons to be used in a message and focus only where the user is typing
            const caretString = msg.substring(0, caretStartPosition)
            //sets for use in another function
            setCaretMsg(caretString)
            //getting last index of shortcut key: colon
            const colonIndex = caretString.lastIndexOf(":")
            //if there is a colon, run the next block of code
            if (colonIndex != -1) {
                //gets the string from the first letter after the colon to the end of the caret position
                const afterColonSubstring = caretString.substring(colonIndex + 1, caretString.length)
                //identifies if theres a space, if there is one and marks it as the end of the search query
                const searchStringEndIndex = afterColonSubstring.indexOf(" ")
                const searchString = afterColonSubstring.substring(0, searchStringEndIndex !== -1 ? searchStringEndIndex : caretString.length)

                //if there is no matches, clear the results
                if (searchStringEndIndex !== -1) {
                    setEmojis([])
                    setEmojiSelect(undefined)
                    return
                }

                //checks if the search query matches only letters
                if (searchString.match(/^[a-zA-Z]+$/) !== null) {
                    //search the emoji Index and set the array- top 15 returned results
                    const searchArr = emojiIndex.search(searchString)?.slice(0, 15)
                    setEmojis(searchArr as BaseEmoji[])
                }
            }
        }
    }, [])

    //sets the caret (cursor) position back to where it was previously
    const focusCaretTextField = useCallback(() => {
        setTimeout(() => {
            if (caretPosition) {
                textfieldRef.current?.setSelectionRange(caretPosition, caretPosition)
            }
        }, 0)
    }, [caretPosition])

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
                {emojis?.length > 0 && (
                    <Box
                        sx={{
                            background: "#49494933",
                            width: "100%",
                            display: "flex",
                            mb: ".6rem",
                            p: ".5rem",
                            boxShadow: 4,
                            borderRadius: 1,
                            overflowX: "scroll",
                            scrollBehavior: "smooth",
                            "::-webkit-scrollbar": {
                                height: ".4rem",
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
                        {emojis.map((e, i) => {
                            return (
                                <Box key={e.unified} sx={{ position: "relative" }}>
                                    {i === emojiSelect && (
                                        <SvgEmojiSelector
                                            size="100%"
                                            sx={{
                                                position: "absolute",
                                                left: "50%",
                                                top: "50%",
                                                transform: "translate(-50%, -50%)",
                                                width: "100%",
                                            }}
                                            stroke={primaryColor}
                                            strokeWidth="6"
                                        />
                                    )}
                                    <IconButton
                                        id={`emoji-index-${i}`}
                                        disableRipple
                                        onClick={() => {
                                            handleOnEmojiSelect(e)
                                            document.getElementById("message-textfield")?.focus()
                                        }}
                                        //handling keyboard navigation
                                        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                                            e.stopPropagation()
                                            switch (e.key) {
                                                case "ArrowLeft": {
                                                    e.preventDefault()
                                                    let prev = i - 1

                                                    if (prev <= -1) {
                                                        prev = emojis.length - 1
                                                    }
                                                    document.getElementById(`emoji-index-${prev}`)?.focus()
                                                    break
                                                }
                                                case "ArrowRight": {
                                                    e.preventDefault()
                                                    let next = i + 1

                                                    if (next >= emojis.length) {
                                                        next = 0
                                                    }
                                                    document.getElementById(`emoji-index-${next}`)?.focus()
                                                    break
                                                }
                                                case "ArrowDown": {
                                                    e.preventDefault()
                                                    setEmojiSelect(undefined)
                                                    document.getElementById("message-textfield")?.focus()
                                                    break
                                                }
                                                case "Escape": {
                                                    setEmojis([])
                                                    setEmojiSelect(undefined)
                                                    document.getElementById("message-textfield")?.focus()
                                                    break
                                                }
                                            }
                                        }}
                                        onFocus={() => {
                                            setEmojiSelect(i)
                                        }}
                                        onBlur={() => {
                                            setEmojiSelect(undefined)
                                        }}
                                    >
                                        <Typography fontSize="3rem">{e.native}</Typography>
                                    </IconButton>
                                </Box>
                            )
                        })}
                    </Box>
                )}

                <TextField
                    id="message-textfield"
                    value={message}
                    placeholder="Send a message..."
                    inputRef={textfieldRef}
                    onChange={(e) => {
                        const msg = e.currentTarget.value
                        setEmojis([])
                        setEmojiSelect(undefined)
                        setMessageWithCheck(msg)

                        handleEmojiShortcut(e.target.selectionStart, msg)
                    }}
                    onFocus={(e) => {
                        e.preventDefault()
                        focusCaretTextField()
                    }}
                    type="text"
                    multiline
                    maxRows={4}
                    hiddenLabel
                    size="small"
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                        e.stopPropagation()
                        switch (e.key) {
                            case "Enter": {
                                e.preventDefault()
                                sendMessage()
                                setEmojis([])
                                break
                            }
                            case "ArrowUp": {
                                e.preventDefault()
                                if (emojis.length < 1) return
                                document.getElementById("emoji-index-0")?.focus()
                                break
                            }
                            case "Tab": {
                                if (emojis.length < 1) return
                                e.preventDefault()
                                const emoji = emojis[0]
                                handleOnEmojiSelect(emoji)

                                if (caretPosition) {
                                    textfieldRef.current?.setSelectionRange(caretPosition, caretPosition)
                                }
                            }
                        }
                    }}
                    sx={{
                        borderRadius: 1,
                        boxShadow: 1,
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
