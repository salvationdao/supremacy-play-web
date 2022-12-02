import { useTimer } from "use-timer"
import { msToTime } from "../../../../helpers"

export const TimeElapsed = ({ startTime }: { startTime: Date }) => {
    const { time } = useTimer({
        autostart: true,
        initialTime: (new Date().getTime() - new Date(startTime).getTime()) / 1000,
        timerType: "INCREMENTAL",
    })

    const { days, hours, minutes, seconds } = msToTime(time * 1000)

    return (
        <>
            {days || hours ? `${days * 24 + hours}h` : ""} {minutes ? `${minutes}m` : ""} {`${seconds}s`}
        </>
    )
}
