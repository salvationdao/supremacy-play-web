import { SxProps, Typography } from "@mui/material"
import { colors } from "../../../theme/theme"

export const StyledNormalText = ({ text, sx }: { text: string; sx?: SxProps }) => {
    return (
        <Typography component="span" variant="body1" sx={{ display: "inline", wordBreak: "break-word", color: colors.offWhite, ...sx }}>
            {text}
        </Typography>
    )
}
