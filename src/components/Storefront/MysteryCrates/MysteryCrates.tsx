import { Box, Divider, Stack, Typography } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { ClipThing } from "../.."
import { SafePNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { Filters } from "../Filters"

const placeholderCrates: MysteryCrate[] = [
    {
        id: "1",
        mystery_crate_type: "MECH",
        price: 3200,
        amount: 10000,
        sold: 6080,
    },
    {
        id: "2",
        mystery_crate_type: "WEAPON",
        price: 2200,
        amount: 10000,
        sold: 3610,
    },
]

export const MysteryCrates = () => {
    const { newSnackbarMessage } = useSnackbar()
    const { send } = useGameServerCommandsFaction("xxxxxxxxx")
    const theme = useTheme()
    const [crates, setCrates] = useState<MysteryCrate[]>(placeholderCrates)
    const [isLoading, setIsLoading] = useState(true)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })

    // Get mystery crates
    useEffect(() => {
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
        // if (!crates || isLoading) {
        //     return (
        //         <Stack spacing="1.6rem" sx={{ width: "80rem", px: "1rem", py: ".8rem", height: 0 }}>
        //             {new Array(5).fill(0).map((_, index) => (
        //                 <MysteryCrateItemLoadingSkeleton key={index} />
        //             ))}
        //         </Stack>
        //     )
        // }

        // if (crates && crates.length > 0) {
        //     return (
        //         <Stack spacing="2.4rem" sx={{ px: ".5rem", py: "1.5rem", height: 0 }}>
        //             {crates.map((mech, i) => (
        //                 <MysteryCrateItem key={`hangar-mech-${mech.id}`} index={i} mech={mech} />
        //             ))}
        //         </Stack>
        //     )
        // }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "40rem" }}>
                    <Box
                        sx={{
                            width: "9rem",
                            height: "9rem",
                            filter: "grayscale(100%)",
                            background: `url(${SafePNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
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
    }, [crates, isLoading])

    return (
        <Stack direction="row" spacing="1rem" sx={{ height: "100%" }}>
            <Filters />

            <ClipThing
                clipSize="10px"
                border={{
                    isFancy: true,
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                opacity={0.7}
                backgroundColor={theme.factionTheme.background}
                sx={{ flex: 1, height: "100%", width: "45rem" }}
            >
                <Stack spacing="2rem" sx={{ position: "relative", height: "100%", px: "2.68em", py: "2.2rem" }}>
                    <Stack direction="row" spacing="1.2rem">
                        <Box
                            sx={{
                                width: "6rem",
                                height: "100%",
                                background: `url(${SafePNG})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontFamily: fonts.nostromoBlack }}>
                                MYSTERY CRATES
                            </Typography>
                            <Typography sx={{ fontSize: "1.6rem" }}>Gear up for the battle areana with a variety of War Machines and Weapons.</Typography>
                        </Box>
                    </Stack>

                    <Divider />

                    <Box
                        sx={{
                            my: ".8rem",
                            ml: ".8rem",
                            mr: ".4rem",
                            pr: ".4rem",
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
            </ClipThing>
        </Stack>
    )
}
