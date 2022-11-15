import { Box, Pagination, Stack, Typography } from "@mui/material"
import { NiceButton } from "../../Common/Nice/NiceButton"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { Section } from "./RoomSettingForm"
import { NiceTextField } from "../../Common/Nice/NiceTextField"
import { EmptyWarMachinesPNG, SvgSearch } from "../../../assets"
import { useDebounce, usePagination, useUrlQuery } from "../../../hooks"
import { NiceSelect } from "../../Common/Nice/NiceSelect"
import { SortTypeLabel } from "../../../types/marketplace"
import { useGameServerSubscriptionFaction, useGameServerSubscriptionSecuredUser } from "../../../hooks/useGameServer"
import { LobbyMech } from "../../../types"
import { GameServerKeys } from "../../../keys"
import { getRarityDeets, parseString } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { QueueableMechCard } from "./QueueableMechCard"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"

enum UrlQueryParams {
    Sort = "sort",
    Search = "search",
    Statuses = "statuses",
    Rarities = "rarities",
    Kills = "kills",
    Deaths = "deaths",
    Wins = "wins",
    Losses = "losses",
    RepairBlocks = "repairBlocks",
    PageSize = "pageSize",
    Page = "page",
}

const sortOptions = [
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
]

const mechListOptions = [
    { label: "Owned Mech", value: true },
    { label: "Staked Mech", value: false },
]

interface WarMachineFormProps {
    prevPage: () => void
}

