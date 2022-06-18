import { useEffect, useMemo, useState } from "react"

interface Props {
    pageSize: number
    page: number
}

export const usePagination = ({ pageSize: _pageSize = 10, page: _page = 1 }: Props) => {
    const [pageSize, setPageSize] = useState<number>(_pageSize)
    const [page, setPage] = useState<number>(_page)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(0)

    useEffect(() => {
        setTotalPages(Math.ceil(totalItems / pageSize))
    }, [pageSize, totalItems])

    const hasNext = useMemo(() => page + 1 <= totalPages, [page, totalPages])

    const hasPrev = useMemo(() => page - 1 > 0, [page])

    const nextPage = () => {
        if (hasNext) setPage(page + 1)
    }

    const prevPage = () => {
        if (hasPrev) setPage(page - 1)
    }

    const changePageSize = (newPageSize: number) => {
        setPageSize((curPageSize) => (newPageSize !== curPageSize ? newPageSize : curPageSize))
    }

    const changePage = (newPage: number) => {
        setPage((curPage) => (newPage !== curPage ? newPage : curPage))
    }

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
