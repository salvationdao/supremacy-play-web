import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"

export const Supporters = () => {
    return (
        <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
            <Typography variant="body2" fontFamily={fonts.nostromoBold}>
                Supporters:
            </Typography>
        </Stack>
    )
}
