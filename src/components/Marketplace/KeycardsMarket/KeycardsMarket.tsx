import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { KeycardPNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useToggle, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem, SortTypeLabel } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { RangeFilter } from "../../Common/SortAndFilters/RangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { KeycardMarketItem } from "./KeycardMarketItem"

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

export const KeycardsMarket = () => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [keycardItems, setKeycardItems] = useState<MarketplaceBuyAuctionItem[]>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })
    const [isGridView, toggleIsGridView] = useToggle(localStorage.getItem("marketKeycardGrid") === "true")

    useEffect(() => {
        localStorage.setItem("marketKeycardGrid", isGridView.toString())
    }, [isGridView])

    // Filters and sorts
    const [isFiltersExpanded, toggleIsFiltersExpanded] = useToggle((localStorage.getItem("isKeycardsMarketFiltersExpanded") || "true") === "true")
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(query.get("sort") || SortTypeLabel.PriceLowest)
    const [status, setStatus] = useState<string[]>((query.get("statuses") || undefined)?.split("||") || [])
    const [ownedBy, setOwnedBy] = useState<string[]>((query.get("ownedBy") || undefined)?.split("||") || [])
    const [price, setPrice] = useState<(number | undefined)[]>(
        (query.get("priceRanges") || undefined)?.split("||").map((p) => (p ? parseInt(p) : undefined)) || [undefined, undefined],
    )

    useEffect(() => {
        localStorage.setItem("isKeycardsMarketFiltersExpanded", isFiltersExpanded.toString())
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

            let sortDir = "asc"
            let sortBy = "alphabetical"
            if (
                sort === SortTypeLabel.AlphabeticalReverse ||
                sort === SortTypeLabel.CreateTimeNewestFirst ||
                sort === SortTypeLabel.EndTimeEndingLast ||
                sort === SortTypeLabel.PriceHighest
            )
                sortDir = "desc"
            if (sort === SortTypeLabel.CreateTimeOldestFirst || sort === SortTypeLabel.CreateTimeNewestFirst) sortBy = "created_at"
            if (sort === SortTypeLabel.EndTimeEndingSoon || sort === SortTypeLabel.EndTimeEndingLast) sortBy = "time"
            if (sort === SortTypeLabel.PriceLowest || sort === SortTypeLabel.PriceHighest) sortBy = "price"

            const [min_price, max_price] = price

            const resp = await send<{ total: number; records: MarketplaceBuyAuctionItem[] }>(GameServerKeys.MarketplaceSalesKeycardList, {
                page: page - 1,
                page_size: pageSize,
                search,
                min_price,
                max_price,
                sort_dir: sortDir,
                sort_by: sortBy,
                owned_by: ownedBy,
                sold: status.length > 0,
            })

            updateQuery({
                sort,
                page: page.toString(),
                pageSize: pageSize.toString(),
                statuses: status.join("||"),
                ownedBy: ownedBy.join("||"),
                priceRanges: price.join("||"),
            })

            if (!resp) return
            setTotalItems(resp.total)
            setKeycardItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get key card listings."
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [sort, price, send, page, pageSize, search, ownedBy, status, updateQuery, setTotalItems])

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

        if (!keycardItems || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (keycardItems && keycardItems.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            py: "1rem",
                            display: "grid",
                            gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(30rem, 1fr))" : "100%",
                            gap: "1.3rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {keycardItems.map((item) => (
                            <KeycardMarketItem key={`marketplace-${item.id}`} item={item} isGridView={isGridView} />
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
                            background: `url(${KeycardPNG})`,
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
                        {"There are no keycards found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, keycardItems, isLoading, theme.factionTheme.primary, isGridView])

    return (
        <Stack direction="row" sx={{ height: "100%" }}>
            <SortAndFilters
                initialSearch={search}
                onSetSearch={setSearch}
                chipFilters={[statusFilterSection.current, ownedByFilterSection.current]}
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
                        <PageHeader title="KEY CARDS" description="Explore what other citizens have to offer." imageUrl={KeycardPNG}>
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
                            countItems={keycardItems?.length}
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

                                    "::-webkit-scrollbar": {
                                        width: ".4rem",
                                    },
                                    "::-webkit-scrollbar-track": {
                                        background: "#FFFFFF15",
                                        borderRadius: 3,
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: theme.factionTheme.primary,
                                        borderRadius: 3,
                                    },
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
    )
}
