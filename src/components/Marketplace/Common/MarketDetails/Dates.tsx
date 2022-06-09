import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
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
                <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { color: colors.lightNeonBlue, fontFamily: "inherit" } }}>
                    {endAt.toUTCString()}{" "}
                    <span>
                        (<TimeLeft endAt={endAt} />)
                    </span>
                </Typography>
            </Box>
        </>
    )
}

const TimeLeft = ({ endAt }: { endAt: Date }) => {
    const refreshTime = useCallback(() => {
        const timeNow = new Date()
        let newText = "LISTING ENDED"
        if (timeNow < endAt) newText = timeSinceInWords(new Date(), endAt) + " left"
        return newText
    }, [endAt])

    const [timeLeft, setTimeLeft] = useState<string>(refreshTime)

    useInterval(() => {
        setTimeLeft(refreshTime())
    }, 1000)

    return <>{timeLeft}</>
}
