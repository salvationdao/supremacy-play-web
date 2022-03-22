import { useState, useCallback } from "react"

export const useToggle = (initialValue: boolean = false): [boolean, (value?: boolean) => void] => {
    const [value, setValue] = useState(initialValue)

    const toggleValue = useCallback((value?: boolean) => {
        setValue((currentValue: boolean) => (typeof value === "boolean" ? value : !currentValue))
    }, [])

    return [value, toggleValue]
}
