import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { colors, fonts } from "../../../theme/theme"

export const QuestionSection = ({
    disabled,
    primaryColor,
    question,
    description,
    children,
    isOptional,
}: {
    disabled?: boolean
    primaryColor: string
    question: string
    description?: string
    children: ReactNode
    isOptional?: boolean
}) => {
    return (
        <Stack direction="row" alignItems="flex-start" spacing="5rem" sx={{ opacity: disabled ? 0.4 : 1, pointerEvents: disabled ? "none" : "unset" }}>
            <Box sx={{ width: "38rem" }}>
                <Typography gutterBottom variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoHeavy }}>
                    {question}
                    {isOptional ? (
                        <span style={{ color: colors.lightNeonBlue, letterSpacing: "1px" }}>
                            <strong> (OPTIONAL)</strong>
                        </span>
                    ) : (
                        <span style={{ color: colors.red, fontFamily: "inherit", letterSpacing: "1px" }}> *</span>
                    )}
                </Typography>
                {description && (
                    <Typography variant="h6" sx={{ color: colors.lightGrey }}>
                        {description}
                    </Typography>
                )}
            </Box>
            {children}
        </Stack>
    )
}
