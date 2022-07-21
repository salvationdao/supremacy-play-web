import { Box, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { ClipThing, FancyButton } from "../.."
import { SafePNG } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate, MysteryCrateType, OpenCrateResponse, StorefrontMysteryCrate } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { MysteryCrateStoreItemLoadingSkeleton } from "../../Storefront/MysteryCratesStore/MysteryCrateStoreItem/MysteryCrateStoreItem"
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
    const location = useLocation()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsUser("/user_commander")
    const theme = useTheme()
    const [crates, setCrates] = useState<MysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [openingCrate, setOpeningCrate] = useState<OpeningCrate>()
    const [openedRewards, setOpenedRewards] = useState<OpenCrateResponse>()
    const [futureCratesToOpen, setFutureCratesToOpen] = useState<(StorefrontMysteryCrate | MysteryCrate)[]>([])

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

            updateQuery({
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
                        to={`/storefront/mystery-crates${location.hash}`}
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
    }, [crates, isLoading, loadError, location.hash, theme.factionTheme.primary, theme.factionTheme.secondary, getItems])

    return (
        <>
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
                            {/* <Box sx={{ ml: "auto !important", pr: "2rem" }}>
                                <FancyButton
                                    clipThingsProps={{
                                        clipSize: "9px",
                                        backgroundColor: colors.gold,
                                        opacity: 1,
                                        border: { isFancy: true, borderColor: colors.gold, borderThickness: "2px" },
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
                            </Box> */}
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

            {openingCrate && (
                <CrateRewardVideo factionID={openingCrate.factionID} crateType={openingCrate.crateType} onClose={() => setOpeningCrate(undefined)} />
            )}

            {openedRewards && (
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
                        if (futureCratesToOpen.length <= 0 && page > 1) {
                            prevPage()
                        } else {
                            getItems()
                        }
                    }}
                />
            )}
        </>
    )
}
