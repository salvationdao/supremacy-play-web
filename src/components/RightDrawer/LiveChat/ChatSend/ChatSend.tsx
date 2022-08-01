import { Box, IconButton, InputAdornment, MenuItem, MenuList, Stack, TextField, Typography } from "@mui/material"
import { BaseEmoji, emojiIndex } from "emoji-mart"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChatSettings, ClipThing, EmojiPopover } from "../../.."
import { SvgEmoji, SvgEmojiSelector, SvgExternalLink, SvgSend } from "../../../../assets"
import { MAX_CHAT_MESSAGE_LENGTH } from "../../../../constants"
import { IncomingMessages, useAuth, useChat, useMobile, useSnackbar } from "../../../../containers"
import { SendFunc } from "../../../../containers/ws"
import { getRandomColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { User, UserRank } from "../../../../types"
import { TooltipHelper } from "../../../Common/TooltipHelper"

interface ChatSendProps {
    primaryColor: string
    faction_id: string | null
}

export const ChatSend = (props: ChatSendProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user, userRank } = useAuth()
    const { onSentMessage, onFailedMessage, newMessageHandler, isPoppedout, toggleIsPoppedout, globalActivePlayers, activePlayers } = useChat()

    return (
        <ChatSendInner
            {...props}
            send={send}
            user={user}
            userRank={userRank}
            onSentMessage={onSentMessage}
            onFailedMessage={onFailedMessage}
            newMessageHandler={newMessageHandler}
            isPoppedout={isPoppedout}
            toggleIsPoppedout={toggleIsPoppedout}
            globalActivePlayers={globalActivePlayers}
            activePlayers={activePlayers}
        />
    )
}

interface ChatSendInnerProps extends ChatSendProps {
    user: User
    userRank?: UserRank
    onSentMessage: (sentAt: Date) => void
    onFailedMessage: (sentAt: Date) => void
    newMessageHandler: ({ messages, faction }: IncomingMessages) => void
    send: SendFunc
    isPoppedout: boolean
    toggleIsPoppedout: (value?: boolean) => void
    globalActivePlayers: User[]
    activePlayers: User[]
}

