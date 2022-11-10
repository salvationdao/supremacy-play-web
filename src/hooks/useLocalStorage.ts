import { useEffect, useState } from "react"

export const useLocalStorage = <T>(localStorageKey: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(localStorage.getItem(localStorageKey) ? JSON.parse(localStorage.getItem(localStorageKey) || "{}") : defaultValue)

    useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(value))
    }, [localStorageKey, value])

    return [value, setValue]
}
