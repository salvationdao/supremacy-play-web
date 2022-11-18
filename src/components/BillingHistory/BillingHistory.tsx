import { Box, Pagination, Stack, Typography } from "@mui/material"
import BigNumber from "bignumber.js"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ClipThing } from ".."
import { HangarBg, SafePNG } from "../../assets"
import { useTheme } from "../../containers/theme"
import { generatePriceText, getOrderStatusDeets, parseString } from "../../helpers"
import { usePagination, useUrlQuery } from "../../hooks"
import { useGameServerCommandsUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { FiatOrder } from "../../types/fiat"
import { MysteryCrateBanner } from "../BannersPromotions/MysteryCrateBanner"
import { CoolTable } from "../Common/CoolTable"
import { PageHeader } from "../Common/Deprecated/PageHeader"
import { NiceBoxThing } from "../Common/Nice/NiceBoxThing"

export const BillingHistory = () => {
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
    const [billingHistoryItems, setBillingHistoryItems] = useState<FiatOrder[]>()

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<{ total: number; records: FiatOrder[] }>(GameServerKeys.FiatBillingHistoryList, {
                page: page - 1,
                page_size: pageSize,
            })

            updateQuery.current({
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
            <Stack sx={{ mt: "1.5rem", mb: "2rem", height: "100%", width: "calc(100% - 3rem)", maxWidth: "190rem" }}>
                t{" "}
                <Stack direction="row" alignItems="center" sx={{ mb: "1.1rem", gap: "1.2rem" }}>
                    <MysteryCrateBanner />
                </Stack>
                <NiceBoxThing
                    border={{
                        color: theme.factionTheme.primary,
                        thickness: "thicc",
                    }}
                    background={{
                        colors: [theme.factionTheme.background],
                        opacity: 0.7,
                    }}
                    sx={{ flex: 1, height: "100%" }}
                >
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <Stack sx={{ flex: 1 }}>
                            <PageHeader title="BILLING HISTORY" description="View your past transactions." imageUrl={SafePNG} />

                            <Box sx={{ flex: 1 }}>
                                <CoolTable
                                    tableHeadings={["RECEIPT NUMBER", "DATE", "STATUS", "TOTAL"]}
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
                                    renderItem={(order) => {
                                        let total = new BigNumber(0)
                                        order.items.forEach((oi) => {
                                            total = total.plus(new BigNumber(oi.amount).multipliedBy(oi.quantity))
                                        })
                                        const statusDeets = getOrderStatusDeets(order.order_status)
                                        return {
                                            cells: [
                                                <Typography key={1}>
                                                    <Link to={`/billing-history/${order.id}`}>
                                                        <Typography sx={{ textDecoration: "underline" }}>{order.order_number}</Typography>
                                                    </Link>
                                                </Typography>,
                                                <Typography key={2}>{moment(order.created_at).format("DD/MM/YYYY")}</Typography>,
                                                <ClipThing
                                                    key={3}
                                                    clipSize="6px"
                                                    corners={{
                                                        bottomLeft: true,
                                                        topRight: true,
                                                    }}
                                                    border={{
                                                        borderColor: colors.offWhite,
                                                        borderThickness: "1px",
                                                    }}
                                                    backgroundColor={statusDeets.color}
                                                    sx={{ position: "relative", px: "2rem", py: 0 }}
                                                >
                                                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBold, color: statusDeets.textColor }}>
                                                        {statusDeets.label.toUpperCase()}
                                                    </Typography>
                                                </ClipThing>,
                                                <Typography key={4}>{generatePriceText("$USD", total)}</Typography>,
                                            ],
                                        }
                                    }}
                                />
                            </Box>
                        </Stack>

                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    px: "1rem",
                                    py: ".7rem",
                                    borderTop: (theme) => `${theme.factionTheme.s600} 1.5px solid`,
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
                                            color: (theme) => theme.factionTheme.text,
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
                </NiceBoxThing>
            </Stack>
        </Stack>
    )
}
