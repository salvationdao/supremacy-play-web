import { useCallback, useState } from "react"
import { useMounted } from "./useMounted"

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useArray = <T>(initial: T[], idKeyName = "id") => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [value, setValue] = useState<T[]>(initial)
    const isMounted = useMounted()

    const removeByID = useCallback(
        (id: string) => {
            if (!isMounted.current) return
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue((arr) => arr.filter((v) => v && (v as any)[idKeyName] !== id))
        },
        [idKeyName, isMounted],
    )

    const removeIndex = useCallback(
        (index) => {
            if (!isMounted.current) return
            setValue((v) => {
                v.splice(index, 1)
                return v
            })
        },
        [isMounted],
    )

    return {
        value,
        setValue,
        add: useCallback((a: T) => setValue((v) => [...v, a]), []),
        clear: useCallback(() => setValue(() => []), []),
        removeByID,
        removeIndex,
    }
}
