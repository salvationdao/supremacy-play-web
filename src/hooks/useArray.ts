import { useCallback, useState } from "react"

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const useArray = (initial: any, notiID = "id") => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const [value, setValue] = useState<any[]>(initial)

    return {
        value,
        setValue,
        add: useCallback((a) => setValue((v) => [...v, a]), []),
        clear: useCallback(() => setValue(() => []), []),
        removeByID: useCallback((id) => setValue((arr) => arr.filter((v) => v && v[notiID] !== id)), []),
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
