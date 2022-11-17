import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { HangarBg, SafePNG } from "../../../assets"
import { HANGAR_PAGE } from "../../../constants"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MysteryCrate, MysteryCrateType, OpenCrateResponse, StorefrontMysteryCrate } from "../../../types"
import { PageHeader } from "../../Common/Deprecated/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/Deprecated/TotalAndPageSizeOptions"
import { MysteryCrateHangarItem } from "./MysteryCrateHangarItem"
import { CrateRewardsModal } from "./OpenCrate/CrateRewardsModal"
import { CrateRewardVideo } from "./OpenCrate/CrateRewardVideo"

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

export interface OpeningCrate {
    factionID: string
    crateType: MysteryCrateType
}

export const MysteryCratesHangar = () => {
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [crates, setCrates] = useState<MysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [openingCrate, setOpeningCrate] = useState<OpeningCrate>()
    const [openedRewards, setOpenedRewards] = useState<OpenCrateResponse>()
    const [futureCratesToOpen, setFutureCratesToOpen] = useState<(StorefrontMysteryCrate | MysteryCrate)[]>([])

    const [ownedMysteryCrates, setOwnedMysteryCrates] = useState<MysteryCrate[]>([])
    useGameServerSubscriptionSecuredUser<MysteryCrate[]>(
        {
            URI: "/owned_mystery_crates",
            key: GameServerKeys.GetPlayerOwnedMysteryCrates,
        },
        (payload) => {
            if (!payload) return
            console.log(payload)
            setOwnedMysteryCrates((prev) => {
                if (!prev.length) {
                    return payload
                }

                prev = prev.map((mc) => payload.find((p) => p.id === mc.id) || mc)
                payload.forEach((p) => (prev.some((mc) => mc.id === p.id) ? undefined : prev.push(p)))
                return prev
            })
        },
    )

    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize, prevPage } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)
            const resp = await send<GetAssetsResponse, GetCratesRequest>(GameServerKeys.GetPlayerMysteryCrates, {
                page,
                page_size: pageSize,
                exclude_opened: true,
                include_market_listed: true,
            })

            updateQuery.current({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (!resp) return
            setLoadError(undefined)
            setCrates(resp.mystery_crates)
            setFutureCratesToOpen(resp.mystery_crates)
            setTotalItems(resp.total)
        } catch (e) {
            const message = typeof e === "string" ? e : "Failed to get mystery crates."
            setLoadError(message)
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, page, pageSize, updateQuery, setTotalItems])

    useEffect(() => {
        if (crates && crates.length <= 0 && page > 1) {
            prevPage()
        } else {
            getItems()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getItems, futureCratesToOpen.length])

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
                            <MysteryCrateHangarItem
                                key={`storefront-mystery-crate-${crate.id}-${index}`}
                                crate={crate}
                                setOpeningCrate={setOpeningCrate}
                                setOpenedRewards={setOpenedRewards}
                                getCrates={getItems}
                            />
                        ))}
                    </Box>
                </Box>
            )
        }

        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
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
                            textAlign: "center",
                        }}
                    >
                        {"You don't have any mystery crates."}
                    </Typography>

                    <FancyButton
                        to={`/storefront/mystery-crates`}
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
                            GO TO STOREFRONT
                        </Typography>
                    </FancyButton>
                </Stack>
            </Stack>
        )
    }, [crates, isLoading, loadError, theme.factionTheme.primary, theme.factionTheme.secondary, getItems])

    return (
        <>
            <Box
                alignItems="center"
                sx={{
                    height: "100%",
                    p: "1rem",
                    zIndex: siteZIndex.RoutePage,
                    backgroundImage: `url(${HangarBg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            >
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
                            <PageHeader title="MYSTERY CRATES" description="The mystery crates that you own are shown here." imageUrl={SafePNG}>
                                <Box sx={{ ml: "auto !important", pr: "2rem" }}>
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: colors.gold,
                                            opacity: 1,
                                            border: { borderColor: colors.gold, borderThickness: "2px" },
                                            sx: { position: "relative" },
                                        }}
                                        sx={{ px: "1.6rem", py: ".6rem", color: "#000000" }}
                                        href={HANGAR_PAGE}
                                        target="_blank"
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#000000",
                                                fontFamily: fonts.nostromoBlack,
                                            }}
                                        >
                                            WALKABLE HANGAR
                                        </Typography>
                                    </FancyButton>
                                </Box>
                            </PageHeader>

                            <TotalAndPageSizeOptions
                                countItems={crates?.length}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                changePageSize={changePageSize}
                                changePage={changePage}
                                manualRefresh={getItems}
                            />

                            <Stack sx={{ px: "2rem", py: "1rem", flex: 1 }}>
                                <Box
                                    sx={{
                                        ml: "1.9rem",
                                        pr: "1.9rem",
                                        my: "1rem",
                                        flex: 1,
                                        overflowY: "auto",
                                        overflowX: "hidden",
                                        direction: "ltr",
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
                                <Pagination count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
                            </Box>
                        )}
                    </Stack>
                </ClipThing>
            </Box>

            {openingCrate && (
                <CrateRewardVideo factionID={openingCrate.factionID} crateType={openingCrate.crateType} onClose={() => setOpeningCrate(undefined)} />
            )}

            {openedRewards && !openingCrate && (
                <CrateRewardsModal
                    key={JSON.stringify(openedRewards)}
                    openedRewards={openedRewards}
                    setOpeningCrate={setOpeningCrate}
                    setOpenedRewards={setOpenedRewards}
                    futureCratesToOpen={futureCratesToOpen}
                    setFutureCratesToOpen={setFutureCratesToOpen}
                    onClose={() => {
                        setOpenedRewards(undefined)
                        // If user opened the last one on page, then go back a page
                        // if (futureCratesToOpen.length <= 0 && page > 1) {
                        //     prevPage()
                        // } else {
                        //     getItems()
                        // }
                    }}
                />
            )}
        </>
    )
}
