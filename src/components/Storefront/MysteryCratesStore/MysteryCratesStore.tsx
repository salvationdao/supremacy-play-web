import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { HangarBg, SafePNG } from "../../../assets"
import { useGlobalNotifications } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { MysteryCrate, OpenCrateResponse, StorefrontMysteryCrate } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { OpeningCrate } from "../../Hangar/MysteryCratesHangar/MysteryCratesHangar"
import { CrateRewardsModal } from "../../Hangar/MysteryCratesHangar/OpenCrate/CrateRewardsModal"
import { CrateRewardVideo } from "../../Hangar/MysteryCratesHangar/OpenCrate/CrateRewardVideo"
import { MysteryCrateStoreItem } from "./MysteryCrateStoreItem/MysteryCrateStoreItem"

export const MysteryCratesStore = () => {
    const { newSnackbarMessage } = useGlobalNotifications()
    const [query, updateQuery] = useUrlQuery()
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const theme = useTheme()
    const [crates, setCrates] = useState<StorefrontMysteryCrate[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const { page, changePage, changePageSize, totalPages, pageSize } = usePagination({
        pageSize: parseString(query.get("pageSize"), 10),
        page: parseString(query.get("page"), 1),
    })

    const [openingCrate, setOpeningCrate] = useState<OpeningCrate>()
    const [openedRewards, setOpenedRewards] = useState<OpenCrateResponse>()
    const [futureCratesToOpen, setFutureCratesToOpen] = useState<(StorefrontMysteryCrate | MysteryCrate)[]>([])

    const enlargedView = crates ? crates.length <= 2 : false

    // Get mystery crates
    const getItems = useCallback(async () => {
        try {
            setIsLoading(true)

            const resp = await send<StorefrontMysteryCrate[]>(GameServerKeys.GetMysteryCrates, {
                page,
                page_size: pageSize,
            })

            updateQuery.current({
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
                <Stack alignItems="center" justifyContent="center" sx={{ height: "10rem" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (crates && crates.length > 0) {
            if (enlargedView) {
                return (
                    <>
                        <Box
                            sx={{
                                width: "100%",
                                pt: "1rem",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min-content, 45%))",
                                gridTemplateRows: "min-content",
                                gap: "5rem",
                                alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                                overflow: "visible",
                            }}
                        >
                            {crates.map((crate, index) => (
                                <MysteryCrateStoreItem
                                    key={`storefront-mystery-crate-${crate.id}-${index}`}
                                    enlargedView={enlargedView}
                                    crate={crate}
                                    setOpeningCrate={setOpeningCrate}
                                    setOpenedRewards={setOpenedRewards}
                                    setFutureCratesToOpen={setFutureCratesToOpen}
                                />
                            ))}
                        </Box>
                        <Typography
                            sx={{
                                mt: "2rem",
                                fontSize: "2.1rem",
                                textAlign: "center",
                            }}
                        >
                            Nexus War Machines can be deployed into the Battle Arena following the upcoming Nexus Update.
                        </Typography>
                    </>
                )
            }

            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Typography
                        sx={{
                            mb: "2rem",
                            fontSize: "1.6rem",
                            textAlign: "center",
                        }}
                    >
                        Nexus War Machines can be deployed into the Battle Arena following the upcoming Nexus Update.
                    </Typography>
                    <Box
                        sx={{
                            width: "100%",
                            pt: "1rem",
                            display: "grid",
                            gridTemplateColumns: enlargedView ? "repeat(auto-fill, minmax(min-content, 40%))" : "repeat(auto-fill, minmax(32rem, 1fr))",
                            gap: "2.4rem",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "visible",
                        }}
                    >
                        {crates.map((crate, index) => (
                            <MysteryCrateStoreItem
                                key={`storefront-mystery-crate-${crate.id}-${index}`}
                                crate={crate}
                                setOpeningCrate={setOpeningCrate}
                                setOpenedRewards={setOpenedRewards}
                                setFutureCratesToOpen={setFutureCratesToOpen}
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
                            textAlign: "center",
                        }}
                    >
                        There are no mystery crates on sale at this time, come back later.
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [crates, enlargedView, isLoading, loadError, theme.factionTheme.primary])

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
                            <PageHeader
                                title={
                                    <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                        MYSTERY CRATES <span style={{ color: colors.lightNeonBlue }}>(LIMITED SUPPLY)</span>
                                    </Typography>
                                }
                                description={
                                    <Typography sx={{ fontSize: "1.85rem" }}>
                                        Gear up for the battle arena with a variety of War Machines and Weapons.
                                    </Typography>
                                }
                                imageUrl={SafePNG}
                            >
                                <Box sx={{ ml: "auto !important", pr: "2rem" }}>
                                    <FancyButton
                                        clipThingsProps={{
                                            clipSize: "9px",
                                            backgroundColor: theme.factionTheme.primary,
                                            opacity: 1,
                                            border: { borderColor: theme.factionTheme.primary, borderThickness: "2px" },
                                            sx: { position: "relative" },
                                        }}
                                        sx={{ px: "1.6rem", py: ".6rem", color: theme.factionTheme.secondary }}
                                        to={`/fleet/mystery-crates`}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: theme.factionTheme.secondary,
                                                fontFamily: fonts.nostromoBlack,
                                            }}
                                        >
                                            OPEN CRATES IN FLEET
                                        </Typography>
                                    </FancyButton>
                                </Box>
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
                                    }}
                                >
                                    <Box sx={{ height: 0 }}>{content}</Box>
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
                    onClose={() => setOpenedRewards(undefined)}
                />
            )}
        </>
    )
}