const ChatSendInner = ({
    primaryColor,
    faction_id,
    send,
    user,
    userRank,
    onSentMessage,
    onFailedMessage,
    newMessageHandler,
    isPoppedout,
    toggleIsPoppedout,
    globalActivePlayers,
    activePlayers,
}: ChatSendInnerProps) => {
    const { newSnackbarMessage } = useSnackbar()
    const { isMobile } = useMobile()
    const { userGidRecord } = useChat()

    // Message field
    const [message, setMessage] = useState("")

    // Emoji Shortcut
    const [emojis, setEmojis] = useState<BaseEmoji[]>([])
    const [caretPosition, setCaretPosition] = useState<number | null>(null)
    const [caretMsg, setCaretMsg] = useState<string>("")
    const [emojiSelect, setEmojiSelect] = useState<number>()
    const textfieldRef = useRef<HTMLInputElement>()
    //tagging states
    const [searchPlayersQuery, setSearchPlayersQuery] = useState<string>()
    const [playersResults, setPlayersResults] = useState<User[]>([])

    //Emoji Popup
    const [isEmojiOpen, toggleIsEmojiOpen] = useToggle()
    const popoverRef = useRef(null)

    const messageColor = useMemo(() => getRandomColor(), [])
    const renderedMsg = message.replace(/@[a-zA-Z0-9-_]+#/g, "#")
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

    const handleTaggedUsers = useCallback(
        (msg: string): number[] => {
            const taggedStrings = [...msg.matchAll(/#\d+/g)]
            let taggedGids: number[] = []
            taggedStrings.map((s) => {
                const gid = parseInt(s[0].substring(1))
                if (gid === user.gid) return
                const taggedUser = userGidRecord[gid]

                if (taggedUser && faction_id !== null && taggedUser.faction_id !== faction_id) return
                taggedGids = [...taggedGids, gid]
            })
            return taggedGids
        },
        [userGidRecord, faction_id, user.gid],
    )

    const sendMessage = useCallback(async () => {
        if (!message.trim()) return

        const sentAt = new Date()

        const taggedUserGids = handleTaggedUsers(renderedMsg)
        newMessageHandler({
            messages: [
                {
                    data: {
                        from_user: user,
                        user_rank: userRank,
                        message_color: messageColor,
                        message: renderedMsg,
                        tagged_users_gids: taggedUserGids,
                    },
                    type: "TEXT",
                    sent_at: sentAt,
                    locallySent: true,
                },
            ],
            faction: faction_id,
        })

        try {
            setMessage("")
            const resp = await send<boolean>(GameServerKeys.SendChatMessage, {
                faction_id,
                message: renderedMsg,
                message_color: messageColor,
                tagged_users_gids: taggedUserGids,
            })
            if (resp) onSentMessage(sentAt)
        } catch (e) {
            newSnackbarMessage(typeof e === "string" ? e : "Failed to send chat message.", "error")
            onFailedMessage(sentAt)
            console.error(e)
        }
    }, [
        message,
        user,
        send,
        newMessageHandler,
        userRank,
        messageColor,
        faction_id,
        onSentMessage,
        newSnackbarMessage,
        onFailedMessage,
        renderedMsg,
        handleTaggedUsers,
    ])

    const showCharCount = message.length >= MAX_CHAT_MESSAGE_LENGTH

    // After user has selected an emoji- deconstructs string before and after the emoji enter point and reconstructs the message string
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
        [caretMsg, caretPosition, message, setMessageWithCheck],
    )

    // While the user is using :emoji short cut- finding the search phrase and setting caret (cursor) positioning
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

    // After user has selected an emoji- deconstructs string before and after the emoji enter point and reconstructs the message string
    const handlePlayerTagSelect = useCallback(
        (taggedUser: User) => {
            //getting the index of the last colon of the string from the start of the message to the caret (cursor) position
            const index = caretMsg.lastIndexOf("@")
            //if there is an index, run the next block of code
            if (index != -1) {
                //saving the string before the colon
                const stringBefore = caretMsg.substring(0, index)
                //initializing the full string to be the string before the colon and the chosen emoji
                let fullString = `${stringBefore + "@" + taggedUser.username + "#" + taggedUser.gid + " "}`
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
                setPlayersResults([])
                setSearchPlayersQuery("")
                document.getElementById(`message-textfield-${faction_id}`)?.focus()
            }
        },
        [caretMsg, caretPosition, message, setMessageWithCheck, faction_id],
    )

    // While the user is using :emoji short cut- finding the search phrase and setting caret (cursor) positioning
    const handlePlayerSearchShortcut = useCallback((caretStartPosition: number | null, msg: string) => {
        //there should always be a caret position or the element is not focused
        if (caretStartPosition) {
            //set the caret position
            setCaretPosition(caretStartPosition)
            //finds the string from the start of the message to the caret string- allows for multiple @s to be used in a message and focus only where the user is typing
            const caretString = msg.substring(0, caretStartPosition)
            //sets for use in another function
            setCaretMsg(caretString)
            //getting last index of shortcut key: colon
            const colonIndex = caretString.lastIndexOf("@")
            //if there is a colon, run the next block of code
            if (colonIndex != -1) {
                //gets the string from the first letter after the colon to the end of the caret position
                const afterColonSubstring = caretString.substring(colonIndex + 1, caretString.length)
                //identifies if theres a space, if there is one and marks it as the end of the search query
                const searchStringEndIndex = afterColonSubstring.indexOf(" ")
                const searchString = afterColonSubstring.substring(0, searchStringEndIndex !== -1 ? searchStringEndIndex : caretString.length)

                //if there is no matches, clear the results
                if (searchStringEndIndex !== -1) {
                    setSearchPlayersQuery(undefined)
                    return
                }

                setSearchPlayersQuery(searchString)
            }
        }
    }, [])

    useEffect(() => {
        if (!searchPlayersQuery || !send) {
            setPlayersResults([])
            return
        }

        const fap = activePlayers.filter((ap) => {
            return ap.id !== user.id && (ap.username.includes(searchPlayersQuery) || ap.gid.toString().includes(searchPlayersQuery))
        })

        const gap = globalActivePlayers.filter((ap) => {
            return ap.id !== user.id && (ap.username.includes(searchPlayersQuery) || ap.gid.toString().includes(searchPlayersQuery))
        })

        faction_id ? setPlayersResults(fap) : setPlayersResults(gap)
    }, [searchPlayersQuery, activePlayers, globalActivePlayers, faction_id, send, user.id])

    // Sets the caret (cursor) position back to where it was previously
    const focusCaretTextField = useCallback(() => {
        if (caretPosition) {
            textfieldRef.current?.setSelectionRange(caretPosition, caretPosition)
        }
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
                                        id={`emoji-index-${faction_id}-${i}`}
                                        disableRipple
                                        onClick={() => {
                                            handleOnEmojiSelect(e)
                                            document.getElementById(`message-textfield-${faction_id}`)?.focus()
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
                                                    document.getElementById(`emoji-index-${faction_id}-${prev}`)?.focus()
                                                    break
                                                }
                                                case "ArrowRight": {
                                                    e.preventDefault()
                                                    let next = i + 1

                                                    if (next >= emojis.length) {
                                                        next = 0
                                                    }
                                                    document.getElementById(`emoji-index-${faction_id}-${next}`)?.focus()
                                                    break
                                                }
                                                case "ArrowDown": {
                                                    e.preventDefault()
                                                    setEmojiSelect(undefined)
                                                    document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                                    break
                                                }
                                                case "Escape": {
                                                    setEmojis([])
                                                    setEmojiSelect(undefined)
                                                    document.getElementById(`message-textfield-${faction_id}`)?.focus()
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

                {playersResults && (
                    <MenuList>
                        <Stack direction={"column-reverse"}>
                            {playersResults.map((r, i) => {
                                return (
                                    <MenuItem
                                        id={"search-player-results-" + i}
                                        dense
                                        key={r.id}
                                        onClick={() => {
                                            handlePlayerTagSelect(r)
                                        }}
                                        onKeyDown={(e) => {
                                            e.stopPropagation()
                                            switch (e.key) {
                                                case "ArrowUp": {
                                                    e.preventDefault()
                                                    if (i === playersResults.length - 1) {
                                                        break
                                                    }
                                                    document.getElementById(`search-player-results-${i + 1}`)?.focus()
                                                    break
                                                }
                                                case "ArrowDown": {
                                                    e.preventDefault()
                                                    if (i === 0) {
                                                        document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                                        break
                                                    }
                                                    document.getElementById(`search-player-results-${i - 1}`)?.focus()
                                                    break
                                                }
                                                case "Escape": {
                                                    e.preventDefault()
                                                    document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                                    break
                                                }
                                                case "Enter": {
                                                    document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                                    setPlayersResults([])
                                                    setSearchPlayersQuery("")
                                                    break
                                                }
                                            }
                                        }}
                                    >
                                        <Typography>{r.username + " #" + r.gid}</Typography>
                                    </MenuItem>
                                )
                            })}
                        </Stack>
                    </MenuList>
                )}

                <ClipThing
                    clipSize="8px"
                    border={{
                        isFancy: true,
                        borderColor: primaryColor,
                        borderThickness: ".25rem",
                    }}
                    opacity={0.6}
                    backgroundColor="#494949"
                >
                    <Stack sx={{ height: "100%" }}>
                        <TextField
                            id={`message-textfield-${faction_id}`}
                            value={message}
                            placeholder="Send a message..."
                            inputRef={textfieldRef}
                            onChange={(e) => {
                                const msg = e.currentTarget.value
                                setEmojis([])
                                setEmojiSelect(undefined)
                                setMessageWithCheck(msg)

                                handleEmojiShortcut(e.target.selectionStart, msg)
                                handlePlayerSearchShortcut(e.target.selectionStart, msg)
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
                                        setPlayersResults([])
                                        setSearchPlayersQuery("")
                                        break
                                    }
                                    case "ArrowUp": {
                                        e.preventDefault()
                                        if (emojis.length > 0) {
                                            document.getElementById(`emoji-index-${faction_id}-0`)?.focus()
                                        }
                                        if (playersResults.length > 0) {
                                            document.getElementById(`search-player-results-0`)?.focus()
                                        }
                                        break
                                    }
                                    case "Tab": {
                                        e.preventDefault()
                                        if (emojis.length > 0) {
                                            const emoji = emojis[0]
                                            handleOnEmojiSelect(emoji)
                                        }
                                        if (playersResults.length > 0) {
                                            const taggedUser = playersResults[0]
                                            handlePlayerTagSelect(taggedUser)
                                        }
                                        if (caretPosition) {
                                            textfieldRef.current?.setSelectionRange(caretPosition, caretPosition)
                                        }
                                    }
                                }
                            }}
                            sx={{
                                borderRadius: 0,
                                "& .MuiInputBase-root": {
                                    fontFamily: fonts.shareTech,
                                    pt: "1rem",
                                    pb: ".8rem",
                                    borderRadius: 0,
                                },
                                ".Mui-disabled": {
                                    WebkitTextFillColor: "unset",
                                    color: "#FFFFFF70",
                                },
                                ".MuiOutlinedInput-notchedOutline": {
                                    outline: "none !important",
                                    border: `none !important`,
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

                                        {!isPoppedout && !isMobile && (
                                            <IconButton
                                                onClick={() => toggleIsPoppedout()}
                                                edge="end"
                                                size="small"
                                                sx={{ opacity: 0.5, ":hover": { opacity: 1 }, transition: "all .1s" }}
                                            >
                                                <SvgExternalLink size="1.4rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                                            </IconButton>
                                        )}

                                        <TooltipHelper placement="top-end" text="Use keyboard shortcut ' : '">
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
                                        </TooltipHelper>

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
                    </Stack>
                </ClipThing>

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

            {isEmojiOpen && (
                <EmojiPopover
                    primaryColor={primaryColor}
                    setMessage={setMessageWithCheck}
                    popoverRef={popoverRef}
                    isEmojiOpen={isEmojiOpen}
                    toggleIsEmojiOpen={toggleIsEmojiOpen}
                />
            )}
        </form>
    )
}
