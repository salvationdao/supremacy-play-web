import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { useDebounce, useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { Keycard } from "../../types"
import { SortTypeLabel } from "../../types/marketplace"
import { KeycardCard } from "../Common/Keycard/KeycardCard"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { usePageTabs } from "../Common/NavTabs/usePageTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { NiceTextField } from "../Common/Nice/NiceTextField"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
}

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
]

export const FleetKeycards = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.Alphabetical)

    // Items
    const [displayKeycards, setDisplayKeycards] = useState<Keycard[]>([])
    const [keycards, setKeycards] = useState<Keycard[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useGameServerSubscriptionSecuredUser<Keycard[]>(
        {
            URI: "/owned_keycards",
            key: GameServerKeys.GetPlayerOwnedKeycards,
        },
        (payload) => {
            if (!payload) return

            setKeycards((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((keycard) => payload.find((p) => p.id === keycard.id) || keycard)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((keycard) => keycard.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list
            })

            setIsLoading(false)
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        if (isLoading) return

        let result = [...keycards]

        // Apply search
        if (search) {
            result = result.filter((keycard) =>
                `${keycard.blueprints.label.toLowerCase()} ${keycard.blueprints.description.toLowerCase()}`.includes(search.toLowerCase()),
            )
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.blueprints.label}`.localeCompare(`${b.blueprints.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.blueprints.label}`.localeCompare(`${a.blueprints.label}`))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
        })

        setDisplayKeycards(result)
    }, [isLoading, keycards, search, sort, updateQuery])

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displayKeycards && displayKeycards.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(30rem, 1fr))",
                        gap: "1.5rem",
                        alignItems: "stretch",
                        justifyContent: "center",
                    }}
                >
                    {displayKeycards.map((keycard) => {
                        return <KeycardCard key={`keycard-${keycard.id}`} keycard={keycard} />
                    })}
                </Box>
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <Box
                    sx={{
                        width: "20rem",
                        height: "20rem",
                        opacity: 0.7,
                        filter: "grayscale(100%)",
                        background: `url(${EmptyWarMachinesPNG})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "bottom center",
                        backgroundSize: "contain",
                    }}
                />
                <Typography
                    sx={{
                        px: "1.28rem",
                        pt: "1.28rem",
                        mb: "1.5rem",
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    No results...
                </Typography>

                <NiceButton route={{ to: `/marketplace/keycards` }} buttonColor={theme.factionTheme.primary}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [displayKeycards, isLoading, theme.factionTheme.primary])

    return (
        <Stack
            alignItems="center"
            spacing="3rem"
            sx={{
                p: "4rem 5rem",
                mx: "auto",
                position: "relative",
                height: "100%",
                backgroundColor: theme.factionTheme.background,
                background: `url()`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
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
                                {displayKeycards?.length || 0} ITEMS
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

                    <Box sx={{ flex: 1, height: "100%", overflowY: "auto", pr: ".8rem" }}>{content}</Box>
                </Stack>
            </Stack>
        </Stack>
    )
}
