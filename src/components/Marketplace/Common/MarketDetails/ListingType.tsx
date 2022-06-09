import { Box, Typography, Stack } from "@mui/material"
import { ReactNode } from "react"
import { colors, fonts } from "../../../../theme/theme"

export const ListingType = ({ primaryColor, listingTypeLabel, icon }: { primaryColor: string; listingTypeLabel: string; icon: ReactNode }) => {
    return (
        <Box>
            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                LISTING TYPE:
            </Typography>
            <Stack direction="row" alignItems="center" spacing=".8rem">
                {icon}
                <Typography variant="h5" sx={{ color: primaryColor, fontWeight: "fontWeightBold" }}>
                    {listingTypeLabel}
                </Typography>
            </Stack>
        </Box>
    )
}
