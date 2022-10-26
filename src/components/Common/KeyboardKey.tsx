import { Stack, Typography } from "@mui/material"
import { Variant } from "@mui/material/styles/createTypography"
import { fonts } from "../../theme/theme"

export const KeyboardKey = ({ label, variant = "subtitle2" }: { label: string; variant?: Variant }) => {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ p: ".3rem .3rem", pt: ".4rem", border: `#FFFFFF 1px solid`, borderRadius: ".4rem", minWidth: "20px" }}
        >
            <Typography variant={variant} sx={{ lineHeight: 1, fontFamily: fonts.nostromoBold }}>
                {label}
            </Typography>
        </Stack>
    )
}
