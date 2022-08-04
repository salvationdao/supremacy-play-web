import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipThing, FancyButton } from "../.."
import { SafePNG } from "../../../assets"
import { useSnackbar } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { usePagination, useUrlQuery } from "../../../hooks"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { MysteryCrate, OpenCrateResponse, StorefrontMysteryCrate } from "../../../types"
import { PageHeader } from "../../Common/PageHeader"
import { TotalAndPageSizeOptions } from "../../Common/TotalAndPageSizeOptions"
import { OpeningCrate } from "../../Hangar/MysteryCratesHangar/MysteryCratesHangar"
import { CrateRewardsModal } from "../../Hangar/MysteryCratesHangar/OpenCrate/CrateRewardsModal"
import { CrateRewardVideo } from "../../Hangar/MysteryCratesHangar/OpenCrate/CrateRewardVideo"
import { MysteryCrateStoreItem } from "./MysteryCrateStoreItem/MysteryCrateStoreItem"

export const MysteryCratesStore = () => {
    const { newSnackbarMessage } = useSnackbar()
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
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress size="3rem" sx={{ color: theme.factionTheme.primary }} />
                    </Stack>
                </Stack>
            )
        }

        if (crates && crates.length > 0) {
            if (enlargedView) {
                return (
                    <Box
                        sx={{
                            width: "100%",
                            pt: "1rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(min-content, 40%))",
                            gridTemplateRows: "min-content",
                            gap: "5rem",
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                            overflow: "visible",
                            height: "90%",
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
                )
            }

            return (
                <Box sx={{ direction: "ltr", height: 0 }}>
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
                            height: "100%",
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
                        {"There are no mystery crates on sale at this time, come back later."}
                    </Typography>
                </Stack>
            </Stack>
        )
    }, [crates, enlargedView, isLoading, loadError, theme.factionTheme.primary])

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
                        <PageHeader
                            title={
                                <Typography variant="h5" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    MYSTERY CRATES{" "}
                                    <span style={{ color: colors.lightNeonBlue, fontFamily: "inherit", fontSize: "inherit" }}>(LIMITED SUPPLY)</span>
                                </Typography>
                            }
                            description={
                                <Typography sx={{ fontSize: "1.85rem" }}>Gear up for the battle arena with a variety of War Machines and Weapons.</Typography>
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
                                    to={`/fleet/mystery-crates${location.hash}`}
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
                    onClose={() => setOpenedRewards(undefined)}
                />
            )}
        </>
    )
}
