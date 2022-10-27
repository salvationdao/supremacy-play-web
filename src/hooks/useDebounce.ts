import React, { useEffect, useState } from "react"

/** useDebounce
 * @param  {T} value
 * @param  {number} delay
 * @returns a debounced stateful value, a function to update it and a function to update it without delay.
 */
export function useDebounce<T>(value: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>, T, React.Dispatch<React.SetStateAction<T>>] {
    const [raw, setRaw] = useState<T>(value)
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedValue(raw)
        }, delay)
        return () => clearTimeout(t)
    }, [delay, raw])

    return [debouncedValue, setRaw, raw, setDebouncedValue]
}
