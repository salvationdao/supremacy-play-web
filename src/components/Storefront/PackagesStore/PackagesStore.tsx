import { useState, useCallback, useEffect, useMemo } from "react"
import { useSnackbar } from "../../../containers"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { useTheme } from "../../../containers/theme"
import { colors, fonts } from "../../../theme/theme"
import { StorefrontPackage } from "../../../types"
import { Box, Pagination, Stack, Typography } from "@mui/material"
import { PackageStoreItem, PackageStoreItemLoadingSkeleton } from "./PackageStoreItem/PackageStoreItem"
import { ClipThing } from "../../Common/ClipThing"
import { PageHeader } from "../../Common/PageHeader"
import { SafePNG } from "../../../assets"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"

export const PackagesStore = () => {
    const { newSnackbarMessage } = useSnackbar()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()

    const [packages, setPackages] = useState<StorefrontPackage[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, changePageSize, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const enlargedView = packages ? packages.length <= 2 : false

    // Get packages
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<StorefrontPackage[]>(GameServerKeys.GetPackages, {
                page,
                page_size: pageSize,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setPackages(resp)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get packages."
            setLoadError(message)
            newSnackbarMessage(message, "error")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [updateQuery, page, pageSize, send, newSnackbarMessage])

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

        if (!packages || isLoading) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(10).fill(0).map((_, index) => (
                        <PackageStoreItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        if (packages && packages.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            pt: enlargedView ? "1%" : "1rem",
                            display: "grid",
                            gridTemplateColumns: enlargedView ? "repeat(auto-fill, minmax(min-content, 40%))" : "repeat(auto-fill, minmax(32rem, 1fr))",
                            gap: enlargedView ? "5rem" : "2.4rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                            height: "100%",
                        }}
                    >
                        {packages.map((item, index) => (
                            <PackageStoreItem key={`storefront-package-${item.id}-${index}`} enlargedView={enlargedView} item={item} />
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
                        {"There are no packages on sale at this time, come back later."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [packages, enlargedView, isLoading, loadError])

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
                    <PageHeader
                        title={
                            <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                PACKAGES <span style={{ color: colors.lightNeonBlue, fontFamily: "inherit", fontSize: "inherit" }}>(LIMITED SUPPLY)</span>
                            </Typography>
                        }
                        description={
                            <Typography sx={{ fontSize: "1.85rem" }}>Gear up for the battle arena with a variety of War Machines and Weapons.</Typography>
                        }
                        imageUrl={SafePNG}
                    ></PageHeader>

                    <TotalAndPageSizeOptions
                        countItems={packages?.length}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                        pageSizeOptions={[10, 20, 40]}
                        changePage={changePage}
                        manualRefresh={getItems}
                    />

                    <Stack sx={{ px: "2rem", py: "1rem", flex: 1 }}>
                        <Box
                            sx={{
                                flex: 1,
                                ml: "1.9rem",
                                mr: ".5rem",
                                pr: "1.4rem",
                                my: "1rem",
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
