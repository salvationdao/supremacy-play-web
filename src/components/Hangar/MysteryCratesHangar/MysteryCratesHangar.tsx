import { Box, Pagination, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../.."
import { SafePNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { usePagination } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate } from "../../../types"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { MysteryCrateStoreItemLoadingSkeleton } from "../../Storefront/MysteryCratesStore/MysteryCrateStoreItem/MysteryCrateStoreItem"
import { MysteryCrateHangarItem } from "./MysteryCrateHangarItem"

interface GetCratesRequest {
    page: number
    page_size: number
    exclude_opened: boolean
    include_market_listed: boolean
}

interface GetAssetsResponse {
    mystery_crates: MysteryCrate[]
    total: number
}

export const MysteryCratesHangar = () => {
    const history = useHistory()
    const location = useLocation()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [crates, setCrates] = useState<MysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, setPageSize } = usePagination({ pageSize: 10, page: 1 })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<GetAssetsResponse, GetCratesRequest>(GameServerKeys.GetPlayerMysteryCrates, {
                page,
                page_size: pageSize,
                exclude_opened: true,
                include_market_listed: true,
            })

            if (!resp) return
            setLoadError(undefined)
            setCrates(resp.mystery_crates)
            setTotalItems(resp.total)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get mystery crates."
            setLoadError(message)
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, setTotalItems])

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

        if (crates && crates.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            pt: ".5rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(32rem, 1fr))",
                            gap: "2.4rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {crates.map((crate, index) => (
                            <MysteryCrateHangarItem key={`storefront-mystery-crate-${crate.id}-${index}`} crate={crate} />
                        ))}
                    </Box>
                </Box>
            )
        }

        if (isLoading) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(5).fill(0).map((_, index) => (
                        <MysteryCrateStoreItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", maxWidth: "43rem" }}>
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
                        {"You don't have any mystery crates."}
                    </Typography>

                    <FancyButton
                        onClick={() => history.push(`/marketplace/mystery-crates${location.hash}`)}
                        excludeCaret
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: theme.factionTheme.primary,
                            border: { isFancy: true, borderColor: theme.factionTheme.primary },
                            sx: { position: "relative", mt: "2rem" },
                        }}
                        sx={{ px: "1.8rem", py: ".8rem", color: theme.factionTheme.secondary }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: theme.factionTheme.secondary,
                                fontFamily: fonts.nostromoBold,
                            }}
                        >
                            GO TO MARKETPLACE
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [crates, history, isLoading, loadError, location.hash, theme.factionTheme.primary, theme.factionTheme.secondary])

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
                    <TotalAndPageSizeOptions
                        countItems={crates?.length}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        changePage={changePage}
                        manualRefresh={getItems}
                    />

                    <Stack sx={{ px: "2rem", py: "1rem", flex: 1 }}>
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
