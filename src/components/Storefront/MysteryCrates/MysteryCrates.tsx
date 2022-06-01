import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { ClipThing } from "../.."
import { SafePNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { zoomEffect } from "../../../theme/keyframes"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { MysteryCrateItem, MysteryCrateItemLoadingSkeleton } from "./MysteryCrateItem/MysteryCrateItem"

const placeholderCrates: MysteryCrate[] = [
    {
        id: "1",
        mystery_crate_type: "MECH",
        price: "3200000000000000000000",
        amount: 10000,
        sold: 6080,
    },
    {
        id: "2",
        mystery_crate_type: "WEAPON",
        price: "2200000000000000000000",
        amount: 10000,
        sold: 3610,
    },
]

export const MysteryCrates = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("xxxxxxxxx")
    const theme = useTheme()
    const [crates, setCrates] = useState<MysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({ pageSize: 10, page: 1 })

    const enlargedView = crates ? crates.length <= 2 : false

    // Get mystery crates
    useEffect(() => {
        // TODO: remove later
        setCrates([...placeholderCrates])
        setCrates([
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
            ...placeholderCrates,
        ])
        setIsLoading(false)
        return
        ;(async () => {
            try {
                setIsLoading(true)
                const resp = await send<MysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
                    page,
                    page_size: pageSize,
                })

                if (!resp) return
                setCrates(resp)
            } catch (e) {
                newSnackbarMessage(typeof e === "string" ? e : "Failed to get war machines.", "error")
                console.debug(e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [send, page, pageSize, setTotalItems, newSnackbarMessage])

    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
                    page,
                    page_size: pageSize,
                })

                if (!resp) return
                setCrates(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [page, pageSize, send])

    const content = useMemo(() => {
        if (!crates || isLoading) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(6).fill(0).map((_, index) => (
                        <MysteryCrateItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        if (crates && crates.length > 0) {
            return (
                <Box
                    sx={{
                        width: "100%",
                        pt: ".5rem",
                        display: "grid",
                        gridTemplateColumns: enlargedView ? "repeat(auto-fill, minmax(60rem, 46%))" : "repeat(auto-fill, minmax(32rem, 1fr))",
                        gap: enlargedView ? "4rem" : "2.4rem",
                        alignItems: "center",
                        justifyContent: "center",
                        height: enlargedView ? "100%" : 0,
                        overflow: "visible",
                    }}
                >
                    {crates.map((crate) => (
                        <MysteryCrateItem key={`storefront-mystery-crate-${crate.id}`} enlargedView={enlargedView} crate={crate} />
                    ))}
                </Box>
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
                            background: `url(${SafePNG})`,
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
    }, [crates, enlargedView, isLoading])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
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
                                width: "6.5rem",
                                height: "5rem",
                                background: `url(${SafePNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        />
                        <Box sx={{ mr: "2rem" }}>
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                MYSTERY CRATES
                            </Typography>
                            <Typography sx={{ fontSize: "1.85rem" }}>Gear up for the battle areana with a variety of War Machines and Weapons.</Typography>
                        </Box>

                        <Box
                            sx={{
                                ml: "auto",
                                px: "1.6rem",
                                py: ".8rem",
                                backgroundColor: `${colors.neonBlue}10`,
                                border: `${colors.neonBlue} 2px dashed`,
                                animation: `${zoomEffect(1.01)} 3s infinite`,
                            }}
                        >
                            <Typography sx={{ textAlign: "center", color: colors.neonBlue, fontFamily: fonts.nostromoBlack }}>LIMITED AMOUNTS</Typography>
                        </Box>
                    </Stack>

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
                            borderTop: (theme) => `${theme.factionTheme.primary}70 1px solid`,
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
    )
}
