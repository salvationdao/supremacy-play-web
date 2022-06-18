import { useCallback, useMemo } from "react"
import { useLocation, useHistory } from "react-router-dom"

export const useUrlQuery = (): [URLSearchParams, (key: string, value: string) => void] => {
    const history = useHistory()
    const { pathname, search, hash } = useLocation()

    const query = useMemo(() => new URLSearchParams(search), [search])

    const addQuery = useCallback(
        (key: string, value: string) => {
            query.set(key, value)
            history.replace(`${pathname}?${query.toString()}${hash}`)
        },
        [hash, history, pathname, query],
    )

    return [query, addQuery]
}
