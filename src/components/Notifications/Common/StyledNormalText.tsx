import { Typography } from "@mui/material"
import { colors } from "../../../theme/theme"

export const StyledNormalText = ({ text }: { text: string }) => {
    return (
        <Typography
            component="span"
            variant="body1"
            sx={{ display: "inline", wordBreak: "break-word", color: colors.offWhite }}
        >
            {text}
        </Typography>
    )
}
