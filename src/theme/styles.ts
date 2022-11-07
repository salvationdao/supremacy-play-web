import { SxProps } from "@mui/material"

export const TruncateTextLines = (numLines = 1): SxProps => ({
    display: "-webkit-box",
    overflow: "hidden",
    overflowWrap: "anywhere",
    textOverflow: "ellipsis",
    WebkitLineClamp: numLines,
    WebkitBoxOrient: "vertical",
})
