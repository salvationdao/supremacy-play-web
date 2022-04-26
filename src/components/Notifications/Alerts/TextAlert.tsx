import { Box, Typography } from "@mui/material"
import { ClipThing } from "../.."
import { colors } from "../../../theme/theme"

export const TextAlert = ({ data }: { data: string }) => {
    return (
        <ClipThing
            clipSize="3px"
            border={{
                borderColor: colors.offWhite,
                isFancy: true,
                borderThickness: ".15rem",
            }}
            backgroundColor={colors.darkNavy}
        >
            <Box
                sx={{
                    px: "1.44rem",
                    pt: "1.2rem",
                    pb: ".8rem",
                }}
            >
                <Typography variant="body1" sx={{ display: "inline", color: colors.offWhite }}>
                    {data}
                </Typography>
            </Box>
        </ClipThing>
    )
}
