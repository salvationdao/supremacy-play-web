import { Stack, Typography } from "@mui/material"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useCallback } from "react"
import { Faction, Likes, TextMessageData } from "../../../../types"
import { GameServerKeys } from "../../../../keys"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { useAuth, useSnackbar } from "../../../../containers"
import { colors } from "../../../../theme/theme"

interface ReactionsProps {
    fontSize: number
    message: TextMessageData
    getFaction: (factionID: string) => Faction
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
    zIndex: 1,
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
    zIndex: 1,
}
export const Reactions = ({ fontSize, message, getFaction, hoverOnly = false }: ReactionsProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user } = useAuth()
    const { newSnackbarMessage } = useSnackbar()

    const factionColor = getFaction(user.faction_id).primary_color

    const handleReactionSend = useCallback(
        async (reactMessageSend: ReactMessageSendProps) => {
            if (!message.id) return

            try {
                const resp = await send<Likes, ReactMessageSendProps>(GameServerKeys.ReactToMessage, reactMessageSend)
                if (!resp) return
            } catch (e) {
                console.error(e)
            }
        },
        [message, send],
    )

    const handleLike = useCallback(() => {
        if (!message || !message.id) return
        if (message.from_user.id === user.id) {
            newSnackbarMessage("Can't react to your own message!", "warning")
            return
        }

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            reaction: "like",
        }

        handleReactionSend(sendReactMessage)
    }, [handleReactionSend, message, user, newSnackbarMessage])

    const handleDislike = useCallback(() => {
        if (!message || !message.id) return
        if (message.from_user.id === user.id) {
            newSnackbarMessage("Can't react to your own message!", "warning")
            return
        }

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: message.id,
            reaction: "dislike",
        }

        handleReactionSend(sendReactMessage)
    }, [handleReactionSend, message, user, newSnackbarMessage])

    //only display if net !== 0 or is hovered
    return (
        <Stack direction={"row"} spacing={"-.4rem"} sx={hoverOnly ? hoverStyles : styles}>
            <SvgPriceDownArrow
                size={`${fontSize * 2.2}rem`}
                fill={message.metadata?.likes.dislikes.includes(user.id) && factionColor ? factionColor : colors.lightGrey}
                sx={{
                    ":hover": {
                        cursor: message.from_user.id === user.id ? "cursor" : "pointer",
                    },
                }}
                onClick={() => handleDislike()}
            />
            <Typography fontSize={`${fontSize * 0.9}rem`}>{message.metadata ? message.metadata.likes.net : 0}</Typography>
            <SvgPriceUpArrow
                size={`${fontSize * 2.2}rem`}
                fill={message.metadata?.likes.likes.includes(user.id) && factionColor ? factionColor : colors.lightGrey}
                sx={{
                    ":hover": {
                        cursor: message.from_user.id === user.id ? "cursor" : "pointer",
                    },
                }}
                onClick={() => handleLike()}
            />
        </Stack>
    )
}
