import moment from "moment"
import { useEffect, useState } from "react"

export const TimeElapsed = ({ startTime }: { startTime: Date }) => {
    const [elapsedTime, setElapsedTime] = useState(Math.round((new Date().getTime() - startTime.getTime()) / 1000))
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((s) => s + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const d = moment.duration(elapsedTime, "s")
        const hours = Math.floor(d.asHours())
        const minutes = Math.floor(d.asMinutes()) - hours * 60
        const seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - minutes * 60
        setHours(Math.max(hours, 0))
        setMinutes(Math.max(minutes, 0))
        setSeconds(Math.max(seconds, 0))
    }, [elapsedTime])

    return (
        <>
            {hours ? `${hours}h` : ""} {minutes ? `${minutes}m` : ""} {`${seconds}s`}
        </>
    )
}
