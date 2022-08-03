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
    data: TextMessageData
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
export const Reactions = ({ fontSize, data, getFaction, hoverOnly = false }: ReactionsProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { user } = useAuth()
    const { newSnackbarMessage } = useSnackbar()

    const factionColor = getFaction(user.faction_id).primary_color

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
        console.log(data)
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
        <Stack direction={"row"} spacing={"-.4rem"} sx={hoverOnly ? hoverStyles : styles}>
            <SvgPriceDownArrow
                size={`${fontSize * 2.2}rem`}
                fill={data.metadata?.likes.dislikes.includes(user.id) && factionColor ? factionColor : colors.lightGrey}
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
                fill={data.metadata?.likes.likes.includes(user.id) && factionColor ? factionColor : colors.lightGrey}
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
