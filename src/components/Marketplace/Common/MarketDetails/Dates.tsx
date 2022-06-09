import { Box, Typography } from "@mui/material"
import { useMemo } from "react"
import { timeSinceInWords } from "../../../../helpers"
import { colors, fonts } from "../../../../theme/theme"

export const Dates = ({ createdAt, endAt }: { createdAt: Date; endAt: Date }) => {
    const timeLeft = useMemo(() => timeSinceInWords(new Date(), endAt), [endAt])

    return (
        <>
            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    DATE LISTED:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                    {createdAt.toUTCString()}
                </Typography>
            </Box>

            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    END DATE:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold" }}>
                    {endAt.toUTCString()} ({timeLeft} left)
                </Typography>
            </Box>
        </>
    )
}
