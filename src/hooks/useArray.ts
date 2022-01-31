import { useCallback, useState } from 'react'

export const useArray = (initial: any, notiID = 'id') => {
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