export const WarMachineForm = ({ prevPage }: WarMachineFormProps) => {
    const [query, updateQuery] = useUrlQuery()
    const { factionTheme } = useTheme()
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.RarestAsc)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get(UrlQueryParams.PageSize), 10),
        page: parseString(query.get(UrlQueryParams.Page), 1),
    })

    const [isOwnedMech, setIsOwnedMech] = useState(true)

    const [stakedMechs, setStakedMechs] = useState<LobbyMech[]>([])
    useGameServerSubscriptionFaction<LobbyMech[]>(
        {
            URI: "/staked_mechs",
            key: GameServerKeys.SubFactionStakedMechs,
        },
        (payload) => {
            if (!payload) return

            setStakedMechs((prev) => {
                if (prev.length === 0) {
                    return payload.filter((p) => p.can_deploy)
                }

                // Replace current list
                const list = prev.map((sm) => payload.find((p) => p.id === sm.id) || sm)

                // Append new list
                payload.forEach((p) => {
                    // If already exists
                    if (list.some((mech) => mech.id === p.id)) {
                        return
                    }
                    // Otherwise, push to the list
                    list.push(p)
                })

                return list.filter((p) => p.can_deploy)
            })
        },
    )

    // return true, if a mech has equipped a power core and more than one weapon
    const queueable = useCallback((lb: LobbyMech): boolean => {
        // check power core
        if (!lb.power_core) return false

        // check weapon count
        let hasWeapon = false
        lb.weapon_slots?.forEach((ws) => {
            // skip, if already has weapon
            if (hasWeapon) return

            // check whether the mech has weapon equipped
            hasWeapon = !!ws.weapon
        })

        return hasWeapon
    }, [])

    const [ownedMechs, setOwnedMechs] = useState<LobbyMech[]>([])
    useGameServerSubscriptionSecuredUser<LobbyMech[]>(
        {
            URI: "/owned_queueable_mechs",
            key: GameServerKeys.SubPlayerQueueableMechs,
        },
        (payload) => {
            if (!payload) return

            setOwnedMechs((mqs) => {
                if (mqs.length === 0) {
                    return payload.filter((p) => !p.is_staked && p.can_deploy && queueable(p))
                }

                // replace current list
                const list = mqs.map((mq) => payload.find((p) => p.id === mq.id) || mq)

                // append new list
                payload.forEach((p) => {
                    // if already exists
                    if (list.some((mq) => mq.id === p.id)) {
                        return
                    }
                    // otherwise, push to the list
                    list.push(p)
                })

                return list.filter((p) => !p.is_staked && p.can_deploy && queueable(p))
            })
        },
    )

    const [list, setList] = useState<LobbyMech[]>([])
    // Apply sort, search, and filters
    useEffect(() => {
        let result = [...ownedMechs]
        if (!isOwnedMech) result = [...stakedMechs]

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
            case SortTypeLabel.MechQueueAsc:
                result = result.sort((a, b) => (a.queue_position && b.queue_position && a.queue_position > b.queue_position ? 1 : -1))
                break
            case SortTypeLabel.MechQueueDesc:
                result = result.sort((a, b) => (a.queue_position && b.queue_position && a.queue_position < b.queue_position ? 1 : -1))
                break
        }

        // Save the configs to url query
        updateQuery.current({
            [UrlQueryParams.Sort]: sort,
            [UrlQueryParams.Search]: search,
            [UrlQueryParams.Page]: page.toString(),
            [UrlQueryParams.PageSize]: pageSize.toString(),
        })

        // Pagination
        result = result.slice((page - 1) * pageSize, page * pageSize)
        changePage(1)
        setTotalItems(result.length)

        setList(result)
    }, [changePage, page, pageSize, search, setTotalItems, sort, stakedMechs, updateQuery, isOwnedMech, ownedMechs])

    const content = useMemo(() => {
        if (list && list.length > 0) {
            return (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(30rem, 1fr))",
                        gridTemplateRows: "25rem",
                        overflowY: "auto",
                        gap: "1.5rem",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {list.map((mech) => {
                        // const isSelected = !!selectedMechs.find((m) => m.id === mech.id)
                        return <QueueableMechCard key={`mech-${mech.id}`} lobbyMech={mech} />
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
                    {"No results..."}
                </Typography>

                <NiceButton route={{ to: `/marketplace/mechs` }} buttonColor={factionTheme.primary}>
                    GO TO MARKETPLACE
                </NiceButton>
            </Stack>
        )
    }, [list, factionTheme.primary])

    return (
        <Stack direction="column" flex={1} sx={{ px: "25rem", py: "4rem" }}>
            <Stack direction="column" flex={1} sx={{ overflowY: "hidden" }}>
                <Section orderLabel="A" title="WAR MACHINES" description="Select your War machines to deploy for this lobby." />

                <Stack direction="row" spacing={1}>
                    {/* Search bar */}
                    <NiceTextField
                        primaryColor={factionTheme.primary}
                        value={searchInstant}
                        onChange={setSearch}
                        placeholder="Search..."
                        InputProps={{
                            endAdornment: <SvgSearch size="1.5rem" sx={{ opacity: 0.5 }} />,
                        }}
                    />

                    {/* Page layout options */}
                    <NiceButtonGroup
                        primaryColor={factionTheme.primary}
                        secondaryColor={factionTheme.secondary}
                        options={mechListOptions}
                        selected={isOwnedMech}
                        onSelected={(value) => setIsOwnedMech(value)}
                    />

                    {/* Sort */}
                    <NiceSelect
                        label="Sort:"
                        primaryColor={factionTheme.primary}
                        secondaryColor={factionTheme.secondary}
                        options={sortOptions}
                        selected={sort}
                        onSelected={(value) => setSort(`${value}`)}
                        sx={{ minWidth: "26rem" }}
                    />
                </Stack>

                {content}
                <Pagination sx={{ mt: "auto" }} count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <NiceButton
                    buttonColor={factionTheme.primary}
                    onClick={() => prevPage()}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    BACK
                </NiceButton>
                <NiceButton
                    buttonColor={factionTheme.primary}
                    disabled={true}
                    sx={{
                        px: "4rem",
                        py: "1.5rem",
                    }}
                >
                    Next
                </NiceButton>
            </Stack>
        </Stack>
    )
}
