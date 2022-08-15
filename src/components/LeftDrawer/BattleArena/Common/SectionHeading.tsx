import { Box, Typography } from "@mui/material"
import { fonts } from "../../../../theme/theme"

export const SectionHeading = ({ label }: { label: string }) => {
    return (
        <Box sx={{ p: ".6rem 1.2rem", background: (theme) => `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}BB)` }}>
            <Typography variant="h6" sx={{ color: (theme) => theme.factionTheme.secondary, fontFamily: fonts.nostromoHeavy }}>
                {label}
            </Typography>
        </Box>
    )
}
