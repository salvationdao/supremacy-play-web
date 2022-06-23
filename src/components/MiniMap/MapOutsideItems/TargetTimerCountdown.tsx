import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { useTimer } from "../../../hooks"
import { GameAbility } from "../../../types"

export const TargetTimerCountdown = ({
    gameAbility,
    endTime,
    onCountdownExpired,
}: {
    gameAbility: GameAbility
    endTime: Date
    onCountdownExpired: () => void
}) => {
    const { label, colour } = gameAbility
    const { totalSecRemain } = useTimer(endTime)

    useEffect(() => {
        if (totalSecRemain <= 1) onCountdownExpired()
    }, [totalSecRemain, onCountdownExpired])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing=".8rem"
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                px: "1.12rem",
                py: ".48rem",
                backgroundColor: (theme) => `${theme.factionTheme.background}`,
                borderRadius: 0.5,
                zIndex: 98,
            }}
        >
            <Typography variant="h6" sx={{ span: { lineHeight: 1, fontWeight: "fontWeightBold", color: colour } }}>
                You have&nbsp;
                {Math.max(totalSecRemain - 2, 0)}s to choose a location for&nbsp;
                <span>{`${label}`}</span>
            </Typography>
        </Stack>
    )
}
