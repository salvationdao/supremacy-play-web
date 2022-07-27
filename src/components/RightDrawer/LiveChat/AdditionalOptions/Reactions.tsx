import { Box, Stack, Typography } from "@mui/material"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useState } from "react"

interface ReactionsProps {
    fontSize: string
    //likes: Likes
    hoverOnly?: boolean
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
export const Reactions = ({ fontSize, hoverOnly = false }: ReactionsProps) => {
    const [reaction, setReaction] = useState<ReactionState>("none")

    const handleLike = () => {
        let amount: number

        switch (reaction) {
            case "dislike":
                amount = 2
                setReaction("like")
                break
            case "like":
                amount = -1
                setReaction("none")
                break
            default:
                //case "none":
                amount = 1
                setReaction("like")
                break
        }

        //update cached messages
        //send to backend to alter net likes
    }

    const handleDislike = () => {
        let amount: number

        switch (reaction) {
            case "dislike":
                amount = 1
                setReaction("none")
                break
            case "like":
                amount = -2
                setReaction("dislike")
                break
            default:
                //case "none":
                amount = -1
                setReaction("dislike")
                break
        }

        //update cached messages
        //send to backend to alter net likes
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
