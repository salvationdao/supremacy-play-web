import { useState, useCallback, useEffect } from "react"
import { useSnackbar } from "../../../containers"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { StorefrontPackage } from "../../../types"

export const PackagesStore = () => {
    const { newSnackbarMessage } = useSnackbar()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    const [packages, setPackages] = useState<StorefrontPackage[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, changePageSize, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Get packages
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<StorefrontPackage[]>(GameServerKeys.GetPackages, {
                page,
                page_size: pageSize,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setPackages(resp)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get packages."
            setLoadError(message)
            newSnackbarMessage(message, "error")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [updateQuery, page, pageSize, send, newSnackbarMessage])

    useEffect(() => {
        getItems()
    }, [getItems])

    return <div>Test cakes</div>
}
