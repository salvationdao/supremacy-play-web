import { useCallback, useEffect, useMemo, useState } from "react"

interface Props {
    pageSize: number
    page: number
}

export interface UsePaginationProps {
    page: number
    nextPage: () => void
    prevPage: () => void
    hasNext: boolean
    hasPrev: boolean
    changePage: (newPage: number) => void
    totalPages: number
    totalItems: number
    pageSize: number
    setTotalItems: React.Dispatch<React.SetStateAction<number>>
    changePageSize: (newPageSize: number) => void
}

export const usePagination = ({ pageSize: _pageSize = 10, page: _page = 1 }: Props): UsePaginationProps => {
    const [pageSize, setPageSize] = useState<number>(_pageSize)
    const [page, setPage] = useState<number>(_page)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)

    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / pageSize))
    }, [pageSize, totalItems])

    const hasNext = useMemo(() => page + 1 <= totalPages, [page, totalPages])

    const hasPrev = useMemo(() => page - 1 > 0, [page])

    const nextPage = useCallback(() => {
        if (hasNext) setPage((prev) => prev + 1)
    }, [hasNext])

    const prevPage = useCallback(() => {
        if (hasPrev) setPage((prev) => prev - 1)
    }, [hasPrev])

    const changePageSize = useCallback((newPageSize: number) => {
        setPageSize((curPageSize) => (newPageSize !== curPageSize ? newPageSize : curPageSize))
    }, [])

    const changePage = useCallback((newPage: number) => {
        setPage((curPage) => (newPage !== curPage ? newPage : curPage))
    }, [])

    return {
        page,
        nextPage,
        prevPage,
        hasNext,
        hasPrev,
        changePage,
        totalPages,
        totalItems,
        pageSize,
        setTotalItems,
        changePageSize,
    }
}
