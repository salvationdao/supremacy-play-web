import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { colors, fonts } from "../../../../theme/theme"

export const General = ({
    isGridView,
    children,
    title,
    text,
    textColor,
}: {
    isGridView?: boolean
    children?: ReactNode
    title?: string
    text?: string
    textColor?: string
}) => {
    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                {title || "INFO"}
            </Typography>

            {text && (
                <Typography
                    sx={{
                        color: textColor || "#FFFFFF",
                        fontWeight: "fontWeightBold",
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {text}
                </Typography>
            )}

            {children}
        </Stack>
    )
}