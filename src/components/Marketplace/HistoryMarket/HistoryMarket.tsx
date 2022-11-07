import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, HangarBg, WarMachineIconPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MarketplaceEvent, MarketplaceEventType, SortDir, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { HistoryItem } from "./HistoryItem"

const sortOptions = [
    { label: "TIME: OLDEST FIRST", value: SortTypeLabel.CreateTimeOldestFirst },
    { label: "TIME: NEWEST FIRST", value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
]

export const HistoryMarket = () => {
    const theme = useTheme()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [eventItems, setEventItems] = useState<MarketplaceEvent[]>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle((localStorage.getItem("isHistoryMarketFiltersExpanded") || "true") === "true")
    const [isGridView, toggleIsGridView] = useToggle(localStorage.getItem("marketHistoryGrid") === "true")

    useEffect(() => {
        localStorage.setItem("marketHistoryGrid", isGridView.toString())
    }, [isGridView])

    useEffect(() => {
        localStorage.setItem("isHistoryMarketFiltersExpanded", isFiltersExpanded.toString())
    }, [isFiltersExpanded])

    // Filters and sorts
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.CreateTimeNewestFirst)
    const [eventType, setEventType] = useState<string[]>((query.get("eventType") || undefined)?.split("||") || [])

    // Filters
    const eventTypeFilterSection = useRef<ChipFilter>({
        label: "EVENT TYPE",
        options: [
            { value: MarketplaceEventType.Purchased, label: "PURCHASED", color: colors.buyout },
            { value: MarketplaceEventType.Bid, label: "BID", color: colors.auction },
            { value: MarketplaceEventType.BidReturned, label: "BID RETURNED", color: colors.marketBidReturned },
            { value: MarketplaceEventType.Created, label: "CREATED LSITING", color: colors.marketCreate },
            { value: MarketplaceEventType.Cancelled, label: "CANCELLED LISTING", color: colors.lightGrey },
            { value: MarketplaceEventType.Sold, label: "SOLD", color: colors.marketSold },
        ],
        initialSelected: eventType,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setEventType(value)
            changePage(1)
        },
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = SortDir.Asc
            let sortBy = "alphabetical"
            if (sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.CreateTimeNewestFirst) sortDir = SortDir.Desc
            if (sort === SortTypeLabel.CreateTimeOldestFirst || sort === SortTypeLabel.CreateTimeNewestFirst) sortBy = "created_at"

            const resp = await send<{ total: number; records: MarketplaceEvent[] }>(GameServerKeys.GetMarketplaceEvents, {
                page: page - 1,
                page_size: pageSize,
                search,
                event_type: eventType,
                sort_dir: sortDir,
                sort_by: sortBy,
            })

            updateQuery.current({
                sort,
                page: page.toString(),
                pageSize: pageSize.toString(),
                eventType: eventType.join("||"),
            })

            if (!resp) return
            setTotalItems(resp.total)
            setEventItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to market events."
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [sort, send, page, pageSize, search, eventType, updateQuery, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

    const primaryColor = theme.factionTheme.primary

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!eventItems || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                    </Stack>
                </Stack>
            )
        }

        if (eventItems && eventItems.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(30rem, 1fr))" : "100%",
                            gap: "1.5rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {eventItems.map((eventItem) => (
                            <HistoryItem key={`marketplace-${eventItem.id}`} eventItem={eventItem} isGridView={isGridView} />
                        ))}
                    </Box>
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "80%",
                            height: "16rem",
                            opacity: 0.7,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "bottom center",
                            backgroundSize: "contain",
                        }}
                    />
                    <Typography
                        sx={{
                            px: "1.28rem",
                            pt: "1.28rem",
                            color: colors.grey,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        {"There are no marketplace events found, please check your filters and try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, eventItems, isLoading, primaryColor, isGridView])

    return (
        <Box
            alignItems="center"
            sx={{
                height: "100%",
                p: "1rem",
                zIndex: siteZIndex.RoutePage,
                backgroundImage: `url(${HangarBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Stack direction="row" sx={{ height: "100%" }}>
                <SortAndFilters
                    initialSearch={search}
                    onSetSearch={setSearch}
                    chipFilters={[eventTypeFilterSection.current]}
                    changePage={changePage}
                    primaryColor={primaryColor}
                    isExpanded={isFiltersExpanded}
                />

                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: primaryColor,
                        borderThickness: ".3rem",
                    }}
                    opacity={0.7}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ height: "100%", flex: 1 }}
                >
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <Stack sx={{ flex: 1 }}>
                            <PageHeader
                                title="YOUR MARKETPLACE EVENTS"
                                description="See your marketplace events and logs here."
                                imageUrl={WarMachineIconPNG}
                                primaryColor={primaryColor}
                            >
                                <Box sx={{ ml: "auto !important", pr: "2rem" }}>
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: colors.red,
                                            opacity: 1,
                                            border: { borderColor: colors.red, borderThickness: "2px" },
                                            sx: { position: "relative" },
                                        }}
                                        sx={{ px: "1.6rem", py: ".6rem", color: "#FFFFFF" }}
                                        to={`/marketplace/sell`}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: fonts.nostromoBlack,
                                            }}
                                        >
                                            SELL ITEM
                                        </Typography>
                                    </FancyButton>
                                </Box>
                            </PageHeader>

                            <TotalAndPageSizeOptions
                                countItems={eventItems?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                pageSizeOptions={[10, 20, 40]}
                                changePage={changePage}
                                isGridView={isGridView}
                                toggleIsGridView={toggleIsGridView}
                                manualRefresh={getItems}
                                sortOptions={sortOptions}
                                selectedSort={sort}
                                onSetSort={setSort}
                                primaryColor={primaryColor}
                                isFiltersExpanded={isFiltersExpanded}
                                toggleIsFiltersExpanded={toggleIsFiltersExpanded}
                            />

                            <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                                <Box
                                    sx={{
                                        ml: "1.9rem",
                                        mr: ".5rem",
                                        pr: "1.4rem",
                                        my: "1rem",
                                        flex: 1,
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        direction: "ltr",
                                    }}
                                >
                                    {content}
                                </Box>
                            </Stack>
                        </Stack>

                        {totalPages > 1 && (
                            <Box
                                sx={{
                                    px: "1rem",
                                    py: ".7rem",
                                    borderTop: `${primaryColor}70 1.5px solid`,
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
                                            backgroundColor: `${primaryColor} !important`,
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
        </Box>
    )
}
