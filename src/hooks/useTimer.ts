import moment from "moment"
import { useEffect, useState } from "react"
import { useInterval } from "."

export const useTimer = (endTime: Date | undefined, speed: number = 1000, stopCountingOnEnd: boolean = true) => {
    const [endTimeState, setEndTimeState] = useState<Date | undefined>(endTime)
    const [totalSecRemain, setTotalSecRemain] = useState<number>(9999999)
    const [delay, setDelay] = useState<number | null>(null)
    const [days, setDays] = useState<number>()
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        if (endTimeState) {
            setDelay(speed)
            const d = moment.duration(moment(endTimeState).diff(moment()))
            setTotalSecRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [endTimeState, speed])

    useInterval(() => {
        setTotalSecRemain((t) => Math.max(t - 1, 0))
        const d = moment.duration(moment(endTimeState).diff(moment()))
        if (stopCountingOnEnd && d.milliseconds() < 0) {
            return
        }
        const days = Math.floor(d.asDays())
        const hours = Math.floor(d.asHours()) - days * 24
        const minutes = Math.floor(d.asMinutes()) - days * 24 * 60 - hours * 60
        const seconds = Math.floor(d.asSeconds()) - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60
        setDays(Math.max(days, 0))
        setHours(Math.max(hours, 0))
        setMinutes(Math.max(minutes, 0))
        setSeconds(Math.max(seconds, 0))
    }, delay)

    const pause = () => setDelay(null)

    const resume = () => setDelay(speed)

    return {
        setEndTimeState,
        totalSecRemain,
        days,
        hours,
        minutes,
        seconds,
        pause,
        resume,
    }
}
