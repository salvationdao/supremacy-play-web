import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { colors, fonts } from "../../../theme/theme"

export const QuestionSection = ({
    primaryColor,
    question,
    description,
    children,
}: {
    primaryColor: string
    question: string
    description?: string
    children: ReactNode
}) => {
    return (
        <Stack direction="row" alignItems="flex-start" spacing="3rem">
            <Box sx={{ width: "36rem" }}>
                <Typography gutterBottom variant="h6" sx={{ color: primaryColor, fontFamily: fonts.nostromoHeavy }}>
                    {question}
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
