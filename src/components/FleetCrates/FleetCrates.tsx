import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SafePNG, SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { useDebounce, useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MysteryCrate, MysteryCrateType, OpenCrateResponse, StorefrontMysteryCrate } from "../../types"
import { SortTypeLabel } from "../../types/marketplace"
import { MysteryCrateCard } from "../Common/MysteryCrate/MysteryCrateCard"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { usePageTabs } from "../Common/NavTabs/usePageTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { NiceTextField } from "../Common/Nice/NiceTextField"
import { VirtualizedGrid } from "../Common/VirtualizedGrid"
import { CrateRewardsModal } from "./OpenCrate/CrateRewardsModal"
import { CrateRewardVideo } from "./OpenCrate/CrateRewardVideo"

export interface OpeningCrate {
    factionID: string
    crateType: MysteryCrateType
}

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
}

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
]

export const FleetCrates = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.Alphabetical)

    // Items
    const [displayCrates, setDisplayCrates] = useState<MysteryCrate[]>([])
    const [crates, setCrates] = useState<MysteryCrate[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Open crate
    const [openingCrate, setOpeningCrate] = useState<OpeningCrate>()
    const [openedRewards, setOpenedRewards] = useState<OpenCrateResponse>()
    const [futureCratesToOpen, setFutureCratesToOpen] = useState<(StorefrontMysteryCrate | MysteryCrate)[]>([])

    useGameServerSubscriptionSecuredUser<MysteryCrate[]>(
        {
            URI: "/owned_mystery_crates",
            key: GameServerKeys.GetPlayerOwnedMysteryCrates,
        },
        (payload) => {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)

            if (!payload) return

            setCrates((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((crate) => payload.find((p) => p.id === crate.id) || crate)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((crate) => crate.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list
            })
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        if (isLoading) return

        let result = [...crates]

        // Apply search
        if (search) {
            result = result.filter((crate) => `${crate.label.toLowerCase()} ${crate.description.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.label}`.localeCompare(`${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.label}`.localeCompare(`${a.label}`))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
        })

        setDisplayCrates(result)
    }, [crates, isLoading, search, sort, updateQuery])

    const renderIndex = useCallback(
        (index) => {
            const crate = displayCrates[index]
            if (!crate) {
                return null
            }
            return <MysteryCrateCard key={`crate-${crate.id}`} crate={crate} setOpeningCrate={setOpeningCrate} setOpenedRewards={setOpenedRewards} />
        },
        [displayCrates],
    )

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displayCrates && displayCrates.length > 0) {
            return (
                <VirtualizedGrid
                    uniqueID="fleetCratesGrid"
                    itemWidthConfig={{ minWidth: 37.5 }}
                    itemHeight={35.4}
                    totalItems={displayCrates.length}
                    gap={1.6}
                    renderIndex={renderIndex}
                />
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" spacing="1.2rem" sx={{ height: "100%", p: "1rem" }}>
                <Box
                    sx={{
                        width: "9rem",
                        height: "9rem",
                        opacity: 0.7,
                        filter: "grayscale(100%)",
                        background: `url(${SafePNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "contain",
                    }}
                />
                <Typography
                    sx={{
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    No results...
                </Typography>

                <NiceButton route={{ to: `/storefront/mystery-crates` }} buttonColor={theme.factionTheme.primary}>
                    GO TO STOREFRONT
                </NiceButton>
            </Stack>
        )
    }, [displayCrates, isLoading, renderIndex, theme.factionTheme.primary])

    return (
        <>
            <Stack
                alignItems="center"
                spacing="3rem"
                sx={{
                    p: "4rem 5rem",
                    mx: "auto",
                    position: "relative",
                    height: "100%",
                    maxWidth: "190rem",
                }}
            >
                <NavTabs activeTabID={activeTabID} setActiveTabID={setActiveTabID} tabs={tabs} prevTab={prevTab} nextTab={nextTab} />

                <Stack direction="row" alignItems="stretch" sx={{ flex: 1, width: "100%", overflow: "hidden" }}>
                    <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                        {/* Search, sort, grid view, and other top buttons */}
                        <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                            <Box flex={1} />

                            {/* Show total */}
                            <Box sx={{ backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
                                <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                    {displayCrates?.length || 0} ITEMS
                                </Typography>
                            </Box>

                            {/* Search bar */}
                            <NiceTextField
                                primaryColor={theme.factionTheme.primary}
                                value={searchInstant}
                                onChange={(value) => setSearch(value)}
                                placeholder="Search..."
                                InputProps={{
                                    endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                                }}
                            />

                            {/* Sort */}
                            <NiceSelect
                                label="Sort:"
                                options={sortOptions}
                                selected={sort}
                                onSelected={(value) => setSort(`${value}`)}
                                sx={{ minWidth: "26rem" }}
                            />
                        </Stack>

                        <Box sx={{ flex: 1, overflowY: "auto" }}>{content}</Box>
                    </Stack>
                </Stack>
            </Stack>

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
                    }}
                />
            )}
        </>
    )
}
