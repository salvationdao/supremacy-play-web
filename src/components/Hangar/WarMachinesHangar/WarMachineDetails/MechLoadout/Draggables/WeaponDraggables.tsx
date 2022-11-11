import { Box, CircularProgress, InputBase, InputBaseProps, Pagination, Stack, StackProps, styled, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgDrag, SvgLoadoutDamage, SvgLoadoutWeapon, SvgSearch } from "../../../../../../assets"
import { useDimension } from "../../../../../../containers"
import { useTheme } from "../../../../../../containers/theme"
import { getRarityDeets } from "../../../../../../helpers"
import { usePagination } from "../../../../../../hooks"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { colors, fonts } from "../../../../../../theme/theme"
import { AssetItemType, Weapon } from "../../../../../../types"
import { SortTypeLabel } from "../../../../../../types/marketplace"
import { NiceSelect } from "../../../../../Common/Nice/NiceSelect"
import { GetWeaponsRequest } from "../../../../WeaponsHangar/WeaponsHangar"
import { MechLoadoutItem } from "../../../Common/MechLoadoutItem"
import { DragWithTypesProps } from "../MechLoadoutDraggables"
import { WeaponTooltip } from "../Tooltips/WeaponTooltip"
import { LoadoutDraggable } from "./LoadoutDraggable"

export interface GetWeaponsDetailedResponse {
    weapons: Weapon[]
    total: number
}

export interface WeaponDraggablesProps {
    compareToWeapon?: Weapon
    excludeWeaponIDs: string[]
    drag: DragWithTypesProps
}

export const WeaponDraggables = ({ compareToWeapon, excludeWeaponIDs, drag }: WeaponDraggablesProps) => {
    const theme = useTheme()
    const { mainContentDimensions, triggerReset } = useDimension()
    const { send } = useGameServerCommandsUser("/user_commander")

    const weaponsMemoized = useRef<Weapon[]>([])
    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [isWeaponsLoading, setIsWeaponsLoading] = useState(true)
    const [weaponsError, setWeaponsError] = useState<string>()
    const [sort, setSort] = useState<string>(SortTypeLabel.DateAddedNewest)
    const { page, changePage, setTotalItems, totalPages, pageSize, changePageSize } = usePagination({
        pageSize: mainContentDimensions.height > 900 ? 8 : 6,
        page: 1,
    })

    const { onDrag, onDragStart, onDragStop } = drag

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

    useEffect(() => {
        triggerReset()
    }, [triggerReset])

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
                search,
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
    }, [page, pageSize, search, send, setTotalItems, sort])
    useEffect(() => {
        getWeapons()
    }, [getWeapons])
    useEffect(() => {
        if (mainContentDimensions.height > 900) {
            changePageSize(8)
        } else if (mainContentDimensions.height > 700) {
            changePageSize(6)
        } else {
            changePageSize(4)
        }
        console.log(mainContentDimensions.height)
    }, [changePageSize, mainContentDimensions.height])

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
                    gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
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
                                    Icon={SvgLoadoutWeapon}
                                    rarity={w.tier ? getRarityDeets(w.tier) : undefined}
                                    subLabel={`${w.weapon_type} | ${w.default_damage_type}`}
                                    TopRight={
                                        <Stack alignItems="end">
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.shareTech,
                                                }}
                                            >
                                                <SvgLoadoutDamage
                                                    sx={{
                                                        display: "inline-block",
                                                        verticalAlign: "middle",
                                                        lineHeight: "normal",
                                                        mr: ".5rem",
                                                    }}
                                                />
                                                {w.damage}
                                            </Typography>
                                            <SvgDrag />
                                        </Stack>
                                    }
                                    renderTooltip={() => <WeaponTooltip id={w.id} compareTo={compareToWeapon} />}
                                    shape="rectangle"
                                    size="full-width"
                                />
                            </Box>
                        )}
                    />
                ))}
            </Box>
        )
    }, [compareToWeapon, isWeaponsLoading, onDrag, onDragStart, onDragStop, theme.factionTheme.primary, weapons, weaponsError])

    return (
        <Stack spacing="2rem" minHeight={200}>
            {/* Search and sort */}
            <Stack direction="row" spacing="1rem">
                <NiceInputBase
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    placeholder="Search weapons..."
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
            p: ".25rem 2rem",
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
            p=".25rem 2rem"
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
