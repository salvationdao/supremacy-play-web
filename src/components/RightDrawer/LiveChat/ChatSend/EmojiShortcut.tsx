import { Box, IconButton, Typography } from "@mui/material"
import { BaseEmoji, emojiIndex } from "emoji-mart"
import { useCallback, useEffect, useState } from "react"
import { SvgEmojiSelector } from "../../../../assets"

export const EmojiShortcut = ({
    primaryColor,
    faction_id,
    message,
    setMessageWithCheck,
    caretStartPosition,
}: {
    primaryColor: string
    faction_id: string | null
    message: string
    setMessageWithCheck: (newMessage: string, append?: boolean) => void
    caretStartPosition: React.MutableRefObject<number | null>
}) => {
    const [caretMsg, setCaretMsg] = useState<string>("")
    const [emojis, setEmojis] = useState<BaseEmoji[]>([])
    const [emojiSelect, setEmojiSelect] = useState<number>()

    // While the user is using :emoji shortcut - finding the search phrase and setting caret (cursor) positioning
    const handleEmojiShortcut = useCallback(
        (msg: string) => {
            //there should always be a caret position or the element is not focused
            if (caretStartPosition.current) {
                //finds the string from the start of the message to the caret string - allows for multiple colons to be used in a message and focus only where the user is typing
                const caretString = msg.substring(0, caretStartPosition.current)
                //sets for use in another function
                setCaretMsg(caretString)
                //getting last index of shortcut key: :
                const colonIndex = caretString.lastIndexOf(":")
                //if there is a colon, run the next block of code
                if (colonIndex != -1) {
                    //gets the string from the first letter after the colon to the end of the caret position
                    const afterColonSubstring = caretString.substring(colonIndex + 1)
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
                        //search the emoji Index and set the array - top 15 returned results
                        const searchArr = emojiIndex.search(searchString)?.slice(0, 15)
                        setEmojis(searchArr as BaseEmoji[])
                    }
                }
            }
        },
        [caretStartPosition],
    )

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
                if (caretStartPosition.current) {
                    //finding the string after the caret position
                    const stringAfter = message.substring(caretStartPosition.current, message.length)
                    //setting the full string to add the string after
                    fullString = `${fullString + stringAfter}`
                }
                //setting Emojis Array, to close out the Emoji selector
                setEmojis([])
                //setting the Select to no emojis
                setEmojiSelect(undefined)
                //setting message
                setMessageWithCheck(fullString)
            }
        },
        [caretMsg, caretStartPosition, message, setMessageWithCheck],
    )

    useEffect(() => {
        setEmojis([])
        setEmojiSelect(undefined)
        handleEmojiShortcut(message)
    }, [caretStartPosition, handleEmojiShortcut, message])

    if (emojis.length <= 0) {
        return null
    }

    return (
        <Box
            sx={{
                background: "#49494933",
                mb: ".8rem",
                boxShadow: 4,
                borderRadius: 1,
                width: "100%",
                display: "flex",
                p: ".5rem",
                overflowX: "scroll",
            }}
        >
            {emojis.map((emo, i) => {
                return (
                    <Box key={emo.unified} sx={{ position: "relative" }}>
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
                                handleOnEmojiSelect(emo)
                                document.getElementById(`message-textfield-${faction_id}`)?.focus()
                            }}
                            onFocus={() => {
                                setEmojiSelect(i)
                            }}
                            onBlur={() => {
                                setEmojiSelect(undefined)
                            }}
                            onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                                if (e.key !== "Enter") e.preventDefault()
                                e.stopPropagation()

                                switch (e.key) {
                                    case "ArrowLeft": {
                                        let prev = i - 1

                                        if (prev <= -1) {
                                            prev = emojis.length - 1
                                        }
                                        document.getElementById(`emoji-index-${faction_id}-${prev}`)?.focus()
                                        break
                                    }
                                    case "ArrowRight": {
                                        let next = i + 1

                                        if (next >= emojis.length) {
                                            next = 0
                                        }
                                        document.getElementById(`emoji-index-${faction_id}-${next}`)?.focus()
                                        break
                                    }
                                    case "ArrowDown": {
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
                                    case "Tab": {
                                        handleOnEmojiSelect(emo)
                                        document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                    }
                                }
                            }}
                        >
                            <Typography fontSize="3rem">{emo.native}</Typography>
                        </IconButton>
                    </Box>
                )
            })}
        </Box>
    )
}
