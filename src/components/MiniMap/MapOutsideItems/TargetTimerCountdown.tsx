import { Stack, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useEffect } from "react"
import { GameAbility } from "../../../types"
import { useTimer } from "../../../hooks"

export const TargetTimerCountdown = ({
    gameAbility,
    setTimeReachZero,
    endTime,
}: {
    gameAbility: GameAbility
    setTimeReachZero: Dispatch<SetStateAction<boolean>>
    endTime: Date
}) => {
    const { label, colour } = gameAbility

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
                zIndex: 9,
            }}
        >
            <Typography variant="h6" sx={{ span: { lineHeight: 1, fontWeight: "fontWeightBold", color: colour } }}>
                You have&nbsp;
                <CountdownText endTime={endTime} setTimeReachZero={setTimeReachZero} />s to choose a location for&nbsp;
                <span>{`${label}`}</span>
            </Typography>
        </Stack>
    )
}

const CountdownText = ({ endTime, setTimeReachZero }: { endTime: Date; setTimeReachZero: Dispatch<SetStateAction<boolean>> }) => {
    const { totalSecRemain } = useTimer(endTime)

    useEffect(() => {
        if (totalSecRemain <= 1) setTimeReachZero(true)
    }, [totalSecRemain])

    return <>{Math.max(totalSecRemain - 2, 0)}</>
}
