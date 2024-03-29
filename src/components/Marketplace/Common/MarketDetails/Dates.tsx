import { Box, Typography } from "@mui/material"
import { useCallback, useState } from "react"
import { timeSinceInWords } from "../../../../helpers"
import { useInterval } from "../../../../hooks"
import { colors, fonts } from "../../../../theme/theme"

export const Dates = ({ createdAt, endAt, onTimeEnded, soldAt }: { createdAt: Date; endAt: Date; onTimeEnded: () => void; soldAt?: Date }) => {
    return (
        <>
            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    DATE LISTED:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {createdAt.toUTCString()}
                </Typography>
            </Box>

            <Box>
                <Typography gutterBottom sx={{ color: colors.lightGrey, fontFamily: fonts.nostromoBold }}>
                    {soldAt ? "DATE SOLD" : "END DATE:"}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", span: { color: colors.lightNeonBlue } }}>
                    {(soldAt || endAt).toUTCString()}{" "}
                    <span>
                        (<TimeLeft endAt={soldAt || endAt} onTimeEnded={onTimeEnded} />)
                    </span>
                </Typography>
            </Box>
        </>
    )
}

const TimeLeft = ({ endAt, onTimeEnded }: { endAt: Date; onTimeEnded: () => void }) => {
    const refreshTime = useCallback(() => {
        const timeNow = new Date()
        const newText = timeSinceInWords(timeNow, endAt)
        if (!newText) onTimeEnded()
        return newText ? newText + " left" : "LISTING ENDED"
    }, [endAt, onTimeEnded])

    const [timeLeft, setTimeLeft] = useState<string>(refreshTime)

    useInterval(() => {
        setTimeLeft(refreshTime())
    }, 1000)

    return <>{timeLeft}</>
}
