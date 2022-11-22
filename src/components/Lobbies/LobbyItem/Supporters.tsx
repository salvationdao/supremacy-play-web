import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"

export const Supporters = () => {
    return (
        <Stack direction="row" alignItems="center" sx={{ height: "4.5rem", p: "0 1.5rem" }}>
            <Typography variant="body2" fontFamily={fonts.nostromoBold}>
                Supporters:
            </Typography>
        </Stack>
    )
}
