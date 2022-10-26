import { Box, Typography } from "@mui/material"
import { fonts } from "../../theme/theme"

export const KeyboardKey = ({ label }: { label: string }) => {
    return (
        <Box sx={{ p: ".3rem .3rem", pt: ".4rem", border: `#FFFFFF 1px solid`, borderRadius: ".4rem" }}>
            <Typography variant="subtitle2" sx={{ lineHeight: 1, fontFamily: fonts.nostromoBold }}>
                {label}
            </Typography>
        </Box>
    )
}
