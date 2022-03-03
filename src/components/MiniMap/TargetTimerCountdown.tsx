import { Stack, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useEffect } from "react"
import { GameAbility } from "../../types"
import { useTheme } from "@mui/styles"
import { Theme } from "@mui/material/styles"
import { useTimer } from "../../hooks"

export const TargetTimerCountdown = ({
    gameAbility,
    setTimeReachZero,
    endTime,
}: {
    gameAbility: GameAbility
    setTimeReachZero: Dispatch<SetStateAction<boolean>>
    endTime: Date
}) => {
    const theme = useTheme<Theme>()
    const { totalSecRemain } = useTimer(endTime)
    const { label, colour } = gameAbility

    useEffect(() => {
        if (totalSecRemain <= 1) setTimeReachZero(true)
    }, [totalSecRemain])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={1}
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: 1.4,
                py: 0.6,
                backgroundColor: `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 9,
            }}
        >
            <Typography variant="h6" sx={{ span: { lineHeight: 1, fontWeight: "fontWeightBold", color: colour } }}>
                {`You have ${totalSecRemain - 2}s to choose a location for `}
                <span>{`${label}`}</span>
            </Typography>
        </Stack>
    )
}
