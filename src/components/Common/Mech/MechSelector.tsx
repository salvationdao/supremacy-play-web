import { Box, CircularProgress, Stack, SxProps, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { EmptyWarMachinesPNG, SvgSearch } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { getRarityDeets, isMechDeployable } from "../../../helpers"
import { useDebounce } from "../../../hooks"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { SortTypeLabel } from "../../../types/marketplace"
import { NiceButton } from "../Nice/NiceButton"
import { NiceButtonGroup } from "../Nice/NiceButtonGroup"
import { NiceSelect } from "../Nice/NiceSelect"
import { NiceTextField } from "../Nice/NiceTextField"
import { MechCardWeaponAndStats } from "./MechCardWeaponAndStats"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

const ownedOrStakedOptions = [
    { label: "Owned Mechs", value: false },
    { label: "Faction Mech Pool", value: true },
]

// For select a mech in a list of owned or staked mechs
export const MechSelector = React.memo(function MechSelector({
    selectedMechs,
    setSelectedMechs,
    limit,
    sx,
    onlyDeployableMechs,
}: {
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
    limit?: number
    sx?: SxProps
    onlyDeployableMechs?: boolean
}) {
    const theme = useTheme()

    // Filter, search
    const [search, setSearch, searchInstant] = useDebounce("", 300)
    const [sort, setSort] = useState<string>(SortTypeLabel.Alphabetical)
    const [onlyStakedMechs, setOnlyStakedMechs] = useState<boolean>(false)

    // Items
    const [displayMechs, setDisplayMechs] = useState<NewMechStruct[]>([])
    const [ownedMechs, setOwnedMechs] = useState<NewMechStruct[]>([])
    const [stakedMechs, setStakedMechs] = useState<NewMechStruct[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // For bulk selecting mechs
    const toggleSelected = useCallback(
        (mech: NewMechStruct) => {
            setSelectedMechs((prev) => {
                const newArray = [...prev]
                const isAlreadySelected = prev.findIndex((s) => s.id === mech.id)
                if (isAlreadySelected >= 0) {
                    newArray.splice(isAlreadySelected, 1)
                } else {
                    // Check if reach limit
                    if (!!limit && prev.length >= limit) {
                        return prev
                    }

                    newArray.push(mech)
                }

                return newArray
            })
        },
        [limit, setSelectedMechs],
    )

    // Subscribe to owned mechs
    useGameServerSubscriptionSecuredUser<NewMechStruct[]>(
        {
            URI: "/owned_mechs",
            key: GameServerKeys.SubPlayerQueueableMechs,
        },
        (payload) => {
            setIsLoading(false)
            if (!payload) return

            setOwnedMechs((prev) => {
                if (prev.length === 0) {
                    return payload.filter((mech) => {
                        if (onlyDeployableMechs) {
                            return mech.is_staked && mech.can_deploy && isMechDeployable(mech)
                        }
                        return mech.is_staked
                    })
                }

                // Replace current list
                const list = prev.map((mech) => payload.find((p) => p.id === mech.id) || mech)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((mech) => mech.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((mech) => {
                    if (onlyDeployableMechs) {
                        return mech.is_staked && mech.can_deploy && isMechDeployable(mech)
                    }
                    return mech.is_staked
                })
            })
        },
    )

    // Subscribe to staked mechs
    useGameServerSubscriptionFaction<NewMechStruct[]>(
        {
            URI: "/staked_mechs",
            key: GameServerKeys.SubFactionStakedMechs,
        },
        (payload) => {
            setIsLoading(false)
            if (!payload) return

            setStakedMechs((prev) => {
                if (prev.length === 0) {
                    return payload.filter((mech) => {
                        if (onlyDeployableMechs) {
                            return mech.can_deploy && isMechDeployable(mech)
                        }
                        return true
                    })
                }

                // Replace current list
                const list = prev.map((mech) => payload.find((p) => p.id === mech.id) || mech)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((mech) => mech.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((mech) => {
                    if (onlyDeployableMechs) {
                        return mech.can_deploy && isMechDeployable(mech)
                    }
                    return true
                })
            })
        },
    )

    // Apply sort, search, and filters
    useEffect(() => {
        if (isLoading) return

        let result = [...ownedMechs]
        if (onlyStakedMechs) {
            result = [...stakedMechs]
        }

        // Apply search
        if (search) {
            result = result.filter((mech) => `${mech.label.toLowerCase()} ${mech.name.toLowerCase()}`.includes(search.toLowerCase()))
        }

        // Apply sort
        switch (sort) {
            case SortTypeLabel.Alphabetical:
                result = result.sort((a, b) => `${a.name}${a.label}`.localeCompare(`${b.name}${b.label}`))
                break
            case SortTypeLabel.AlphabeticalReverse:
                result = result.sort((a, b) => `${b.name}${b.label}`.localeCompare(`${a.name}${a.label}`))
                break
            case SortTypeLabel.RarestAsc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank > getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
            case SortTypeLabel.RarestDesc:
                result = result.sort((a, b) => (getRarityDeets(a.tier.toUpperCase()).rank < getRarityDeets(b.tier.toUpperCase()).rank ? 1 : -1))
                break
        }

        setDisplayMechs(result)
    }, [isLoading, onlyStakedMechs, ownedMechs, search, sort, stakedMechs])

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress />
                </Stack>
            )
        }

        if (displayMechs && displayMechs.length > 0) {
            return (
                <Stack spacing="1.25rem">
                    {displayMechs.map((mech) => {
                        const isSelected = !!selectedMechs.find((m) => m.id === mech.id)
                        return <MechCardWeaponAndStats key={`mech-${mech.id}`} mech={mech} isSelected={isSelected} toggleSelected={toggleSelected} />
                    })}
                </Stack>
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

                <NiceButton route={{ to: `/marketplace/mechs` }} buttonColor={theme.factionTheme.primary}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [displayMechs, isLoading, selectedMechs, theme.factionTheme.primary, toggleSelected])

    return (
        <Stack spacing="1rem" sx={{ ...sx, overflow: "hidden" }}>
            {/* Owned mechs or faction staked mechs options */}
            <NiceButtonGroup
                primaryColor={theme.factionTheme.primary}
                secondaryColor={theme.factionTheme.secondary}
                options={ownedOrStakedOptions}
                selected={onlyStakedMechs}
                onSelected={(value) => setOnlyStakedMechs(value)}
                sx={{ "&>*": { flex: "1 !important" } }}
            />

            <Stack spacing="1rem" direction="row" alignItems="center" sx={{ overflowX: "auto", overflowY: "hidden", width: "100%", pb: ".2rem" }}>
                {/* Show total */}
                {!!limit && (
                    <Box sx={{ backgroundColor: "#00000015", border: "#FFFFFF30 1px solid", p: ".2rem 1rem" }}>
                        <Typography variant="h6" sx={{ whiteSpace: "nowrap", color: selectedMechs.length >= limit ? colors.red : "#FFFFFF" }}>
                            {selectedMechs.length}/{limit}
                        </Typography>
                    </Box>
                )}

                {/* Search bar */}
                <NiceTextField
                    primaryColor={theme.factionTheme.primary}
                    value={searchInstant}
                    onChange={(value) => setSearch(value)}
                    placeholder="Search..."
                    sx={{ width: "1rem", flex: 1 }}
                    InputProps={{
                        endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                    }}
                />

                {/* Sort */}
                <NiceSelect label="Sort:" options={sortOptions} selected={sort} onSelected={(value) => setSort(`${value}`)} sx={{ minWidth: "24rem" }} />
            </Stack>

            <Box sx={{ flex: 1, height: "100%", overflowY: "auto", pr: ".8rem", minHeight: "15rem" }}>{content}</Box>
        </Stack>
    )
})
