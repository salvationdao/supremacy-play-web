import { Box, Typography } from "@mui/material"
import { SvgInfoCircularIcon } from "../../../assets"

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <Box>
            <SvgInfoCircularIcon size="11px" fill="#FFFFFF" sx={{ display: "inline", mr: 0.6 }} />
            <Typography variant="body1" sx={{ display: "inline" }}>
                {data}
            </Typography>
        </Box>
    )
}
