import { Box } from "@mui/material"
import { useRef } from "react"
import { secondsToWords } from "../../helpers"
import { useInterval } from "../../hooks"

interface TimeLeftProps {
    dateTo: Date
    timeUpMessage?: string
}
// No state change at all, very efficient
export const TimeLeft = ({ dateTo, timeUpMessage }: TimeLeftProps) => {
    const secondsLeftRef = useRef(Math.round((dateTo.getTime() - new Date().getTime()) / 1000))
    const containerRef = useRef<HTMLDivElement>()

    useInterval(() => {
        if (secondsLeftRef.current < 1) return
        secondsLeftRef.current -= 1

        if (!containerRef.current) return
        containerRef.current.innerText = secondsLeftRef.current > 0 ? secondsToWords(secondsLeftRef.current) : timeUpMessage || "REFRESHING"
    }, 1000)

    return (
        <Box ref={containerRef} component="span">
            {secondsLeftRef.current > 0 ? secondsToWords(secondsLeftRef.current) : timeUpMessage || "REFRESHING"}
        </Box>
    )
}
