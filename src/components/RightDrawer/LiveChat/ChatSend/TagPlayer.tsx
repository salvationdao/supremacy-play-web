import { MenuItem, MenuList, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useAuth, useChat } from "../../../../containers"
import { User } from "../../../../types"

export const TagPlayer = ({
    faction_id,
    message,
    setMessageWithCheck,
    caretStartPosition,
}: {
    faction_id: string | null
    message: string
    setMessageWithCheck: (newMessage: string, append?: boolean) => void
    caretStartPosition: React.MutableRefObject<number | null>
}) => {
    const { userID } = useAuth()
    const { globalActivePlayers, activePlayers } = useChat()

    const [caretMsg, setCaretMsg] = useState<string>("")
    const [playersResults, setPlayersResults] = useState<User[]>([])

    // While the user is using @xxx shortcut - finding the search phrase and setting caret (cursor) positioning
    const handlePlayerSearchShortcut = useCallback(
        (msg: string) => {
            //there should always be a caret position or the element is not focused
            if (caretStartPosition.current) {
                //finds the string from the start of the message to the caret string - allows for multiple @s to be used in a message and focus only where the user is typing
                const caretString = msg.substring(0, caretStartPosition.current)
                //sets for use in another function
                setCaretMsg(caretString)
                //getting last index of shortcut key: @
                const colonIndex = caretString.lastIndexOf("@")
                //if there is an @, run the next block of code
                if (colonIndex != -1) {
                    //gets the string from the first letter after the @ to the end of the caret position
                    const afterColonSubstring = caretString.substring(colonIndex + 1)
                    //identifies if theres a space, if there is one and marks it as the end of the search query
                    const searchStringEndIndex = afterColonSubstring.indexOf(" ")
                    const searchString = afterColonSubstring.substring(0, searchStringEndIndex !== -1 ? searchStringEndIndex : caretString.length)

                    //if there is no matches, clear the results
                    if (searchStringEndIndex !== -1) {
                        setPlayersResults([])
                        return
                    }

                    if (searchString) {
                        const players = faction_id ? activePlayers : globalActivePlayers
                        const filteredPlayers = players.filter((ap) => {
                            return ap.id !== userID && (ap.username.includes(searchString) || ap.gid.toString().includes(searchString))
                        })

                        // Limit to top 10 results, else too many
                        setPlayersResults(filteredPlayers.slice(0, 10))
                    }
                }
            }
        },
        [activePlayers, caretStartPosition, faction_id, globalActivePlayers, userID],
    )

    // After user has selected an item - deconstructs string before and after the item enter point and reconstructs the message string
    const handlePlayerTagSelect = useCallback(
        (taggedUser: User) => {
            //getting the index of the last @ of the string from the start of the message to the caret (cursor) position
            const index = caretMsg.lastIndexOf("@")
            //if there is an index, run the next block of code
            if (index != -1) {
                //saving the string before the colon
                const stringBefore = caretMsg.substring(0, index)
                //initializing the full string to be the string before the colon and the chosen item
                let fullString = `${stringBefore + "@" + taggedUser.username + "#" + taggedUser.gid + " "}`
                //caretPosition can be null if elements not focused, but shouldn't be in this use case, getting string after the caret position in case user uses this in middle of message
                if (caretStartPosition.current) {
                    //finding the string after the caret position
                    const stringAfter = message.substring(caretStartPosition.current, message.length)
                    caretStartPosition.current += message.length
                    //setting the full string to add the string after
                    fullString = `${fullString + stringAfter}`
                }
                //setting item Array, to close out the item selector
                setPlayersResults([])
                //setting message
                setMessageWithCheck(fullString)
            }
        },
        [caretMsg, caretStartPosition, setMessageWithCheck, message],
    )

    useEffect(() => {
        setPlayersResults([])
        handlePlayerSearchShortcut(message)
    }, [caretStartPosition, handlePlayerSearchShortcut, message])

    if (playersResults.length <= 0) {
        return null
    }

    return (
        <MenuList
            sx={{
                background: "#49494933",
                mb: ".8rem",
                boxShadow: 4,
                borderRadius: 1,
            }}
        >
            <Stack direction={"column-reverse"}>
                {playersResults.map((plr, i) => {
                    return (
                        <MenuItem
                            key={plr.id}
                            id={"search-player-results-" + i}
                            dense
                            onClick={() => {
                                handlePlayerTagSelect(plr)
                                document.getElementById(`message-textfield-${faction_id}`)?.focus()
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") e.preventDefault()
                                e.stopPropagation()

                                switch (e.key) {
                                    case "ArrowUp": {
                                        if (i === playersResults.length - 1) {
                                            break
                                        }
                                        document.getElementById(`search-player-results-${i + 1}`)?.focus()
                                        break
                                    }
                                    case "ArrowDown": {
                                        if (i === 0) {
                                            document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                            break
                                        }
                                        document.getElementById(`search-player-results-${i - 1}`)?.focus()
                                        break
                                    }
                                    case "Escape": {
                                        document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                        break
                                    }
                                    case "Tab": {
                                        handlePlayerTagSelect(plr)
                                        document.getElementById(`message-textfield-${faction_id}`)?.focus()
                                    }
                                }
                            }}
                        >
                            <Typography>{plr.username + " #" + plr.gid}</Typography>
                        </MenuItem>
                    )
                })}
            </Stack>
        </MenuList>
    )
}
