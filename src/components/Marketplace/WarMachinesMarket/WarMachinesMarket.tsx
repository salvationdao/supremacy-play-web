import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { ClipThing, FancyButton } from "../.."
import { EmptyWarMachinesPNG, WarMachineIconPNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { Filters } from "../Filters"
import { TotalAndPageSizeOptions } from "../TotalAndPageSizeOptions"

export const WarMachinesMarket = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("xxxxxxxxx")
    const theme = useTheme()
    const [mechItems, setMechItems] = useState<string[]>()
    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })

    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             const resp = await send<MysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
    //                 page,
    //                 page_size: pageSize,
    //             })

    //             if (!resp) return
    //             // setMechItems(resp)
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     })()
    // }, [page, pageSize, send])

    const content = useMemo(() => {
        if (!mechItems || isLoading) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(8).fill(0).map(
                        (_, index) =>
                            // <MysteryCrateItemLoadingSkeleton key={index} />
                            null,
                    )}
                </Stack>
            )
        }

        if (mechItems && mechItems.length > 0) {
            return (
                <Stack spacing="2.4rem" sx={{ px: ".5rem", py: "1.5rem", height: 0 }}>
                    {mechItems.map(
                        (mech) => null,
                        // <MysteryCrateItem key={`storefront-mystery-crate-${mech.id}`} mech={mech} />
                    )}
                </Stack>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "9rem",
                            height: "9rem",
                            opacity: 0.6,
                            filter: "grayscale(100%)",
                            background: `url(${EmptyWarMachinesPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "top center",
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
                        {"There are no mystery crates on sale at this time, come back later."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [isLoading, mechItems])

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
                                    backgroundColor: theme.factionTheme.primary,
                                    opacity: 1,
                                    border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
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

                        <Stack sx={{ px: "2rem", py: "1rem", flex: 1 }}>
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
