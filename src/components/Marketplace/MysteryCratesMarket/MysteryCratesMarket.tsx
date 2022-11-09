import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { HangarBg, SafePNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem, MarketSaleType, SortDir, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/Deprecated/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { RangeFilter } from "../../Common/SortAndFilters/RangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/Deprecated/TotalAndPageSizeOptions"
import { MysteryCrateMarketItem } from "./MysteryCrateMarketItem"

const sortOptions = [
    { label: SortTypeLabel.CreateTimeOldestFirst, value: SortTypeLabel.CreateTimeOldestFirst },
    { label: SortTypeLabel.CreateTimeNewestFirst, value: SortTypeLabel.CreateTimeNewestFirst },
    { label: SortTypeLabel.EndTimeEndingSoon, value: SortTypeLabel.EndTimeEndingSoon },
    { label: SortTypeLabel.EndTimeEndingLast, value: SortTypeLabel.EndTimeEndingLast },
    { label: SortTypeLabel.PriceLowest, value: SortTypeLabel.PriceLowest },
    { label: SortTypeLabel.PriceHighest, value: SortTypeLabel.PriceHighest },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
]

export const MysteryCratesMarket = () => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [crateItems, setCrateItems] = useState<MarketplaceBuyAuctionItem[]>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })
    const [isGridView, toggleIsGridView] = useToggle(localStorage.getItem("marketCrateGrid") === "true")

    useEffect(() => {
        localStorage.setItem("marketCrateGrid", isGridView.toString())
    }, [isGridView])

    // Filters and sorts
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle((localStorage.getItem("isCratesMarketFiltersExpanded") || "true") === "true")
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.PriceLowest)
    const [status, setStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [ownedBy, setOwnedBy] = useState<string[]>((query.get("ownedBy") || undefined)?.split("||") || [])
    const [listingTypes, setListingTypes] = useState<string[]>((query.get("listingTypes") || undefined)?.split("||") || [])
    const [price, setPrice] = useState<(number | undefined)[]>(
        (query.get("priceRanges") || undefined)?.split("||").map((p) => (p ? parseInt(p) : undefined)) || [undefined, undefined],
    )

    useEffect(() => {
        localStorage.setItem("isCratesMarketFiltersExpanded", isFiltersExpanded.toString())
    }, [isFiltersExpanded])

    // Filters
    const statusFilterSection = useRef<ChipFilter>({
        label: "STATUS",
        options: [{ value: "true", label: "SOLD", color: colors.marketSold }],
        initialSelected: status,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setStatus(value)
            changePage(1)
        },
    })
    const ownedByFilterSection = useRef<ChipFilter>({
        label: "OWNED BY",
        options: [
            { value: "self", label: "YOU", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
            { value: "others", label: "OTHERS", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
        ],
        initialSelected: ownedBy,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setOwnedBy(value)
            changePage(1)
        },
    })

    const listingTypeFilterSection = useRef<ChipFilter>({
        label: "LISTING TYPE",
        options: [
            { value: MarketSaleType.Buyout, label: "BUY NOW", color: colors.buyout },
            { value: MarketSaleType.DutchAuction, label: "DUTCH AUCTION", color: colors.dutchAuction },
            { value: MarketSaleType.Auction, label: "AUCTION", color: colors.auction },
        ],
        initialSelected: listingTypes,
        initialExpanded: true,
        onSetSelected: (value: string[]) => {
            setListingTypes(value)
            changePage(1)
        },
    })

    const priceRangeFilter = useRef<RangeFilter>({
        label: "PRICE RANGE",
        initialValue: price,
        initialExpanded: true,
        onSetValue: (value: (number | undefined)[]) => {
            setPrice(value)
            changePage(1)
        },
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = SortDir.Asc
            let sortBy = "alphabetical"
            if (
                sort === SortTypeLabel.AlphabeticalReverse ||
                sort === SortTypeLabel.CreateTimeNewestFirst ||
                sort === SortTypeLabel.EndTimeEndingLast ||
                sort === SortTypeLabel.PriceHighest
            )
                sortDir = SortDir.Desc
            if (sort === SortTypeLabel.CreateTimeOldestFirst || sort === SortTypeLabel.CreateTimeNewestFirst) sortBy = "created_at"
            if (sort === SortTypeLabel.EndTimeEndingSoon || sort === SortTypeLabel.EndTimeEndingLast) sortBy = "time"
            if (sort === SortTypeLabel.PriceLowest || sort === SortTypeLabel.PriceHighest) sortBy = "price"

            const [min_price, max_price] = price

            const resp = await send<{ total: number; records: MarketplaceBuyAuctionItem[] }>(GameServerKeys.MarketplaceSalesList, {
                page: page - 1,
                page_size: pageSize,
                search,
                listing_types: listingTypes,
                item_type: "mystery_crate",
                min_price,
                max_price,
                sort_dir: sortDir,
                sort_by: sortBy,
                owned_by: ownedBy,
                sold: status.length > 0,
            })

            updateQuery.current({
                sort,
                page: page.toString(),
                pageSize: pageSize.toString(),
                statuses: status.join("||"),
                ownedBy: ownedBy.join("||"),
                listingTypes: listingTypes.join("||"),
                priceRanges: price.join("||"),
            })

            if (!resp) return
            setTotalItems(resp.total)
            setCrateItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get mech listings."
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [sort, price, send, page, pageSize, search, listingTypes, ownedBy, status, updateQuery, setTotalItems])

    useEffect(() => {
        getItems()
    }, [getItems])

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

        if (!crateItems || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        if (crateItems && crateItems.length > 0) {
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
                        {crateItems.map((item) => (
                            <MysteryCrateMarketItem key={`marketplace-${item.id}`} item={item} isGridView={isGridView} />
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
                            opacity: 0.6,
                            filter: "grayscale(100%)",
                            background: `url(${SafePNG})`,
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
                        {"There are no mystery crates found, please check your filters and try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, crateItems, isLoading, isGridView])

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
                    chipFilters={[statusFilterSection.current, ownedByFilterSection.current, listingTypeFilterSection.current]}
                    rangeFilters={[priceRangeFilter.current]}
                    changePage={changePage}
                    isExpanded={isFiltersExpanded}
                />

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
                            <PageHeader title="MYSTERY CRATES" description="Explore what other citizens have to offer." imageUrl={SafePNG}>
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
                                countItems={crateItems?.length}
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
                                    borderTop: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                                    backgroundColor: "#00000070",
                                }}
                            >
                                <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Stack>
        </Box>
    )
}
