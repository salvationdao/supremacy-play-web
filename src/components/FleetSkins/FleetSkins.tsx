import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgFilter, SvgSearch } from "../../assets"
import { useTheme } from "../../containers/theme"
import { getRarityDeets } from "../../helpers"
import { useDebounce, useUrlQuery } from "../../hooks"
import { useGameServerSubscriptionSecuredUser } from "../../hooks/useGameServer"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { GameServerKeys } from "../../keys"
import { colors, fonts } from "../../theme/theme"
import { MechSkin, RarityEnum, WeaponSkin } from "../../types"
import { SortTypeLabel } from "../../types/marketplace"
import { NavTabs } from "../Common/NavTabs/NavTabs"
import { usePageTabs } from "../Common/NavTabs/usePageTabs"
import { NiceButton } from "../Common/Nice/NiceButton"
import { NiceSelect } from "../Common/Nice/NiceSelect"
import { NiceTextField } from "../Common/Nice/NiceTextField"
import { SortAndFilters } from "../Common/SortAndFilters/SortAndFilters"
import { SkinCard } from "../Common/Skin/SkinCard"
import { VirtualizedGrid } from "../Common/VirtualizedGrid"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    SkinType = "skinType",
    EquippedStatus = "equippedStatus",
    Rarities = "rarities",
}

enum SkinType {
    Mech = "MECH",
    Weapon = "WEAPON",
}

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

const skinTypeOpens = [
    { value: SkinType.Mech, render: { label: "Mech Skin", color: colors.gold } },
    { value: SkinType.Weapon, render: { label: "Weapon Skin", color: colors.blue2 } },
]

const equippedStatusOptions = [
    { value: "true", render: { label: "EQUIPPED", color: colors.green } },
    { value: "false", render: { label: "NOT EQUIPPED", color: colors.bronze } },
]

const rarityOptions = [
    { value: RarityEnum.Mega, render: { ...getRarityDeets("MEGA") } },
    { value: RarityEnum.Colossal, render: { ...getRarityDeets("COLOSSAL") } },
    { value: RarityEnum.Rare, render: { ...getRarityDeets("RARE") } },
    { value: RarityEnum.Legendary, render: { ...getRarityDeets("LEGENDARY") } },
    { value: RarityEnum.EliteLegendary, render: { ...getRarityDeets("ELITE_LEGENDARY") } },
    { value: RarityEnum.UltraRare, render: { ...getRarityDeets("ULTRA_RARE") } },
    { value: RarityEnum.Exotic, render: { ...getRarityDeets("EXOTIC") } },
    { value: RarityEnum.Guardian, render: { ...getRarityDeets("GUARDIAN") } },
    { value: RarityEnum.Mythic, render: { ...getRarityDeets("MYTHIC") } },
    { value: RarityEnum.DeusEx, render: { ...getRarityDeets("DEUS_EX") } },
    { value: RarityEnum.Titan, render: { ...getRarityDeets("TITAN") } },
]

