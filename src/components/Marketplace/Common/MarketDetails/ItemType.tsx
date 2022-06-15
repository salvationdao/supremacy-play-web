import { Box, Typography } from "@mui/material"
import { colors, fonts } from "../../../../theme/theme"

export const ItemType = ({ itemType }: { itemType: string }) => {
    return (
        <Box>
            <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                ITEM TYPE:
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                {itemType}
            </Typography>
        </Box>
    )
}
