import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { timeSince } from "../../../../helpers"
import { fonts, colors } from "../../../../theme/theme"

export const OfferTimeframe = ({ endAt }: { endAt: Date; buyout: boolean; auction: boolean }) => {
    const timeLeft = useMemo(() => timeSince(new Date(), endAt), [endAt])

    return (
        <Stack spacing=".6rem">
            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>TIME LEFT</Typography>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBold }}>
                {timeLeft}
            </Typography>
        </Stack>
    )
}
