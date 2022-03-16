import { Box, Typography } from "@mui/material"
import { StyledNormalText } from "../.."
import { SvgInfoCircularIcon } from "../../../assets"
import { colors } from "../../../theme/theme"

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <Box>
            <SvgInfoCircularIcon size="1.1rem" sx={{ display: "inline", mr: ".48rem" }} />
            <StyledNormalText text="|" sx={{ opacity: 0.2, ml: ".24rem", mr: ".8rem" }} />
            <Typography variant="body1" sx={{ display: "inline", color: colors.offWhite }}>
                {data}
            </Typography>
        </Box>
    )
}
