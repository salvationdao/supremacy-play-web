import { useState } from "react"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { useDebounce, usePagination, useUrlQuery } from "../../../hooks"
import { BattleLobby } from "../../../types/battle_queue"
import { SortTypeLabel } from "../../../types/marketplace"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    PageSize = "pageSize",
    Page = "page",
}

const sortOptions = [
    { label: SortTypeLabel.QueuedAmountHighest, value: SortTypeLabel.QueuedAmountHighest },
    { label: SortTypeLabel.QueuedAmountLowest, value: SortTypeLabel.QueuedAmountLowest },
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
]

const pageSizeOptions = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "40", value: 40 },
]

export const SystemLobbies = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()

    // Filter, search, pagination
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.MechQueueAsc)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get(UrlQueryParams.PageSize), 10),
        page: parseString(query.get(UrlQueryParams.Page), 1),
    })

    // Items
    const [displayMechs, setDisplayMechs] = useState<BattleLobby[]>([])
    const [mechs, setMechs] = useState<BattleLobby[]>([])
    const [isLoading, setIsLoading] = useState(true)

    return null
}
