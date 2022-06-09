import { Box, Typography } from "@mui/material"
import { fonts } from "../../../../theme/theme"
import { MarketCrate } from "../../../../types/marketplace"

export const CrateDetails = ({ crate, primaryColor }: { crate?: MarketCrate; primaryColor: string }) => {
    if (!crate) return null

    const { description } = crate

    return (
        <Box>
            <Typography gutterBottom variant="h5" sx={{ color: primaryColor, fontFamily: fonts.nostromoBlack }}>
                DESCRIPTION
            </Typography>
            <Typography variant="h5">{description}</Typography>
        </Box>
    )
}
