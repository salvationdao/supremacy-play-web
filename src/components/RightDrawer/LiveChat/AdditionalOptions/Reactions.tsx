import { Box, Stack, Typography } from "@mui/material"
import { SvgPriceDownArrow, SvgPriceUpArrow } from "../../../../assets"
import { useState } from "react"

interface ReactionsProps {
    fontSize: string
    //likes: Likes
}
type ReactionState = "none" | "like" | "dislike"

//functionality: -allowed 1 like or dislike
//States: no reactions - like(+1) dislike(-1)
//currently liked: like(-1) dislikes (-2)
//currently disliked: like (+2) dislike(+1)

//to be put in the header
// <Typography
// sx={{
//     alignSelf: "center",
//         flexShrink: 0,
//         ml: "auto",
//         color: "#FFFFFF",
//         opacity: 0.7,
//         fontSize: smallFontSize,
// }}
// >
// {dateFormatter(sentAt)}
// </Typography>

//to replace chatmessage
// <Stack
// direction={"row"}
// sx={{ ml: "2.1rem", justifyContent: "space-between" }}
// >
// {chatMessage}
// <Box sx={{ flexShrink: 0, alignSelf: "flex-end" }}>
//     <Reactions fontSize={smallFontSize} />
// </Box>
// </Stack>

export const Reactions = ({ fontSize }: ReactionsProps) => {
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
        <Stack direction={"row"} spacing={"-.5rem"} sx={{ alignItems: "center", mr: "-1rem", opacity: "0.7", ":hover": { opacity: "0.9" } }}>
            <SvgPriceDownArrow size={"2.5rem"} onClick={() => handleDislike()} />
            <Typography fontSize={"1.2rem"}>12</Typography>
            <SvgPriceUpArrow size={"2.5rem"} onClick={() => handleLike()} />
        </Stack>
    )
}
