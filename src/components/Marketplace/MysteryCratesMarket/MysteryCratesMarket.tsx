import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../.."
import { SafePNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination, useToggle } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem, SortType } from "../../../types/marketplace"
import { PageHeader } from "../../Common/PageHeader"
import { ChipFilter } from "../../Common/SortAndFilters/ChipFilterSection"
import { DropdownOptions } from "../../Common/SortAndFilters/DropdownOptionsSection"
import { RangeFilter } from "../../Common/SortAndFilters/RangeFilterSection"
import { SortAndFilters } from "../../Common/SortAndFilters/SortAndFilters"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { MysteryCrateMarketItem } from "./MysteryCrateMarketItem"

export const MysteryCratesMarket = () => {
    const location = useLocation()
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [crateItems, setCrateItems] = useState<MarketplaceBuyAuctionItem[]>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })
    const [isGridView, toggleIsGridView] = useToggle(false)

    // Filters and sorts
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<string>(SortType.NewestFirst)
    const [status, setStatus] = useState<string[]>([])
    const [ownedBy, setOwnedBy] = useState<string[]>([])
    const [listingTypes, setListingTypes] = useState<string[]>([])
    const [price, setPrice] = useState<(number | undefined)[]>([undefined, undefined])

    // Filters
    const dropdownOptionsSection = useRef<DropdownOptions>({
        label: "SORT BY",
        initialSelected: sort,
        options: [
            { label: SortType.OldestFirst, value: SortType.OldestFirst },
            { label: SortType.NewestFirst, value: SortType.NewestFirst },
            { label: SortType.ExpiringFirst, value: SortType.ExpiringFirst },
            { label: SortType.ExpiringReverse, value: SortType.ExpiringReverse },
            { label: SortType.PriceLowest, value: SortType.PriceLowest },
            { label: SortType.PriceHighest, value: SortType.PriceHighest },
            { label: SortType.Alphabetical, value: SortType.Alphabetical },
            { label: SortType.AlphabeticalReverse, value: SortType.AlphabeticalReverse },
        ],
        onSetSelected: setSort,
    })

    const statusFilterSection = useRef<ChipFilter>({
        label: "STATUS",
        options: [{ value: "true", label: "SOLD", color: colors.green }],
        initialSelected: status,
        onSetSelected: setStatus,
    })
    const ownedByFilterSection = useRef<ChipFilter>({
        label: "OWNED BY",
        options: [
            { value: "self", label: "YOU", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
            { value: "others", label: "OTHERS", color: theme.factionTheme.primary, textColor: theme.factionTheme.secondary },
        ],
        initialSelected: ownedBy,
        onSetSelected: setOwnedBy,
    })

    const listingTypeFilterSection = useRef<ChipFilter>({
        label: "LISTING TYPE",
        options: [
            { value: "BUY_NOW", label: "BUY NOW", color: colors.buyout },
            { value: "DUTCH_AUCTION", label: "DUTCH AUCTION", color: colors.dutchAuction },
            { value: "AUCTION", label: "AUCTION", color: colors.auction },
        ],
        initialSelected: listingTypes,
        onSetSelected: setListingTypes,
    })

    const priceRangeFilter = useRef<RangeFilter>({
        label: "PRICE RANGE",
        initialValue: price,
        onSetValue: setPrice,
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            let sortBy = "alphabetical"
            if (sort === SortType.AlphabeticalReverse || sort === SortType.NewestFirst || sort === SortType.ExpiringReverse || sort === SortType.PriceHighest)
                sortDir = "desc"
            if (sort === SortType.OldestFirst || sort === SortType.NewestFirst) sortBy = "created_at"
            if (sort === SortType.ExpiringFirst || sort === SortType.ExpiringReverse) sortBy = "time"
            if (sort === SortType.PriceLowest || sort === SortType.PriceHighest) sortBy = "price"

            const [min_price, max_price] = price

            const resp = await send<{ total: number; records: MarketplaceBuyAuctionItem[] }>(GameServerKeys.MarketplaceSalesList, {
                page: page - 1,
                page_size: pageSize,
                search: search,
                listing_types: listingTypes,
                item_type: "mystery_crate",
                min_price,
                max_price,
                sort_dir: sortDir,
                sort_by: sortBy,
                owned_by: ownedBy,
                sold: status.length > 0,
            })

            if (!resp) return
            setTotalItems(resp.total)
            setCrateItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get mech listings."
            newSnackbarMessage(message, "error")
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [sort, price, send, page, pageSize, search, listingTypes, ownedBy, status.length, setTotalItems, newSnackbarMessage])

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
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
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
                            gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(29rem, 1fr))" : "100%",
                            gap: "1.3rem",
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
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"There are no mystery crates found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, crateItems, isLoading, theme.factionTheme.primary, isGridView])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <SortAndFilters
                initialSearch={search}
                onSetSearch={setSearch}
                dropdownOptions={[dropdownOptionsSection.current]}
                chipFilters={[statusFilterSection.current, ownedByFilterSection.current, listingTypeFilterSection.current]}
                rangeFilters={[priceRangeFilter.current]}
                changePage={changePage}
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
                            <FancyButton
                                clipThingsProps={{
                                    clipSize: "9px",
                                    backgroundColor: colors.red,
                                    opacity: 1,
                                    border: { isFancy: true, borderColor: colors.red, borderThickness: "2px" },
                                    sx: { position: "relative" },
                                }}
                                sx={{ px: "1.6rem", py: ".4rem", color: "#FFFFFF" }}
                                to={`/marketplace/sell${location.hash}`}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#FFFFFF",
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    SELL ITEM
                                </Typography>
                            </FancyButton>
                        </PageHeader>

                        <TotalAndPageSizeOptions
                            countItems={crateItems?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            pageSizeOptions={[10, 20, 40]}
                            changePage={changePage}
                            isGridView={isGridView}
                            toggleIsGridView={toggleIsGridView}
                            manualRefresh={getItems}
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
