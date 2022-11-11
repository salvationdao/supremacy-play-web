import { Box, CircularProgress, Pagination, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgLoadoutPowerCore, SvgSearch } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts } from "../../../../../../theme/theme"
import { AssetItemType, PowerCore } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { NiceSelect } from "../../../../../Common/Nice/NiceSelect"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"
import { OnClickEventWithType } from "../MechLoadoutDraggables"
import { GetPowerCoresRequest } from "../Modals/MechLoadoutPowerCoreModal"
import { NiceInputBase } from "./WeaponDraggables"

export interface GetPowerCoresDetailedResponse {
    power_cores: PowerCore[]
    total: number
}

export interface PowerCoreDraggablesProps {
    powerCoreSize: string
    onClick: OnClickEventWithType
}

export const PowerCoreDraggables = ({ powerCoreSize, onClick }: PowerCoreDraggablesProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const powerCoresMemoized = useRef<PowerCore[]>([])
    const [powerCores, setPowerCores] = useState<PowerCore[]>([])
    const [isPowerCoresLoading, setIsPowerCoresLoading] = useState(true)
    const [powerCoresError, setPowerCoresError] = useState<string>()
    const [sort, setSort] = useState<string>(SortTypeLabel.DateAddedNewest)
    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 9,
        page: 1,
    })

    const [search, setSearch] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const debounceTimeoutRef = useRef<NodeJS.Timeout>()
    const debouncedSetSearch = (newValue: string) => {
        setSearchLoading(true)
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setSearch(newValue)
            setSearchLoading(false)
        }, 1000)
    }

    const getPowerCores = useCallback(async () => {
        setIsPowerCoresLoading(true)
        try {
            let sortDir = "asc"
            let sortBy = ""
            if (sort === SortTypeLabel.AlphabeticalReverse || sort === SortTypeLabel.RarestDesc) sortDir = "desc"

            switch (sort) {
                case SortTypeLabel.Alphabetical:
                    sortBy = "alphabetical"
                    break
                case SortTypeLabel.AlphabeticalReverse:
                    sortBy = "alphabetical"
                    sortDir = "desc"
                    break
                case SortTypeLabel.RarestAsc:
                    sortBy = "rarity"
                    break
                case SortTypeLabel.RarestDesc:
                    sortBy = "rarity"
                    sortDir = "desc"
                    break
                case SortTypeLabel.DateAddedOldest:
                    sortBy = "date"
                    break
                case SortTypeLabel.DateAddedNewest:
                    sortBy = "date"
                    sortDir = "desc"
                    break
            }

            const resp = await send<GetPowerCoresDetailedResponse, GetPowerCoresRequest>(GameServerKeys.GetPowerCoresDetailed, {
                page,
                page_size: pageSize,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,
                exclude_ids: [],
                rarities: [],
                sizes: [powerCoreSize],
                equipped_statuses: ["unequipped"],
                search,
            })

            if (!resp) return
            setPowerCoresError(undefined)
            setPowerCores(resp.power_cores)
            setTotalItems(resp.total)
            powerCoresMemoized.current = resp.power_cores
        } catch (e) {
            setPowerCoresError(typeof e === "string" ? e : "Failed to get power cores.")
            console.error(e)
        } finally {
            setIsPowerCoresLoading(false)
        }
    }, [page, pageSize, powerCoreSize, search, send, setTotalItems, sort])
    useEffect(() => {
        getPowerCores()
    }, [getPowerCores])

    const powerCoresContent = useMemo(() => {
        if (isPowerCoresLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>Loading power cores...</Typography>
                </Stack>
            )
        }
        if (powerCoresError) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>{powerCoresError}</Typography>
                </Stack>
            )
        }
        if (powerCores.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: `${theme.factionTheme.primary}aa`,
                            textTransform: "uppercase",
                        }}
                    >
                        No Power Cores
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(100px, 1fr))",
                    gap: "1rem",
                }}
            >
                {powerCores.map((pc, index) => (
                    <MechLoadoutItem
                        key={index}
                        imageUrl={pc.image_url || pc.avatar_url}
                        label={pc.label}
                        Icon={SvgLoadoutPowerCore}
                        rarity={pc.tier ? getRarityDeets(pc.tier) : undefined}
                        shape="square"
                        size="full-width"
                        onClick={(e) => onClick(e, AssetItemType.PowerCore, pc)}
                    />
                ))}
            </Box>
        )
    }, [isPowerCoresLoading, onClick, powerCores, powerCoresError, theme.factionTheme.primary])

    return (
        <Stack spacing="2rem" minHeight={400}>
            {/* Search and sort */}
            <Stack direction="row" spacing="1rem">
                <NiceInputBase
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    placeholder="Search power cores..."
                    endAdornment={searchLoading ? <CircularProgress size="1rem" /> : <SvgSearch size="1.6rem" fill={"rgba(255, 255, 255, 0.4)"} />}
                />
                <NiceSelect
                    label="Sort:"
                    primaryColor={theme.factionTheme.primary}
                    secondaryColor={theme.factionTheme.secondary}
                    options={[
                        {
                            value: SortTypeLabel.Alphabetical,
                            label: SortTypeLabel.Alphabetical,
                        },
                        {
                            value: SortTypeLabel.AlphabeticalReverse,
                            label: SortTypeLabel.AlphabeticalReverse,
                        },
                        {
                            value: SortTypeLabel.RarestAsc,
                            label: SortTypeLabel.RarestAsc,
                        },
                        {
                            value: SortTypeLabel.RarestDesc,
                            label: SortTypeLabel.RarestDesc,
                        },
                        {
                            value: SortTypeLabel.DateAddedNewest,
                            label: "Date added: newest",
                        },
                        {
                            value: SortTypeLabel.DateAddedOldest,
                            label: "Date added: oldest",
                        },
                    ]}
                    selected={sort}
                    onSelected={(value) => setSort(value)}
                />
            </Stack>

            {/* Content */}
            {powerCoresContent}

            {/* Pagination */}
            <Pagination count={totalPages} page={page} onChange={(_, p) => changePage(p)} />
        </Stack>
    )
}
