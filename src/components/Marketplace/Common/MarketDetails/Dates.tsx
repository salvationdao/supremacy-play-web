import { Box, Typography } from "@mui/material"
import { useState } from "react"
import { timeSinceInWords } from "../../../../helpers"
import { useInterval } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"

export const Dates = ({ createdAt, endAt }: { createdAt: Date; endAt: Date }) => {
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
                    {endAt.toUTCString()} (<TimeLeft endAt={endAt} /> left)
                </Typography>
            </Box>
        </>
    )
}

const TimeLeft = ({ endAt }: { endAt: Date }) => {
    const [timeLeft, setTimeLeft] = useState<string>(timeSinceInWords(new Date(), endAt))

    useInterval(() => {
        setTimeLeft(timeSinceInWords(new Date(), endAt))
    }, 1000)

    return <>{timeLeft}</>
}
