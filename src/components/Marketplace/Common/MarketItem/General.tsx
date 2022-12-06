import { Stack } from "@mui/material"
import { ReactNode } from "react"
import { colors, fonts } from "../../../../theme/theme"
import { TypographyTruncated } from "../../../Common/TypographyTruncated"

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
            justifyContent={isGridViewCompact ? "space-between" : "flex-start"}
        >
            <TypographyTruncated variant="subtitle1" sx={{ fontFamily: fonts.nostromoBlack, color: colors.grey }}>
                {title || "INFO"}
                {isGridViewCompact ? ":" : ""}
            </TypographyTruncated>

            {text && <TypographyTruncated sx={{ color: textColor || "#FFFFFF", fontWeight: "bold" }}>{text}</TypographyTruncated>}

            {children}
        </Stack>
    )
}
