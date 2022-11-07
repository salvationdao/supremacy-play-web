import { SxProps } from "@mui/material"

export const TruncateTextLines = (numLines = 1, isInline = false): SxProps => ({
    display: isInline ? "-webkit-inline-box" : "-webkit-box",
    overflow: "hidden",
    overflowWrap: "anywhere",
    textOverflow: "ellipsis",
    WebkitLineClamp: numLines,
    WebkitBoxOrient: "vertical",
})
