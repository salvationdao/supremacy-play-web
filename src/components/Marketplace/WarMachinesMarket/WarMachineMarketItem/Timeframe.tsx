import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { timeSince } from "../../../../helpers"
import { fonts, colors } from "../../../../theme/theme"

export const Timeframe = ({ isGridView, endAt }: { isGridView: boolean; endAt: Date; buyout: boolean; auction: boolean }) => {
    const timeLeft = useMemo(() => timeSince(new Date(), endAt), [endAt])

    return (
        <Stack spacing={isGridView ? "" : ".6rem"}>
            <Typography sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>TIME LEFT</Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {timeLeft}
            </Typography>
        </Stack>
    )
}
