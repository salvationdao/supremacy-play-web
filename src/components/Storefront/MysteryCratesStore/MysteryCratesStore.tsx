import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { ClipThing } from "../.."
import { SafePNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction, useGameServerSubscriptionUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { HANGAR_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { StorefrontMysteryCrate } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { TooltipHelper } from "../../Common/TooltipHelper"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { MysteryCrateStoreItem, MysteryCrateStoreItemLoadingSkeleton } from "./MysteryCrateStoreItem/MysteryCrateStoreItem"

interface MysteryCrateOwnershipResp {
    allowed: number
    owned: number
}

export const MysteryCratesStore = () => {
    const { newSnackbarMessage } = useSnackbar()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()
    const [crates, setCrates] = useState<StorefrontMysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [ownershipDetails, setOwnershipDetails] = useState<MysteryCrateOwnershipResp>({
        allowed: 0,
        owned: 0,
    })
    const { page, changePage, changePageSize, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const enlargedView = crates ? crates.length <= 2 : false

    useGameServerSubscriptionUser<MysteryCrateOwnershipResp>(
        {
            URI: "/mystery_crates",
            key: GameServerKeys.SubMysteryCrateOwnership,
        },
        (payload) => {
            if (!payload) return
            setOwnershipDetails(payload)
        },
    )

    // Get mystery crates
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<StorefrontMysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
                page,
                page_size: pageSize,
            })

            updateQuery({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setCrates(resp)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get mystery crates."
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

        if (!crates || isLoading) {
            return (
                <Stack direction="row" flexWrap="wrap" sx={{ height: 0 }}>
                    {new Array(10).fill(0).map((_, index) => (
                        <MysteryCrateStoreItemLoadingSkeleton key={index} />
                    ))}
                </Stack>
            )
        }

        if (crates && crates.length > 0) {
            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Box
                        sx={{
                            width: "100%",
                            pt: enlargedView ? "2.5%" : "1rem",
                            display: "grid",
                            gridTemplateColumns: enlargedView ? "repeat(auto-fill, minmax(min-content, 40%))" : "repeat(auto-fill, minmax(32rem, 1fr))",
                            gap: enlargedView ? "5rem" : "2.4rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                            height: "100%",
                        }}
                    >
                        {crates.map((crate, index) => (
                            <MysteryCrateStoreItem
                                key={`storefront-mystery-crate-${crate.id}-${index}`}
                                enlargedView={enlargedView}
                                crate={crate}
                                isAllowedToBuy={ownershipDetails.allowed > ownershipDetails.owned}
                            />
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
                        {"There are no mystery crates on sale at this time, come back later."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [crates, enlargedView, isLoading, loadError, ownershipDetails])

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
                                MYSTERY CRATES <span style={{ color: colors.lightNeonBlue, fontFamily: "inherit", fontSize: "inherit" }}>(LIMITED SUPPLY)</span>
                            </Typography>
                        }
                        description={
                            <Typography sx={{ fontSize: "1.85rem" }}>
                                Gear up for the battle arena with a variety of War Machines and Weapons. Each{" "}
                                <Link to={`/fleet/${HANGAR_TABS.Keycards}`}>keycard</Link> you have on Supremacy allows you to purchase 10 mystery crates.
                            </Typography>
                        }
                        imageUrl={SafePNG}
                    >
                        <Stack spacing="1rem">
                            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing=".8rem">
                                <Typography variant="body2" sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoHeavy }}>
                                    Total owned:
                                </Typography>

                                <ClipThing
                                    clipSize="8px"
                                    clipSlantSize="3px"
                                    border={{
                                        borderColor: colors.lightNeonBlue,
                                        borderThickness: ".15rem",
                                    }}
                                    corners={{
                                        topRight: true,
                                        bottomLeft: true,
                                    }}
                                    backgroundColor={colors.darkerNavy}
                                >
                                    <Stack direction="row" justifyContent="center" spacing=".2rem" sx={{ px: "2rem", pt: ".3rem", width: "8rem" }}>
                                        <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "fontWeightBold" }}>
                                            {ownershipDetails.owned}
                                        </Typography>
                                    </Stack>
                                </ClipThing>
                            </Stack>

                            <TooltipHelper placement="bottom" text="The maximum capacity is dependent on the number of keycards you hold.">
                                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing=".8rem">
                                    <Typography variant="body2" sx={{ color: colors.lightNeonBlue, fontFamily: fonts.nostromoBlack }}>
                                        Maximum capacity:
                                    </Typography>

                                    <ClipThing
                                        clipSize="8px"
                                        clipSlantSize="3px"
                                        border={{
                                            borderColor: colors.lightNeonBlue,
                                            borderThickness: ".15rem",
                                        }}
                                        corners={{
                                            topRight: true,
                                            bottomLeft: true,
                                        }}
                                        backgroundColor={colors.darkerNavy}
                                    >
                                        <Stack direction="row" justifyContent="center" spacing=".2rem" sx={{ px: "2rem", pt: ".3rem", width: "8rem" }}>
                                            <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "fontWeightBold" }}>
                                                {ownershipDetails.allowed}
                                            </Typography>
                                        </Stack>
                                    </ClipThing>
                                </Stack>
                            </TooltipHelper>
                        </Stack>
                    </PageHeader>

                    <TotalAndPageSizeOptions
                        countItems={crates?.length}
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
