import { Stack, Typography } from "@mui/material"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useEffect, useState } from "react"
import { Likes, TextMessageData } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useAuth, useChat } from "../../../../containers"

interface ReactionsProps {
    fontSize: string
    message: TextMessageData
    hoverOnly?: boolean
}

interface ReactMessageSendProps {
    chat_history_id: string
    likes: string[]
    dislikes: string[]
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
    const { user } = useAuth()
    const { reactMessage } = useChat()
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

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            likes: message.metadata ? message.metadata.likes.likes : ([] as string[]),
            dislikes: message.metadata ? message.metadata.likes.dislikes : ([] as string[]),
        }
        switch (reaction) {
            case "dislike":
                sendReactMessage.dislikes = sendReactMessage.dislikes.filter((x) => x !== user.id)
                sendReactMessage.likes = [...sendReactMessage.likes, user.id]
                setReaction("like")
                break
            case "like":
                sendReactMessage.likes = sendReactMessage.likes.filter((x) => x !== user.id)
                setReaction("none")
                break
            default:
                //case "none":
                sendReactMessage.likes = [...sendReactMessage.likes, user.id]
                setReaction("like")
                break
        }
        const updatedMetadata: Likes = {
            likes: sendReactMessage.likes,
            dislikes: sendReactMessage.dislikes,
            net: sendReactMessage.likes.length - sendReactMessage.dislikes.length,
        }

        //update cached messages
        reactMessage(message.id, updatedMetadata)

        //send to backend to alter net likes
        handleReactionSend(sendReactMessage)
    }

    const handleDislike = () => {
        if (!message || !message.id) return

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            likes: message.metadata ? message.metadata.likes.likes : ([] as string[]),
            dislikes: message.metadata ? message.metadata.likes.dislikes : ([] as string[]),
        }

        switch (reaction) {
            case "dislike":
                sendReactMessage.dislikes = sendReactMessage.dislikes.filter((x) => x !== user.id)
                setReaction("none")
                break
            case "like":
                sendReactMessage.likes = sendReactMessage.likes.filter((x) => x !== user.id)
                sendReactMessage.dislikes = [...sendReactMessage.dislikes, user.id]
                setReaction("dislike")
                break
            default:
                //case "none":
                sendReactMessage.dislikes = [...sendReactMessage.dislikes, user.id]
                setReaction("dislike")
                break
        }
        const updatedMetadata: Likes = {
            likes: sendReactMessage.likes,
            dislikes: sendReactMessage.dislikes,
            net: sendReactMessage.likes.length - sendReactMessage.dislikes.length,
        }

        //update cached messages
        reactMessage(message.id, updatedMetadata)
        //send to backend to alter net likes
        handleReactionSend(sendReactMessage)
    }

    //only display if net !== 0 or is hovered
    return (
        <Stack direction={"row"} spacing={"-.4rem"} sx={hoverOnly ? hoverStyles : styles}>
            <SvgPriceDownArrow size={"2.5rem"} onClick={() => handleDislike()} />
            <Typography fontSize={"1.2rem"}>{message.metadata ? message.metadata.likes.net : 0}</Typography>
            <SvgPriceUpArrow size={"2.5rem"} onClick={() => handleLike()} />
        </Stack>
    )
}
