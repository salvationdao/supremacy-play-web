import { useEffect, useRef } from "react"

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useInterval = (callback: any, delay: number | null) => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const savedCallback = useRef<any>()

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval.
    useEffect(() => {
        const tick = () => {
            savedCallback.current && savedCallback.current()
        }

        if (delay !== null) {
            const id = setInterval(tick, delay)
            return () => {
                savedCallback.current = undefined
                clearInterval(id)
            }
        }
    }, [delay])
}
