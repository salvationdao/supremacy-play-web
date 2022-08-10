import { useEffect, useRef } from "react"

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useInterval = (callback: any, delay: number | null) => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const savedCallback = useRef<any>()
    const intervalRef = useRef<NodeJS.Timer>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        if (delay !== null) {
            const intervalClearer = () => {
                intervalRef.current && clearInterval(intervalRef.current)
            }

            intervalClearer()
            intervalRef.current = setInterval(savedCallback.current, delay)
            return intervalClearer
        }
    }, [delay])
}
