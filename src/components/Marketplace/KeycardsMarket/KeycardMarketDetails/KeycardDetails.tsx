import { Box, Typography } from "@mui/material"
import { fonts } from "../../../../theme/theme"
import { MarketKeycard } from "../../../../types/marketplace"

export const KeycardDetails = ({ keycard, primaryColor }: { keycard?: MarketKeycard; primaryColor: string }) => {
    if (!keycard) return null

    const { description } = keycard

    if (!description) return null

    return (
        <Box>
            <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                DESCRIPTION
            </Typography>
            <Typography variant="h5">{description}</Typography>
        </Box>
    )
}
