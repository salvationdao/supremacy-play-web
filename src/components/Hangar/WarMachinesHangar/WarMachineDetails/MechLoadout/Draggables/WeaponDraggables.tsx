import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgWeapons } from "../../../../../../assets"
import { getRarityDeets } from "../../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../../keys"
import { fonts, theme } from "../../../../../../theme/theme"
import { AssetItemType, Weapon } from "../../../../../../types"
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
    const { send } = useGameServerCommandsUser("/user_commander")

    const weaponsMemoized = useRef<Weapon[]>([])
    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [isWeaponsLoading, setIsWeaponsLoading] = useState(true)
    const [weaponsError, setWeaponsError] = useState<string>()

    const { onDrag, onDragStart, onDragStop } = drag

    useEffect(() => {
        const set = new Set(excludeWeaponIDs)
        setWeapons([...weaponsMemoized.current.filter((w) => !set.has(w.id))])
    }, [excludeWeaponIDs])

    const getWeapons = useCallback(async () => {
        setIsWeaponsLoading(true)
        try {
            const resp = await send<GetWeaponsDetailedResponse, GetWeaponsRequest>(GameServerKeys.GetWeaponsDetailed, {
                page: 1,
                page_size: 9,
                sort_by: "date",
                sort_dir: "desc",
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
            weaponsMemoized.current = resp.weapons
        } catch (e) {
            setWeaponsError(typeof e === "string" ? e : "Failed to get weapons.")
            console.error(e)
        } finally {
            setIsWeaponsLoading(false)
        }
    }, [send])
    useEffect(() => {
        getWeapons()
    }, [getWeapons])

    const weaponsContent = useMemo(() => {
        if (isWeaponsLoading) {
            return <Typography>Loading weapons...</Typography>
        }
        if (weaponsError) {
            return <Typography>{weaponsError}</Typography>
        }
        if (weapons.length === 0) {
            return (
                <Stack alignItems="center" justifyContent="center" height="100%">
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

        return weapons.map((w) => (
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
                    <Box ref={ref}>
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
                        />
                    </Box>
                )}
            />
        ))
    }, [isWeaponsLoading, weaponsError, weapons, onDrag, onDragStart, onDragStop])

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            }}
        >
            {weaponsContent}
        </Box>
    )
}
