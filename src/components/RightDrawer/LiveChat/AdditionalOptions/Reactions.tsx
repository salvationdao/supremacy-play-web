import { Stack, Typography } from "@mui/material"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useEffect, useState } from "react"
import { Likes, TextMessageData } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useAuth, useChat } from "../../../../containers"
import { colors } from "../../../../theme/theme"

interface ReactionsProps {
    fontSize: string
    factionColor?: string
    message: TextMessageData
    hoverOnly?: boolean
}

interface ReactMessageSendProps {
    chat_history_id: string
    reaction: ReactionState
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
export const Reactions = ({ fontSize, factionColor, message, hoverOnly = false }: ReactionsProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user } = useAuth()
    const { reactMessage } = useChat()

    const handleReactionSend = async (reactMessageSend: ReactMessageSendProps) => {
        if (!message.id) return

        try {
            const resp = await send<Likes, ReactMessageSendProps>(GameServerKeys.ReactToMessage, reactMessageSend)
            if (!resp) return
            reactMessage(message.id, resp)
        } catch (e) {
            console.error(e)
        }
    }

    const handleLike = () => {
        if (!message || !message.id) return

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            reaction: "like",
        }

        handleReactionSend(sendReactMessage)
    }

    const handleDislike = () => {
        if (!message || !message.id) return

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            reaction: "dislike",
        }

        handleReactionSend(sendReactMessage)
    }

    //only display if net !== 0 or is hovered
    return (
        <Stack direction={"row"} spacing={"-.4rem"} sx={hoverOnly ? hoverStyles : styles}>
            <SvgPriceDownArrow
                size={"2.5rem"}
                fill={message.metadata?.likes.dislikes.includes(user.id) && factionColor ? factionColor : colors.lightGrey}
                sx={{
                    ":hover": {
                        cursor: "pointer",
                    },
                }}
                onClick={() => handleDislike()}
            />
            <Typography fontSize={"1.2rem"}>{message.metadata ? message.metadata.likes.net : 0}</Typography>
            <SvgPriceUpArrow
                size={"2.5rem"}
                fill={message.metadata?.likes.likes.includes(user.id) && factionColor ? factionColor : colors.lightGrey}
                sx={{
                    ":hover": {
                        cursor: "pointer",
                    },
                }}
                onClick={() => handleLike()}
            />
        </Stack>
    )
}
