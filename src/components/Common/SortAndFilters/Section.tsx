import { Box, Stack, Typography } from "@mui/material"
import { ReactNode } from "react"
import { ClipThing } from "../.."
import { fonts } from "../../../theme/theme"

export const Section = ({
    label,
    primaryColor,
    secondaryColor,
    children,
    endComponent,
}: {
    label: string
    primaryColor: string
    secondaryColor: string
    children: ReactNode
    endComponent?: ReactNode
}) => {
    return (
        <Box>
            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: primaryColor,
                    borderThickness: ".25rem",
                }}
                corners={{
                    topRight: true,
                }}
                opacity={0.8}
                backgroundColor={primaryColor}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: "100%", px: "1.4rem", pt: ".7rem", pb: ".6rem" }}>
                    <Typography variant="caption" sx={{ color: secondaryColor, fontFamily: fonts.nostromoBlack }}>
                        {label}
                    </Typography>
                    {endComponent}
                </Stack>
            </ClipThing>

            <Box sx={{ px: "2rem", pt: "1.8rem", pb: "2.2rem" }}>{children}</Box>
        </Box>
    )
}
