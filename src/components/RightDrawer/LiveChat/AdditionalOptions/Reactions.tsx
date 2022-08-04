import { Stack, Typography } from "@mui/material"
import { useCallback } from "react"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useAuth, useSnackbar } from "../../../../containers"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { Likes, TextMessageData } from "../../../../types"

interface ReactionsProps {
    fontSize: number
    data: TextMessageData
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
    mx: "-.3rem",
    zIndex: 1,
}

export const Reactions = ({ fontSize, data, hoverOnly = false }: ReactionsProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user } = useAuth()
    const { newSnackbarMessage } = useSnackbar()

    const handleReactionSend = useCallback(
        async (reactMessageSend: ReactMessageSendProps) => {
            if (!data.id) return

            try {
                const resp = await send<Likes, ReactMessageSendProps>(GameServerKeys.ReactToMessage, reactMessageSend)
                if (!resp) return
            } catch (e) {
                console.error(e)
            }
        },
        [data, send],
    )

    const handleLike = useCallback(() => {
        if (!data || !data.id) return
        if (data.from_user.id === user.id) {
            newSnackbarMessage("Can't react to your own message!", "warning")
            return
        }

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: data.id,
            reaction: "like",
        }

        handleReactionSend(sendReactMessage)
    }, [handleReactionSend, data, user, newSnackbarMessage])

    const handleDislike = useCallback(() => {
        if (!data || !data.id) return
        if (data.from_user.id === user.id) {
            newSnackbarMessage("Can't react to your own message!", "warning")
            return
        }

        const sendReactMessage: ReactMessageSendProps = {
            chat_history_id: data.id,
            reaction: "dislike",
        }

        handleReactionSend(sendReactMessage)
    }, [handleReactionSend, data, user, newSnackbarMessage])

    //only display if net !== 0 or is hovered
    return (
        <Stack direction={"row"} alignItems="center" spacing={"-.2rem"} sx={hoverOnly ? hoverStyles : styles}>
            <SvgPriceDownArrow
                size={`${fontSize * 2.2}rem`}
                fill={data.metadata?.likes.dislikes.includes(user.id) ? colors.red : colors.lightGrey}
                sx={{
                    ":hover": {
                        cursor: data.from_user.id === user.id ? "cursor" : "pointer",
                    },
                }}
                onClick={() => handleDislike()}
            />

            <Typography fontSize={`${fontSize * 0.9}rem`}>{data.metadata ? data.metadata.likes.net : 0}</Typography>

            <SvgPriceUpArrow
                size={`${fontSize * 2.2}rem`}
                fill={data.metadata?.likes.likes.includes(user.id) ? colors.green : colors.lightGrey}
                sx={{
                    ":hover": {
                        cursor: data.from_user.id === user.id ? "cursor" : "pointer",
                    },
                }}
                onClick={() => handleLike()}
            />
        </Stack>
    )
}
