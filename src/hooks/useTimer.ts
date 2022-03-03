import moment from "moment"
import { useState, useEffect } from "react"
import { useInterval } from "."

export const useTimer = (endTime: Date | undefined, speed: number = 1000) => {
    const [totalSecRemain, setTotalSecRemain] = useState<number>(0)
    const [delay, setDelay] = useState<number | null>(null)
    const [hours, setHours] = useState<number>()
    const [minutes, setMinutes] = useState<number>()
    const [seconds, setSeconds] = useState<number>()

    useEffect(() => {
        if (endTime) {
            setDelay(delay)
            const d = moment.duration(moment(endTime).diff(moment()))
            setTotalSecRemain(Math.max(Math.round(d.asSeconds()), 0))
            return
        }
        setDelay(null)
    }, [])

    useInterval(() => {
        setTotalSecRemain((t) => Math.max(t - 1, 0))
        const d = moment.duration(moment(endTime).diff(moment()))
        const hours = Math.floor(d.asHours())
        const minutes = Math.floor(d.asMinutes()) - hours * 60
        const seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - minutes * 60
        setHours(Math.max(hours, 0))
        setMinutes(Math.max(minutes, 0))
        setSeconds(Math.max(seconds, 0))
    }, delay)

    return {
        totalSecRemain,
        hours,
        minutes,
        seconds,
    }
}
