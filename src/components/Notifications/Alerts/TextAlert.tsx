import { Box, Typography } from "@mui/material"
import { StyledNormalText } from "../.."
import { SvgInfoCircularIcon } from "../../../assets"
import { colors } from "../../../theme/theme"

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <Box>
            <SvgInfoCircularIcon size="11px" sx={{ display: "inline", mr: 0.6 }} />
            <StyledNormalText text="|" sx={{ opacity: 0.2, ml: 0.3, mr: 1 }} />
            <Typography variant="body1" sx={{ display: "inline", color: colors.offWhite }}>
                {data}
            </Typography>
        </Box>
    )
}
