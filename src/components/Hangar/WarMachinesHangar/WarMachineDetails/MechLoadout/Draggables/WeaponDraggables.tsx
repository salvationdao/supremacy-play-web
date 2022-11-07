import { Box, InputBase, InputBaseProps, MenuItem, Pagination, Select, Stack, StackProps, styled, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgSearch, SvgWeapons } from "../../../../../../assets"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { AssetItemType, Weapon } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { GetWeaponsRequest } from "../../../../WeaponsHangar/WeaponsHangar"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"
import { DragWithTypesProps } from "../MechLoadoutDraggables"
import { LoadoutDraggable } from "./LoadoutDraggable"

export interface GetWeaponsDetailedResponse {
    weapons: Weapon[]
    total: number
}

export interface WeaponDraggablesProps {
    excludeWeaponIDs: string[]
    drag: DragWithTypesProps
}

export const WeaponDraggables = ({ excludeWeaponIDs, drag }: WeaponDraggablesProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")

    const weaponsMemoized = useRef<Weapon[]>([])
    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [isWeaponsLoading, setIsWeaponsLoading] = useState(true)
    const [weaponsError, setWeaponsError] = useState<string>()
    const [sort, setSort] = useState<string>(SortTypeLabel.DateAddedNewest)
    const { page, changePage, setTotalItems, totalPages, pageSize } = usePagination({
        pageSize: 9,
        page: 1,
    })

    const { onDrag, onDragStart, onDragStop } = drag

    useEffect(() => {
        const set = new Set(excludeWeaponIDs)
        setWeapons([...weaponsMemoized.current.filter((w) => !set.has(w.id))])
    }, [excludeWeaponIDs])

    const getWeapons = useCallback(async () => {
        setIsWeaponsLoading(true)
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

            const resp = await send<GetWeaponsDetailedResponse, GetWeaponsRequest>(GameServerKeys.GetWeaponsDetailed, {
                page,
                page_size: pageSize,
                sort_by: sortBy,
                sort_dir: sortDir,
                include_market_listed: false,
                display_genesis_and_limited: true,
                exclude_ids: [],
                weapon_types: [],
                rarities: [],
                equipped_statuses: ["unequipped"],
                search: "",
            })

            if (!resp) return
            setWeaponsError(undefined)
            setWeapons(resp.weapons)
            setTotalItems(resp.total)
            weaponsMemoized.current = resp.weapons
        } catch (e) {
            setWeaponsError(typeof e === "string" ? e : "Failed to get weapons.")
            console.error(e)
        } finally {
            setIsWeaponsLoading(false)
        }
    }, [page, pageSize, send, setTotalItems, sort])
    useEffect(() => {
        getWeapons()
    }, [getWeapons])

    const weaponsContent = useMemo(() => {
        if (isWeaponsLoading) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>Loading weapons...</Typography>
                </Stack>
            )
        }
        if (weaponsError) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography>{weaponsError}</Typography>
                </Stack>
            )
        }
        if (weapons.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" flex={1}>
                    <Typography
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            color: `${theme.factionTheme.primary}aa`,
                            textTransform: "uppercase",
                        }}
                    >
                        No Weapons
                    </Typography>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: "1rem",
                }}
            >
                {weapons.map((w) => (
                    <LoadoutDraggable
                        key={w.id}
                        drag={{
                            onDrag: (rect) => {
                                onDrag(rect, AssetItemType.Weapon)
                            },
                            onDragStart: () => {
                                onDragStart(AssetItemType.Weapon)
                            },
                            onDragStop: (rect) => {
                                onDragStop(rect, AssetItemType.Weapon, w)
                            },
                        }}
                        renderDraggable={(ref) => (
                            <Box
                                ref={ref}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <MechLoadoutItem
                                    imageUrl={w.image_url || w.avatar_url}
                                    label={w.label}
                                    Icon={SvgWeapons}
                                    rarity={w.tier ? getRarityDeets(w.tier) : undefined}
                                    subLabel={w.weapon_type}
                                    TopRight={
                                        <Stack>
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.shareTech,
                                                }}
                                            >
                                                {w.damage}
                                            </Typography>
                                        </Stack>
                                    }
                                    shape="square"
                                    size="full-width"
                                />
                            </Box>
                        )}
                    />
                ))}
            </Box>
        )
    }, [isWeaponsLoading, onDrag, onDragStart, onDragStop, theme.factionTheme.primary, weapons, weaponsError])

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
            {weaponsContent}
            <Box flex={1} />

            {/* Pagination */}
            <Pagination count={totalPages} page={page} onChange={(_, p) => changePage(p)} />
        </Stack>
    )
}

export const NiceInputBase = styled(({ sx, ...props }: InputBaseProps) => (
    <InputBase
        sx={(theme) => ({
            p: ".5rem 2rem",
            border: `1px solid ${colors.darkGrey}aa`,
            backgroundColor: `${theme.factionTheme.primary}22`,
            ".MuiInputBase-input": {
                p: 0,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(sx as any),
        })}
        {...props}
    />
))({})

interface InputLabeller extends StackProps {
    label: string
    name?: string
}

export const InputLabeller = styled(({ label, name, sx, children, ...props }: InputLabeller) => (
    <Stack
        direction="row"
        sx={{
            alignItems: "stretch",
            ...sx,
        }}
        {...props}
    >
        <Box
            component="label"
            htmlFor={name}
            p=".5rem 2rem"
            sx={(theme) => ({
                border: `1px solid ${colors.darkGrey}aa`,
                borderRight: "none",
                backgroundColor: `${theme.factionTheme.primary}22`,
            })}
        >
            <Typography>{label}</Typography>
        </Box>
        {children}
    </Stack>
))({})