export const FleetSkins = () => {
    const [query, updateQuery] = useUrlQuery()
    const theme = useTheme()
    const { tabs, activeTabID, setActiveTabID, prevTab, nextTab } = usePageTabs()

    // Filter, search
    const [showFilters, setShowFilters] = useLocalStorage<boolean>("fleetSkinsFilters", false)
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.RarestDesc)
    const [skinType, setSkinType] = useState<string[]>((query.get(UrlQueryParams.SkinType) || undefined)?.split("||") || [])
    const [equippedStatus, setEquippedStatus] = useState<string[]>((query.get(UrlQueryParams.EquippedStatus) || undefined)?.split("||") || [])
    const [rarities, setRarities] = useState<string[]>((query.get(UrlQueryParams.Rarities) || undefined)?.split("||") || [])

    // Items
    const [displaySkins, setDisplaySkins] = useState<(MechSkin | WeaponSkin)[]>([])
    const [mechSkins, setMechSkins] = useState<MechSkin[]>([])
    const [weaponSkins, setWeaponSkins] = useState<WeaponSkin[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useGameServerSubscriptionSecuredUser<MechSkin[]>(
        {
            URI: "/owned_mech_skins",
            key: GameServerKeys.GetPlayerOwnedMechSkins,
        },
        (payload) => {
            setTimeout(() => setIsLoading(false), 300)

            if (!payload) return

            setMechSkins((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((skin) => payload.find((p) => p.id === skin.id) || skin)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((skin) => skin.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list
            })
        },
    )

    useGameServerSubscriptionSecuredUser<WeaponSkin[]>(
        {
            URI: "/owned_weapon_skins",
            key: GameServerKeys.GetPlayerOwnedWeaponSkins,
        },
        (payload) => {
            setTimeout(() => setIsLoading(false), 300)

            if (!payload) return

            setWeaponSkins((prev) => {
                if (prev.length === 0) {
                    return payload
                }

                // Replace current list
                const list = prev.map((skin) => payload.find((p) => p.id === skin.id) || skin)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((skin) => skin.id === p.id)) {
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

        let result: (MechSkin | WeaponSkin)[] = []
        if ((skinType as unknown as SkinType[]).includes(SkinType.Mech)) {
            result = [...result, ...mechSkins]
        }

        if ((skinType as unknown as SkinType[]).includes(SkinType.Weapon)) {
            result = [...result, ...weaponSkins]
        }

        // If nothing is selected, include all skin types
        if (skinType.length <= 0) {
            result = [...mechSkins, ...weaponSkins]
        }

        // Apply search
        if (search) {
            result = result.filter((skin) => `${skin.label.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // Apply equipped status filter, if only one is selected, then filter, otherwise user has selected both options
        if (equippedStatus && equippedStatus.length === 1) {
            if (equippedStatus[0] === "true") {
                result = result.filter((skin) => !!skin.equipped_on)
            } else {
                result = result.filter((skin) => !skin.equipped_on)
            }
        }

        // Apply rarity filter
        if (rarities && rarities.length) {
            result = result.filter((skin) => rarities.includes(skin.tier))
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.label}`.localeCompare(`${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.label}`.localeCompare(`${a.label}`))
                break
            case SortTypeLabel.RarestAsc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
            [UrlQueryParams.SkinType]: skinType.join("||"),
            [UrlQueryParams.EquippedStatus]: equippedStatus.join("||"),
            [UrlQueryParams.Rarities]: rarities.join("||"),
        })

        setDisplaySkins(result)
    }, [equippedStatus, isLoading, mechSkins, rarities, search, sort, skinType, updateQuery, weaponSkins])

    const renderIndex = useCallback(
        (index) => {
            const skin = displaySkins[index]
            if (!skin) {
                return null
            }
            return <SkinCard key={`skin-${skin.id}`} skin={skin} />
        },
        [displaySkins],
    )

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displaySkins && displaySkins.length > 0) {
            return (
                <VirtualizedGrid
                    uniqueID="fleetSkinsGrid"
                    itemWidthConfig={{ minWidth: 32.5 }}
                    itemHeight={31.9}
                    totalItems={displaySkins.length}
                    gap={1.6}
                    renderIndex={renderIndex}
                />
            )
        }

        return (
            <Stack alignItems="center" justifyContent="center" spacing="1.2rem" sx={{ height: "100%", p: "1rem" }}>
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
                        color: colors.grey,
                        fontFamily: fonts.nostromoBold,
                        textAlign: "center",
                    }}
                >
                    No results...
                </Typography>

                <NiceButton route={{ to: `/marketplace/mechs` }} buttonColor={theme.factionTheme.primary}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [displaySkins, isLoading, renderIndex, theme.factionTheme.primary])

    return (
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
                <SortAndFilters
                    open={showFilters}
                    chipFilters={[
                        {
                            label: "Skin Type",
                            options: skinTypeOpens,
                            initialExpanded: true,
                            selected: skinType,
                            setSelected: setSkinType,
                        },
                        {
                            label: "Equipped Status",
                            options: equippedStatusOptions,
                            initialExpanded: true,
                            selected: equippedStatus,
                            setSelected: setEquippedStatus,
                        },
                        {
                            label: "Rarity",
                            options: rarityOptions,
                            initialExpanded: true,
                            selected: rarities,
                            setSelected: setRarities,
                        },
                    ]}
                />

                <Stack spacing="2rem" alignItems="stretch" flex={1} sx={{ overflow: "hidden" }}>
                    {/* Search, sort, grid view, and other top buttons */}
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                        {/* Filter button */}
                        <NiceButton
                            onClick={() => setShowFilters((prev) => !prev)}
                            fill={showFilters}
                            buttonColor={theme.factionTheme.primary}
                            sx={{ p: ".85rem 1rem" }}
                        >
                            <Typography variant="subtitle1" fontFamily={fonts.nostromoBold} color={showFilters ? theme.factionTheme.text : "#FFFFFF"}>
                                <SvgFilter inline size="1.5rem" /> FILTER
                            </Typography>
                        </NiceButton>

                        <Box flex={1} />

                        {/* Show total */}
                        <Stack justifyContent="center" sx={{ height: "4.3rem", backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", px: "1rem" }}>
                            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
                                {displaySkins?.length || 0} ITEMS
                            </Typography>
                        </Stack>

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
    )
}
