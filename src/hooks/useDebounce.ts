import React, { useCallback, useEffect, useState } from "react"

/** useDebounce
 * @param  {T} value
 * @param  {number} delay
 * @returns a debounced stateful value, a function to update it and a function to update it without delay.
 */
export function useDebounce<T>(value: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>, T, (value: T) => void] {
    const [instant, setInstant] = useState<T>(value)
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedValue(instant)
        }, delay)
        return () => clearTimeout(t)
    }, [delay, instant])

    const setDebouncedValue2 = useCallback((value: T) => {
        setInstant(value)
        setDebouncedValue(value)
    }, [])

    return [debouncedValue, setInstant, instant, setDebouncedValue2]
}
