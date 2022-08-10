import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { HangarBg, SafePNG } from "../assets"
import { ClipThing } from "../components"
import { CoolTable } from "../components/Common/CoolTable"
import { PageHeader } from "../components/Common/PageHeader"
import { useTheme } from "../containers/theme"
import { parseString } from "../helpers"
import { usePagination, useUrlQuery } from "../hooks"
import { useGameServerCommandsUser } from "../hooks/useGameServer"
import { GameServerKeys } from "../keys"
import { fonts, siteZIndex } from "../theme/theme"
import { BillingHistory } from "../types/fiat"

export const BillingHistoryPage = () => {
    const theme = useTheme()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [billingHistoryItems, setBillingHistoryItems] = useState<BillingHistory[]>()

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<{ total: number; records: BillingHistory[] }>(GameServerKeys.BillingHistoryList, {
                page: page - 1,
                page_size: pageSize,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return

            setTotalItems(resp.total)
            setBillingHistoryItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get billing history listings."
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [page, pageSize, send, updateQuery, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

    return (
        <Stack
            alignItems="center"
            sx={{
                height: "100%",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                boxShadow: `inset 0 0 50px 60px #00000090`,
            }}
        >
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "160rem" }}>
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    opacity={0.7}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <Stack sx={{ flex: 1 }}>
                            <PageHeader title="BILLING HISTORY" description="View your past transactions." imageUrl={SafePNG} />

                            <Box sx={{ flex: 1 }}>
                                <CoolTable
                                    tableHeadings={["RECEIPT NUMBER", "DATE", "PAID", "REFUNDED"]}
                                    alignments={["left", "center", "center", "center"]}
                                    widths={["25%", "25%", "25%", "25%"]}
                                    titleRowHeight="3.5rem"
                                    cellPadding=".4rem 1rem"
                                    items={billingHistoryItems}
                                    isLoading={isLoading}
                                    loadError={loadError}
                                    paginationProps={{
                                        page,
                                        pageSize,
                                        totalItems,
                                        changePage,
                                        changePageSize,
                                    }}
                                    renderItem={(item, index) => {
                                        return { cells: [<Typography key={1}>{index + 1}</Typography>] }
                                    }}
                                />
                            </Box>
                        </Stack>

                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    px: "1rem",
                                    py: ".7rem",
                                    borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                                    backgroundColor: "#00000070",
                                }}
                            >
                                <Pagination
                                    size="medium"
                                    count={totalPages}
                                    page={page}
                                    sx={{
                                        ".MuiButtonBase-root": { borderRadius: 0.8, fontFamily: fonts.nostromoBold },
                                        ".Mui-selected": {
                                            color: (theme) => theme.factionTheme.secondary,
                                            backgroundColor: `${theme.factionTheme.primary} !important`,
                                        },
                                    }}
                                    onChange={(e, p) => changePage(p)}
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Stack>
        </Stack>
    )
}
