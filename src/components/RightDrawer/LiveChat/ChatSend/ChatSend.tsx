import { InputAdornment, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { EmojiPopover } from "../../.."
import { SvgEmoji, SvgSend } from "../../../../assets"
import { MAX_CHAT_MESSAGE_LENGTH } from "../../../../constants"
import { useAuth, useChat, useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { getRandomColor } from "../../../../helpers"
import { useToggle } from "../../../../hooks"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { ChatMessage, ChatMessageType } from "../../../../types"
import { NiceButton } from "../../../Common/Nice/NiceButton"
import { NiceTextField } from "../../../Common/Nice/NiceTextField"
import { NiceTooltip } from "../../../Common/Nice/NiceTooltip"
import { EmojiShortcut } from "./EmojiShortcut"
import { TagPlayer } from "./TagPlayer"

interface ChatSendProps {
    faction_id: string | null
}

export const ChatSend = ({ faction_id }: ChatSendProps) => {
    const theme = useTheme()
    const { newSnackbarMessage } = useGlobalNotifications()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user, userRank } = useAuth()
    const { userGidRecord, onFailedMessage, handleIncomingMessage, clickedOnUser, setClickedOnUser } = useChat()

    // Message field
    const textfieldRef = useRef<HTMLInputElement>()
    const [message, setMessage] = useState("")
    const caretStartPosition = useRef<number | null>(null)

    //Emoji Popup
    const popoverRef = useRef(null)
    const [isEmojiOpen, toggleIsEmojiOpen] = useToggle()

    const messageColor = useMemo(() => getRandomColor(), [])

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
                return m.trimStart()
            })
        },
        [setMessage],
    )

    useEffect(() => {
        if (clickedOnUser?.tabFactionID === faction_id && clickedOnUser.user) {
            setMessageWithCheck(` @${clickedOnUser.user.username}#${clickedOnUser.user.gid} `, true)
            setClickedOnUser(undefined)
            document.getElementById(`message-textfield-${faction_id}`)?.focus()
        }
    }, [clickedOnUser, faction_id, focusCaretTextField, setClickedOnUser, setMessageWithCheck])

    const sendMessage = useCallback(async () => {
        if (!message.trim()) return
        const messageCleanedUpTags = message.replace(/@[^@#]+#/g, "#")

        const id = uuidv4()
        const sentAt = new Date()
        const taggedUserGids = taggedGIDs(messageCleanedUpTags)

        const msg: ChatMessage = {
            id,
            data: {
                id: id,
                from_user: user,
                user_rank: userRank,
                message_color: messageColor,
                message: messageCleanedUpTags,
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
                message: messageCleanedUpTags,
                message_color: messageColor,
                tagged_users_gids: taggedUserGids,
            })
            if (!resp) return
        } catch (e) {
            onFailedMessage(id)
            newSnackbarMessage(typeof e === "string" ? e : "Failed to send chat message.", "error")
            console.error(e)
        }
    }, [message, user, send, handleIncomingMessage, userRank, messageColor, faction_id, newSnackbarMessage, onFailedMessage, taggedGIDs])

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
                        primaryColor={theme.factionTheme.primary}
                        faction_id={faction_id}
                        message={message}
                        setMessageWithCheck={setMessageWithCheck}
                        caretStartPosition={caretStartPosition}
                    />

                    <TagPlayer faction_id={faction_id} message={message} setMessageWithCheck={setMessageWithCheck} caretStartPosition={caretStartPosition} />

                    <NiceTextField
                        id={`message-textfield-${faction_id}`}
                        primaryColor={theme.factionTheme.primary}
                        value={message}
                        placeholder="Send a message..."
                        inputRef={textfieldRef}
                        onChange={(msg, e) => {
                            setMessageWithCheck(msg)
                            if (e) caretStartPosition.current = e.target.selectionStart
                        }}
                        onFocus={(e) => {
                            e.preventDefault()
                            focusCaretTextField()
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                            e.stopPropagation()
                            switch (e.key) {
                                case "Enter": {
                                    e.preventDefault()
                                    sendMessage()
                                    break
                                }
                                case "Tab":
                                case "ArrowUp": {
                                    e.preventDefault()
                                    document.getElementById(`emoji-index-${faction_id}-0`)?.focus() ||
                                        document.getElementById(`search-player-results-0`)?.focus()
                                    break
                                }
                            }
                        }}
                        type="text"
                        multiline
                        maxRows={4}
                        hiddenLabel
                        InputProps={{
                            sx: {
                                minHeight: "5rem",
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <NiceTooltip placement="top-end" text="Use keyboard shortcut ' : '">
                                        <NiceButton
                                            ref={popoverRef}
                                            corners
                                            buttonColor={theme.factionTheme.primary}
                                            onClick={() => toggleIsEmojiOpen()}
                                            sx={{ mr: "1rem", p: ".5rem" }}
                                        >
                                            <SvgEmoji size="2rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                                        </NiceButton>
                                    </NiceTooltip>

                                    <NiceButton corners buttonColor={theme.factionTheme.contrast_primary} onClick={sendMessage} sx={{ p: ".5rem" }}>
                                        <SvgSend size="2rem" fill="#FFFFFF" sx={{ pb: 0 }} />
                                    </NiceButton>
                                </InputAdornment>
                            ),
                        }}
                    />

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
                        primaryColor={theme.factionTheme.primary}
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
            message,
            sendMessage,
            setMessageWithCheck,
            showCharCount,
            theme.factionTheme.contrast_primary,
            theme.factionTheme.primary,
            toggleIsEmojiOpen,
        ],
    )
}
