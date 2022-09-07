import React, { useEffect, useRef, useState } from "react"

/** useDebounce
 * @param  {T} value
 * @param  {number} delay
 * @returns a debounced stateful value, a function to update it and a function to update it without delay.
 */
export function useDebounce<T>(value: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>, T, React.Dispatch<React.SetStateAction<T>>] {
    const [instant, setInstant] = useState<T>(value)
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
    const latestValue = useRef<T>(value)

    useEffect(() => {
        latestValue.current = instant
        const t = setTimeout(() => {
            setDebouncedValue(latestValue.current)
        }, delay)
        return () => clearTimeout(t)
    }, [delay, instant])

    useEffect(() => {
        latestValue.current = debouncedValue
        setInstant(latestValue.current)
    }, [debouncedValue])

    return [debouncedValue, setInstant, instant, setDebouncedValue]
}
