import { useMemo, useRef } from "react"
import { useHistory, useLocation } from "react-router-dom"

export const useUrlQuery = (): [URLSearchParams, React.MutableRefObject<(newQuery: { [key: string]: string | undefined }) => void>] => {
    const history = useHistory()
    const { search } = useLocation()

    const query = useMemo(() => new URLSearchParams(search), [search])

    const updateQuery = useRef((newQuery: { [key: string]: string | undefined }) => {
        const { hash, pathname } = location

        for (const [key, value] of Object.entries(newQuery)) {
            query.set(key, value || "")
        }
        history.replace(`${pathname}?${query.toString()}${hash}`)
    })

    return [query, updateQuery]
}
