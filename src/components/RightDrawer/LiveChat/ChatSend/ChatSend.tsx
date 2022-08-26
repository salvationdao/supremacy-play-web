import { IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { useCallback, useMemo, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { ChatSettings, ClipThing, EmojiPopover } from "../../.."
import { SvgEmoji, SvgExternalLink, SvgSend } from "../../../../assets"
import { MAX_CHAT_MESSAGE_LENGTH } from "../../../../constants"
import { useAuth, useChat, useGlobalNotifications, useMobile } from "../../../../containers"
import { getRandomColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { ChatMessage, ChatMessageType } from "../../../../types"
import { TooltipHelper } from "../../../Common/TooltipHelper"
import { EmojiShortcut } from "./EmojiShortcut"
import { TagPlayer } from "./TagPlayer"

interface ChatSendProps {
    primaryColor: string
    faction_id: string | null
}

export const ChatSend = ({ primaryColor, faction_id }: ChatSendProps) => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user, userRank } = useAuth()
    const { isMobile } = useMobile()
    const { userGidRecord, onFailedMessage, handleIncomingMessage, isPoppedout, setIsPoppedout } = useChat()

    // Message field
    const textfieldRef = useRef<HTMLInputElement>()
    const [message, setMessage] = useState("")
    const caretStartPosition = useRef<number | null>(null)

    //Emoji Popup
    const popoverRef = useRef(null)
    const [isEmojiOpen, toggleIsEmojiOpen] = useToggle()

    const messageColor = useMemo(() => getRandomColor(), [])
    const renderedMsg = message.replace(/@[\w ]+#/g, "#")

    // Go through input message and return tagged gid's
    const taggedGIDs = useCallback(
        (msg: string): number[] => {
            const taggedStrings = [...msg.matchAll(/#\d+/g)]
            const taggedGids: number[] = []

            taggedStrings.map((s) => {
                const gid = parseInt(s[0].substring(1))
                if (gid === user.gid) return

                const taggedUser = userGidRecord.current[gid]
                // If on faction chat, prevent tagging players not in same faction
                if (taggedUser && faction_id !== null && taggedUser.faction_id !== faction_id) return
                taggedGids.push(gid)
            })

            return taggedGids
        },
        [userGidRecord, faction_id, user.gid],
    )

    // Sets the caret (cursor) position back to where it was previously
    const focusCaretTextField = useCallback(() => {
        if (caretStartPosition.current) {
            textfieldRef.current?.setSelectionRange(caretStartPosition.current, caretStartPosition.current)
        }
    }, [])

    // Checks input is not too long etc.
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
        if (!message.trim()) return

        const id = uuidv4()
        const sentAt = new Date()
        const taggedUserGids = taggedGIDs(renderedMsg)

        const msg: ChatMessage = {
            id,
            data: {
                id: id,
                from_user: user,
                user_rank: userRank,
                message_color: messageColor,
                message: renderedMsg,
                tagged_users_gids: taggedUserGids,
            },
            type: ChatMessageType.Text,
            sent_at: sentAt,
        }

        handleIncomingMessage({
            messages: [msg],
            faction: faction_id,
        })

        try {
            setMessage("")
            const resp = await send<ChatMessage>(GameServerKeys.SendChatMessage, {
                id,
                faction_id,
                message: renderedMsg,
                message_color: messageColor,
                tagged_users_gids: taggedUserGids,
            })
            if (!resp) return
        } catch (e) {
            onFailedMessage(id)
            newSnackbarMessage(typeof e === "string" ? e : "Failed to send chat message.", "error")
            console.error(e)
        }
    }, [message, user, send, handleIncomingMessage, userRank, messageColor, faction_id, newSnackbarMessage, onFailedMessage, renderedMsg, taggedGIDs])

    const showCharCount = message.length >= MAX_CHAT_MESSAGE_LENGTH

    return useMemo(
        () => (
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
                        px: "1.3rem",
                        pt: ".4rem",
                        pb: showCharCount ? "2.4rem" : "1.1rem",
                    }}
                >
                    <EmojiShortcut
                        primaryColor={primaryColor}
                        faction_id={faction_id}
                        message={message}
                        setMessageWithCheck={setMessageWithCheck}
                        caretStartPosition={caretStartPosition}
                    />

                    <TagPlayer faction_id={faction_id} message={message} setMessageWithCheck={setMessageWithCheck} caretStartPosition={caretStartPosition} />

                    <ClipThing
                        clipSize="8px"
                        border={{
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
                                    setMessageWithCheck(msg)
                                    caretStartPosition.current = e.target.selectionStart
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
                                            break
                                        }
                                        case "ArrowUp": {
                                            e.preventDefault()
                                            document.getElementById(`emoji-index-${faction_id}-0`)?.focus() ||
                                                document.getElementById(`search-player-results-0`)?.focus()
                                            break
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
                                            <ChatSettings primaryColor={primaryColor} />

                                            {!isPoppedout && !isMobile && (
                                                <IconButton
                                                    onClick={() => setIsPoppedout(true)}
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
                                bottom: "3rem",
                                right: "2.8rem",
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
        ),
        [
            faction_id,
            focusCaretTextField,
            isEmojiOpen,
            isMobile,
            isPoppedout,
            message,
            primaryColor,
            sendMessage,
            setIsPoppedout,
            setMessageWithCheck,
            showCharCount,
            toggleIsEmojiOpen,
        ],
    )
}
