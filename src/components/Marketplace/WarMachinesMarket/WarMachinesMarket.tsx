import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets } from "../../../helpers"
import { usePagination, useToggle } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MarketplaceBuyAuctionItem, SortType } from "../../../types/marketplace"
import { SellItemModal } from "../Common/SellItemModal"
import { ChipFilter, RangeFilter, SortAndFilters } from "../SortAndFilters"
import { TotalAndPageSizeOptions } from "../TotalAndPageSizeOptions"
import { WarMachineMarketItem } from "./WarMachineMarketItem/WarMachineMarketItem"

export const WarMachinesMarket = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()
    const [sellModalOpen, toggleSellModalOpen] = useToggle()

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechItems, setMechItems] = useState<MarketplaceBuyAuctionItem[]>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })
    const [isGridView, toggleIsGridView] = useToggle(false)

    // Filters and sorts
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState<SortType>(SortType.NewestFirst)
    const [listingTypes, setListingTypes] = useState<string[]>([])
    const [rarities, setRarities] = useState<string[]>([])
    const [price, setPrice] = useState<(number | undefined)[]>([undefined, undefined])

    // Filters
    const listingTypeFilterSection = useRef<ChipFilter>({
        label: "LISTING TYPE",
        options: [
            { value: "BUY_NOW", label: "BUY NOW", color: theme.factionTheme.primary },
            { value: "AUCTION", label: "AUCTION", color: colors.auction },
            { value: "DUTCH_AUCTION", label: "DUTCH AUCTION", color: colors.dutchAuction },
        ],
        initialSelected: listingTypes,
        onSetSelected: setListingTypes,
    })

    const rarityChipFilter = useRef<ChipFilter>({
        label: "RARITY",
        options: [
            { value: "MEGA", ...getRarityDeets("MEGA") },
            { value: "COLOSSAL", ...getRarityDeets("COLOSSAL") },
            { value: "RARE", ...getRarityDeets("RARE") },
            { value: "LEGENDARY", ...getRarityDeets("LEGENDARY") },
            { value: "ELITE_LEGENDARY", ...getRarityDeets("ELITE_LEGENDARY") },
            { value: "ULTRA_RARE", ...getRarityDeets("ULTRA_RARE") },
            { value: "EXOTIC", ...getRarityDeets("EXOTIC") },
            { value: "GUARDIAN", ...getRarityDeets("GUARDIAN") },
            { value: "MYTHIC", ...getRarityDeets("MYTHIC") },
            { value: "DEUS_EX", ...getRarityDeets("DEUS_EX") },
            { value: "TITAN", ...getRarityDeets("TITAN") },
        ],
        initialSelected: rarities,
        onSetSelected: setRarities,
    })

    const priceRangeFilter = useRef<RangeFilter>({
        label: "PRICE RANGE",
        initialValue: price,
        onSetValue: setPrice,
    })

    const getMechs = useCallback(async () => {
        try {
            setIsLoading(true)

            let sortDir = "asc"
            let sortBy = "alphabetical"
            if (sort === SortType.AlphabeticalReverse || sort === SortType.NewestFirst) sortDir = "desc"
            if (sort === SortType.OldestFirst || sort === SortType.NewestFirst) sortBy = "created_at"

            const [min_price, max_price] = price

            const resp = await send<{ total: number; records: MarketplaceBuyAuctionItem[] }>(GameServerKeys.MarketplaceSalesList, {
                page_number: page,
                page_size: pageSize,
                search: search,
                rarities: rarities,
                listing_types: listingTypes,
                item_type: "mech",
                min_price,
                max_price,
                sort_dir: sortDir,
                sort_by: sortBy,
            })

            if (!resp) return
            setTotalItems(resp.total)
            setMechItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to get mech listings."
            newSnackbarMessage(message, "error")
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [sort, send, page, pageSize, search, rarities, listingTypes, price, setTotalItems, newSnackbarMessage])

    // Initial load the mech listings
    useEffect(() => {
        getMechs()
    }, [getMechs])

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

        if (!mechItems || isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (mechItems && mechItems.length > 0) {
            return (
                <Box
                    sx={{
                        width: "100%",
                        py: "1rem",
                        display: "grid",
                        gridTemplateColumns: isGridView ? "repeat(auto-fill, minmax(29rem, 1fr))" : "100%",
                        gap: "1.3rem",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 0,
                        overflow: "visible",
                    }}
                >
                    {mechItems.map((item) => (
                        <WarMachineMarketItem key={`marketplace-${item.id}`} item={item} isGridView={isGridView} />
                    ))}
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
                            userSelect: "text !important",
                            opacity: 0.9,
                            textAlign: "center",
                        }}
                    >
                        {"There are no war machines found, please try again."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [loadError, mechItems, isLoading, theme.factionTheme.primary, isGridView])

    return (
        <>
            <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
                <SortAndFilters
                    initialSearch={search}
                    onSetSearch={setSearch}
                    initialSort={sort}
                    onSetSort={setSort}
                    chipFilters={[listingTypeFilterSection.current, rarityChipFilter.current]}
                    rangeFilters={[priceRangeFilter.current]}
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
                            <Stack
                                direction="row"
                                alignItems="center"
                                sx={{
                                    px: "2rem",
                                    py: "2.2rem",
                                    backgroundColor: "#00000070",
                                    borderBottom: (theme) => `${theme.factionTheme.primary}70 1.5px solid`,
                                }}
                            >
                                <Box
                                    sx={{
                                        alignSelf: "flex-start",
                                        flexShrink: 0,
                                        mr: "1.2rem",
                                        width: "7rem",
                                        height: "5.2rem",
                                        background: `url(${WarMachineIconPNG})`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                    }}
                                />
                                <Box sx={{ mr: "2rem" }}>
                                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        WAR MACHINES
                                    </Typography>
                                    <Typography sx={{ fontSize: "1.85rem" }}>Explore what other citizens have to offer.</Typography>
                                </Box>

                                <FancyButton
                                    excludeCaret
                                    clipThingsProps={{
                                        clipSize: "9px",
                                        backgroundColor: colors.red,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: colors.red, borderThickness: "2px" },
                                        sx: { position: "relative", ml: "auto" },
                                    }}
                                    sx={{ px: "1.6rem", py: ".4rem", color: theme.factionTheme.secondary }}
                                    onClick={() => toggleSellModalOpen(true)}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: theme.factionTheme.secondary,
                                            fontFamily: fonts.nostromoBlack,
                                        }}
                                    >
                                        SELL ITEM
                                    </Typography>
                                </FancyButton>
                            </Stack>

                            <TotalAndPageSizeOptions
                                countItems={mechItems?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                changePage={changePage}
                                isGridView={isGridView}
                                toggleIsGridView={toggleIsGridView}
                            />

                            <Stack sx={{ px: "1rem", py: "1rem", flex: 1 }}>
                                <Box
                                    sx={{
                                        my: ".8rem",
                                        ml: ".8rem",
                                        pl: "1rem",
                                        pr: "1.5rem",
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

            {sellModalOpen && <SellItemModal onClose={() => toggleSellModalOpen(false)} />}
        </>
    )
}
