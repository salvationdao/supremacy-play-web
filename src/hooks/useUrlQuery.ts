import { useMemo, useRef } from "react"
import { useHistory, useLocation } from "react-router-dom"

export const useUrlQuery = (): [URLSearchParams, (newQuery: { [key: string]: string | undefined }) => void] => {
    const history = useHistory()
    const { pathname, search, hash } = useLocation()

    const query = useMemo(() => new URLSearchParams(search), [search])

    const updateQuery = useRef((newQuery: { [key: string]: string | undefined }) => {
        for (const [key, value] of Object.entries(newQuery)) {
            query.set(key, value || "")
        }
        history.replace(`${pathname}?${query.toString()}${hash}`)
    })

    return [query, updateQuery.current]
}
