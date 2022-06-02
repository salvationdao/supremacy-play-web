import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useState, useEffect, useMemo, useCallback } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { useDebounce, usePagination } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MarketplaceMechItem, SortType } from "../../../types/marketplace"
import { Filters } from "../Filters"
import { TotalAndPageSizeOptions } from "../TotalAndPageSizeOptions"
import { WarMachineMarketItem, WarMachineMarketItemLoadingSkeleton } from "./WarMachineMarketItem"

export const WarMachinesMarket = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    // Filters and sorts
    const [search, setSearch] = useDebounce("", 300)
    const [sort, setSort] = useState<SortType>(SortType.NewestFirst)
    const [rarities, setRarities] = useState<string[]>([])

    // Items
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [mechItems, setMechItems] = useState<MarketplaceMechItem[]>()
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })

    const getMechs = useCallback(async () => {
        try {
            setIsLoading(true)

            // TODO: Handle alpha sort type
            let sortDir = "asc"
            switch (sort) {
                case SortType.AlphabeticalReverse:
                case SortType.NewestFirst:
                    sortDir = "desc"
            }

            const resp = await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesList, {
                page_number: page,
                page_size: pageSize,
                search: search,
                rarities: rarities,
                sort_dir: sortDir,
            })

            if (!resp) return
            setTotalItems(resp.total)
            setMechItems(resp.records)
            setLoadError(undefined)
        } catch (err) {
            const message = typeof err === "string" ? err : "Failed to submit target location."
            newSnackbarMessage(message, "error")
            setLoadError(message)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [sort, send, page, pageSize, search, rarities, setTotalItems, newSnackbarMessage])

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
                <Stack sx={{ height: 0 }}>
                    {new Array(8).fill(0).map((_, index) => (
                        <WarMachineMarketItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        if (mechItems && mechItems.length > 0) {
            return (
                <Stack spacing="1.4rem" sx={{ py: "1rem", height: 0 }}>
                    {mechItems.map((item) => (
                        <WarMachineMarketItem key={`marketplace-${item.id}`} item={item} />
                    ))}
                </Stack>
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
                        {"There are no war machines on sale at this time, come back later."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [isLoading, loadError, mechItems])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <Filters />

            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ height: "100%", flex: 1, maxWidth: "136rem" }}
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
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: theme.factionTheme.secondary,
                                        fontFamily: fonts.nostromoBlack,
                                    }}
                                >
                                    SELL WAR MACHINE
                                </Typography>
                            </FancyButton>
                        </Stack>

                        <TotalAndPageSizeOptions
                            countItems={mechItems?.length}
                            totalItems={totalItems}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            changePage={changePage}
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
                                    scrollbarWidth: "none",
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
