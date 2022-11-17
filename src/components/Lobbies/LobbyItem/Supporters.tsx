import { Stack, Typography } from "@mui/material"
import { fonts } from "../../../theme/theme"

export const Supporters = () => {
    return (
        <Stack direction="row" alignItems="center" sx={{ height: "4rem", backgroundColor: "#00000040", p: ".4rem 1.5rem" }}>
            <Typography variant="body2" fontFamily={fonts.nostromoBold}>
                Supporters:
            </Typography>
        </Stack>
    )
}
