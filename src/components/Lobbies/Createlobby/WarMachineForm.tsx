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
import { LobbyMech } from "../../../types"
import { getRarityDeets, parseString } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { QueueableMechCard } from "./QueueableMechCard"
import { NiceButtonGroup } from "../../Common/Nice/NiceButtonGroup"
import { useFormContext } from "react-hook-form"

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
    ownedMechs: LobbyMech[]
    stakedMechs: LobbyMech[]
    playerQueueLimit: number
}

export const WarMachineForm = ({ prevPage, ownedMechs, stakedMechs, playerQueueLimit }: WarMachineFormProps) => {
    const { setValue, watch } = useFormContext()
    const [query, updateQuery] = useUrlQuery()
    const { factionTheme } = useTheme()
    const [search, setSearch, searchInstant] = useDebounce(query.get(UrlQueryParams.Search) || "", 300)
    const [sort, setSort] = useState<string>(query.get(UrlQueryParams.Sort) || SortTypeLabel.RarestAsc)
    const { page, changePage, totalItems, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: parseString(query.get(UrlQueryParams.PageSize), 10),
        page: parseString(query.get(UrlQueryParams.Page), 1),
    })

    const selectedMechs: LobbyMech[] = watch("selected_mechs")
    const totalLimit = useMemo(() => Math.min(3, playerQueueLimit), [playerQueueLimit])
    const queueLimit = useMemo(() => totalLimit - selectedMechs.length, [selectedMechs, totalLimit])

    const toggleSelectedMech = useCallback(
        (lobbyMech: LobbyMech) => {
            let list = [...selectedMechs]
            if (list.some((sm) => sm.id === lobbyMech.id)) {
                list = list.filter((sm) => sm.id !== lobbyMech.id)
            } else {
                // skip, if limit reached
                if (queueLimit <= 0) return

                list.push(lobbyMech)
            }

            setValue("selected_mechs", list)
        },
        [setValue, selectedMechs, queueLimit],
    )

    const [isOwnedMech, setIsOwnedMech] = useState(true)

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
                        height: "100%",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(30rem, 1fr))",
                        gridTemplateRows: "repeat(auto-fill, minmax(22rem, 1fr))",
                        overflowY: "auto",
                        gap: "4rem",
                        alignItems: "center",
                        justifyContent: "center",
                        pr: ".5rem",
                        px: "5rem",
                    }}
                >
                    {list.map((mech) => {
                        // const isSelected = !!selectedMechs.find((m) => m.id === mech.id)
                        return (
                            <QueueableMechCard
                                key={`mech-${mech.id}`}
                                lobbyMech={mech}
                                onSelect={() => toggleSelectedMech(mech)}
                                isSelected={selectedMechs.some((sm) => sm.id === mech.id)}
                            />
                        )
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

                <NiceButton route={{ to: `/fleet/mechs` }} buttonColor={factionTheme.primary}>
                    GO TO FLEET
                </NiceButton>
            </Stack>
        )
    }, [list, factionTheme.primary, selectedMechs, toggleSelectedMech])

    return (
        <Stack direction="column" flex={1} sx={{ height: "100%", py: "4rem" }}>
            <Stack direction="column" flex={1} spacing="1.5rem" sx={{ overflowY: "hidden", height: "100%" }}>
                <Stack spacing="1.5rem" sx={{ px: "25rem" }}>
                    <Section
                        orderLabel="A"
                        title={`WAR MACHINES (${selectedMechs.length}/${totalLimit})`}
                        description="Select your War machines to deploy for this lobby."
                    />

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
                </Stack>

                {content}
                <Pagination sx={{ mt: "auto" }} count={totalPages} page={page} onChange={(e, p) => changePage(p)} />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: "25rem" }}>
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
