import { Box, Stack, Typography } from "@mui/material"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useState } from "react"
import { TextMessageData } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"

interface ReactionsProps {
    fontSize: string
    message: TextMessageData
    hoverOnly?: boolean
}

interface ReactMessageSendProps {
    chat_history_id: string
    likes: number
    dislikes: number
}

type ReactionState = "none" | "like" | "dislike"

const hoverStyles = {
    alignItems: "center",
    mr: "-1rem",
    position: "absolute",
    opacity: "0.9",
    top: "-2.2rem",
    right: "1rem",
    backgroundColor: "#121212",
    borderRadius: ".3rem",
}

const styles = {
    width: "fit-content",
    alignItems: "center",
    borderRadius: ".3rem",
    opacity: "0.4",
    ":hover": {
        opacity: "0.8",
    },
    m: "-.3rem",
}
export const Reactions = ({ fontSize, message, hoverOnly = false }: ReactionsProps) => {
    const [reaction, setReaction] = useState<ReactionState>("none")
    const { send } = useGameServerCommandsUser("/user_commander")

    const handleReactionSend = async (reactMessageSend: ReactMessageSendProps) => {
        try {
            const resp = await send<boolean, ReactMessageSendProps>(GameServerKeys.ReactToMessage, reactMessageSend)
            if (!resp) return
            console.log(resp)
        } catch (e) {
            console.error(e)
        }
    }

    const handleLike = () => {
        if (!message || !message.id) return

        const reactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            likes: message.metadata ? message.metadata.likes.likes : 0,
            dislikes: message.metadata ? message.metadata.likes.dislikes : 0,
        }
        switch (reaction) {
            case "dislike":
                reactMessage.likes = reactMessage.likes + 1
                reactMessage.dislikes = reactMessage.dislikes - 1
                setReaction("like")
                break
            case "like":
                reactMessage.likes = reactMessage.likes - 1
                setReaction("none")
                break
            default:
                //case "none":
                reactMessage.likes = reactMessage.likes + 1
                setReaction("like")
                break
        }

        //update cached messages
        //send to backend to alter net likes
        handleReactionSend(reactMessage)
    }

    const handleDislike = () => {
        if (!message || !message.id) return

        const reactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            likes: message.metadata ? message.metadata.likes.likes : 0,
            dislikes: message.metadata ? message.metadata.likes.dislikes : 0,
        }

        switch (reaction) {
            case "dislike":
                reactMessage.dislikes = reactMessage.dislikes - 1
                setReaction("none")
                break
            case "like":
                reactMessage.dislikes = reactMessage.dislikes + 1
                reactMessage.likes = reactMessage.likes - 1
                setReaction("dislike")
                break
            default:
                //case "none":
                reactMessage.dislikes = reactMessage.dislikes + 1
                setReaction("dislike")
                break
        }

        //update cached messages
        //send to backend to alter net likes
        handleReactionSend(reactMessage)
    }

    //only display if net !== 0 or is hovered
    return (
        <Stack direction={"row"} spacing={"-.4rem"} sx={hoverOnly ? hoverStyles : styles}>
            <SvgPriceDownArrow size={"2.5rem"} onClick={() => handleDislike()} />
            <Typography fontSize={"1.2rem"}>120</Typography>
            <SvgPriceUpArrow size={"2.5rem"} onClick={() => handleLike()} />
        </Stack>
    )
}
