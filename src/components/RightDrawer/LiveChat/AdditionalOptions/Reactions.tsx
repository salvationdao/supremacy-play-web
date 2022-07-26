import { Stack, Typography } from "@mui/material"
import { SvgThumbDownOffAltIcon, SvgThumbUpOffAltIcon } from "../../../../assets"
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

    return (
        <Stack direction={"row"} spacing={".5rem"} sx={{ alignItems: "center" }}>
            <SvgThumbDownOffAltIcon size={"1.7rem"} onClick={() => handleDislike()} />
            <Typography fontSize={"1.2rem"}>12</Typography>
            <SvgThumbUpOffAltIcon size={"1.7rem"} onClick={() => handleLike()} />
        </Stack>
    )
}
