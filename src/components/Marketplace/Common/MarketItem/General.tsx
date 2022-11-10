import { Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { colors, fonts } from "../../../../theme/theme"
import { TruncateTextLines } from "../../../../theme/styles"

export const General = ({
    isGridView,
    children,
    title,
    text,
    textColor,
    isGridViewCompact,
}: {
    isGridView?: boolean
    children?: ReactNode
    title?: string
    text?: string
    textColor?: string
    isGridViewCompact?: boolean
}) => {
    return (
        <Stack
            direction={isGridViewCompact ? "row" : "column"}
            spacing={isGridView ? ".1rem" : ".6rem"}
            sx={{ flexShrink: 0 }}
            alignItems={isGridViewCompact ? "center" : "flex-start"}
        >
            <Typography variant="subtitle1" sx={{ fontFamily: fonts.nostromoBlack, color: colors.grey }}>
                {title || "INFO"}
                {isGridViewCompact ? ":" : ""}
            </Typography>

            {text && (
                <Typography
                    sx={{
                        color: textColor || "#FFFFFF",
                        fontWeight: "bold",
                        ...TruncateTextLines(2),
                    }}
                >
                    {text}
                </Typography>
            )}

            {children}
        </Stack>
    )
}
