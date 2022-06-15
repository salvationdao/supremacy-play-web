import { Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { timeSinceInWords } from "../../../../helpers"
import { fonts, colors } from "../../../../theme/theme"

export const Timeframe = ({ isGridView, endAt }: { isGridView: boolean; endAt: Date }) => {
    const timeLeft = useMemo(() => timeSinceInWords(new Date(), endAt), [endAt])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack, color: colors.lightGrey }}>
                TIME LEFT
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    fontFamily: fonts.nostromoBold,
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {timeLeft}
            </Typography>
        </Stack>
    )
}
