import { useCallback, useState } from "react"

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useArray = <T>(initial: T[], idKeyName = "id") => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [value, setValue] = useState<T[]>(initial)

    return {
        value,
        setValue,
        add: useCallback((a: T) => setValue((v) => [...v, a]), []),
        clear: useCallback(() => setValue(() => []), []),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        removeByID: useCallback((id: string) => setValue((arr) => arr.filter((v) => v && (v as any)[idKeyName] !== id)), [idKeyName]),
        removeIndex: useCallback(
            (index) =>
                setValue((v) => {
                    v.splice(index, 1)
                    return v
                }),
            [],
        ),
    }
}
