import { Box, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgPowerCore, SvgSearch } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts } from "../../../../../../theme/theme"
import { AssetItemType, PowerCore } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"
import { GetPowerCoresRequest } from "../../Modals/Loadout/MechLoadoutPowerCoreModal"
import { DragWithTypesProps } from "../MechLoadoutDraggables"
import { LoadoutDraggable } from "./LoadoutDraggable"
import { InputLabeller, NiceInputBase } from "./WeaponDraggables"

export interface GetPowerCoresDetailedResponse {
    power_cores: PowerCore[]
    total: number
}

export interface PowerCoreDraggablesProps {
    drag: DragWithTypesProps
    powerCoreSize: string
}

export const PowerCoreDraggables = ({ drag, powerCoreSize }: PowerCoreDraggablesProps) => {
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

    const { onDrag, onDragStart, onDragStop } = drag

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
                search: "",
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
    }, [page, pageSize, powerCoreSize, send, setTotalItems, sort])
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
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "2rem",
                }}
            >
                {powerCores.map((w) => (
                    <LoadoutDraggable
                        key={w.id}
                        drag={{
                            onDrag: (rect) => {
                                onDrag(rect, AssetItemType.PowerCore)
                            },
                            onDragStart: () => {
                                onDragStart(AssetItemType.PowerCore)
                            },
                            onDragStop: (rect) => {
                                onDragStop(rect, AssetItemType.PowerCore, w)
                            },
                        }}
                        renderDraggable={(ref) => (
                            <Box
                                ref={ref}
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <MechLoadoutItem
                                    imageUrl={w.image_url || w.avatar_url}
                                    label={w.label}
                                    Icon={SvgPowerCore}
                                    rarity={w.tier ? getRarityDeets(w.tier) : undefined}
                                    shape="square"
                                    size="full-width"
                                />
                            </Box>
                        )}
                    />
                ))}
            </Box>
        )
    }, [isPowerCoresLoading, onDrag, onDragStart, onDragStop, theme.factionTheme.primary, powerCores, powerCoresError])

    return (
        <Stack spacing="2rem" minHeight={400}>
            {/* Search and sort */}
            <Stack direction="row" spacing="1rem">
                <NiceInputBase placeholder="Search weapons..." endAdornment={<SvgSearch fill={"rgba(255, 255, 255, 0.4)"} />} />
                <InputLabeller flex={1} label="Sort:" name="sort">
                    <Select name="sort" value={sort} onChange={(e) => setSort(e.target.value)} input={<NiceInputBase />}>
                        <MenuItem value={SortTypeLabel.Alphabetical}>{SortTypeLabel.Alphabetical}</MenuItem>
                        <MenuItem value={SortTypeLabel.AlphabeticalReverse}>{SortTypeLabel.AlphabeticalReverse}</MenuItem>
                        <MenuItem value={SortTypeLabel.RarestAsc}>{SortTypeLabel.RarestAsc}</MenuItem>
                        <MenuItem value={SortTypeLabel.RarestDesc}>{SortTypeLabel.RarestDesc}</MenuItem>
                        <MenuItem value={SortTypeLabel.DateAddedNewest}>Date added: newest</MenuItem>
                        <MenuItem value={SortTypeLabel.DateAddedOldest}>Date added: oldest</MenuItem>
                    </Select>
                </InputLabeller>
            </Stack>

            {/* Content */}
            {powerCoresContent}

            {/* Pagination */}
            <Pagination count={totalPages} page={page} onChange={(_, p) => changePage(p)} />
        </Stack>
    )
}
