import { Box, Typography } from "@mui/material"
import { SvgInfoCircularIcon } from "../../../assets"
import { colors } from "../../../theme/theme"

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <Box>
            <SvgInfoCircularIcon size="11px" sx={{ display: "inline", mr: 0.6 }} />
            <Typography variant="body1" sx={{ display: "inline", color: colors.offWhite }}>
                {data}
            </Typography>
        </Box>
    )
}
