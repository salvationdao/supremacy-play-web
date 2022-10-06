import { Box, Stack } from "@mui/material"
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import Draggable from "react-draggable"
import { SvgSkin, SvgWeapons } from "../../../../../assets"
import { getRarityDeets } from "../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, theme } from "../../../../../theme/theme"
import { AssetItemType, MechSkin, PowerCore, Utility, Weapon } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { GetSubmodelsRequest, GetSubmodelsResponse } from "../../../SubmodelHangar/SubmodelsHangar"
import { GetWeaponsRequest } from "../../../WeaponsHangar/WeaponsHangar"
import { MechLoadoutItemDraggable, MechLoadoutItemSkeleton } from "../../Common/MechLoadoutItem"

export type CustomDragEvent = (parentRef: HTMLDivElement, clientRect: DOMRect) => void
export type CustomDragEventWithType = (parentRef: HTMLDivElement, clientRect: DOMRect, type: AssetItemType) => void
export type DragStartEvent = (parentRef: HTMLDivElement) => void
export type DragStopEvent = (parentRef: HTMLDivElement, clientRect: DOMRect) => void
export type DragStopEventWithType = (parentRef: HTMLDivElement, clientRect: DOMRect, type: AssetItemType, item: Weapon | PowerCore | Utility | MechSkin) => void

export type DraggablesHandle = {
    handleMechLoadoutUpdated: () => void
}

export interface GetWeaponsDetailedResponse {
    weapons: Weapon[]
    total: number
}

export interface MechLoadoutDraggablesProps {
    draggablesRef: React.ForwardedRef<DraggablesHandle>
    onDrag: CustomDragEventWithType
    onDragStart: DragStartEvent
    onDragStop: DragStopEventWithType
    excludeWeaponIDs: string[]
    includeMechSkinIDs: string[]
}

export const MechLoadoutDraggables = ({ draggablesRef, onDrag, onDragStart, onDragStop, excludeWeaponIDs, includeMechSkinIDs }: MechLoadoutDraggablesProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const weaponsMemoized = useRef<Weapon[]>([])
    const [weapons, setWeapons] = useState<Weapon[]>([])
    const [isWeaponsLoading, setIsWeaponsLoading] = useState(true)
    const [weaponsError, setWeaponsError] = useState<string>()

    const mechSkinsMemoized = useRef<MechSkin[]>([])
    const [mechSkins, setMechSkins] = useState<MechSkin[]>([])
    const [isMechSkinsLoading, setIsMechSkinsLoading] = useState(true)
    const [mechSkinsError, setMechSkinsError] = useState<string>()

    useImperativeHandle(draggablesRef, () => ({
        handleMechLoadoutUpdated: () => {
            getWeapons()
            getMechSkins()
        },
    }))

    useEffect(() => {
        const set = new Set(excludeWeaponIDs)
        setWeapons([...weaponsMemoized.current.filter((w) => !set.has(w.id))])
    }, [excludeWeaponIDs])

    const getWeapons = useCallback(async () => {
        setIsWeaponsLoading(true)
        try {
            const resp = await send<GetWeaponsDetailedResponse, GetWeaponsRequest>(GameServerKeys.GetWeaponsDetailed, {
                page: 1,
                page_size: 3,
                sort_by: "asc",
                sort_dir: "rarity",
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

    const getMechSkins = useCallback(async () => {
        setIsMechSkinsLoading(true)
        try {
            const resp = await send<GetSubmodelsResponse, GetSubmodelsRequest>(GameServerKeys.GetMechSubmodelsDetailed, {
                page: 1,
                page_size: 3,
                sort_by: "asc",
                sort_dir: "rarity",
                include_market_listed: false,
                display_genesis_and_limited: true,
                exclude_market_locked: true,
                display_xsyn: false,
                skin_compatibility: [],
                exclude_ids: [],
                include_ids: includeMechSkinIDs,
                rarities: [],
                equipped_statuses: ["unequipped"],
                search: "",
            })

            if (!resp) return
            setMechSkinsError(undefined)
            setMechSkins(resp.submodels)
            mechSkinsMemoized.current = resp.submodels
        } catch (e) {
            setMechSkinsError(typeof e === "string" ? e : "Failed to get mech skins.")
            console.error(e)
        } finally {
            setIsMechSkinsLoading(false)
        }
    }, [includeMechSkinIDs, send])

    useEffect(() => {
        getWeapons()
        getMechSkins()
    }, [getMechSkins, getWeapons])

    const weaponsContent = useMemo(() => {
        if (isWeaponsLoading) {
            return (
                <>
                    <MechLoadoutItemSkeleton />
                    <MechLoadoutItemSkeleton />
                    <MechLoadoutItemSkeleton />
                    <MechLoadoutItemSkeleton />
                </>
            )
        }
        if (weaponsError) {
            return weaponsError
        }

        return weapons.map((w) => (
            <MechLoadoutDraggable
                key={w.id}
                onDrag={(parentEl, rect) => {
                    onDrag(parentEl, rect, AssetItemType.Weapon)
                }}
                onDragStart={onDragStart}
                onDragStop={(parentEl, rect) => {
                    onDragStop(parentEl, rect, AssetItemType.Weapon, w)
                }}
                renderDraggable={(ref) => (
                    <MechLoadoutItemDraggable
                        ref={ref}
                        imageUrl={w.image_url || w.avatar_url}
                        label={w.label}
                        primaryColor={colors.weapons}
                        Icon={SvgWeapons}
                        rarity={w.tier ? getRarityDeets(w.tier) : undefined}
                    />
                )}
            />
        ))
    }, [isWeaponsLoading, weaponsError, onDrag, onDragStart, onDragStop, weapons])

    const mechSkinsContent = useMemo(() => {
        if (isMechSkinsLoading) {
            return (
                <>
                    <MechLoadoutItemSkeleton />
                    <MechLoadoutItemSkeleton />
                    <MechLoadoutItemSkeleton />
                    <MechLoadoutItemSkeleton />
                </>
            )
        }
        if (mechSkinsError) {
            return mechSkinsError
        }

        return mechSkins.map((ms) => (
            <MechLoadoutDraggable
                key={ms.id}
                onDrag={(parentEl, rect) => {
                    onDrag(parentEl, rect, AssetItemType.MechSkin)
                }}
                onDragStart={onDragStart}
                onDragStop={(parentEl, rect) => {
                    onDragStop(parentEl, rect, AssetItemType.MechSkin, ms)
                }}
                renderDraggable={(ref) => (
                    <MechLoadoutItemDraggable
                        ref={ref}
                        imageUrl={ms.swatch_images?.image_url || ms.swatch_images?.avatar_url || ms.image_url || ms.avatar_url}
                        label={ms.label}
                        primaryColor={colors.chassisSkin}
                        Icon={SvgSkin}
                        rarity={ms.tier ? getRarityDeets(ms.tier) : undefined}
                    />
                )}
            />
        ))
    }, [isMechSkinsLoading, mechSkins, mechSkinsError, onDrag, onDragStart, onDragStop])

    return (
        <Stack spacing="1rem">
            <Box
                sx={{
                    position: "relative",
                    height: "50%",
                }}
            >
                <MechLoadoutItemDraggable
                    style={{
                        visibility: "hidden",
                    }}
                    label="OUTRO ANIMATION"
                    primaryColor={colors.outroAnimation}
                    isEmpty
                />
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <></>
                </ClipThing>
                <Stack
                    spacing="1rem"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "1rem",
                    }}
                >
                    {weaponsContent}
                </Stack>
            </Box>
            <Box
                sx={{
                    position: "relative",
                    height: "50%",
                }}
            >
                <MechLoadoutItemDraggable
                    style={{
                        visibility: "hidden",
                    }}
                    label="OUTRO ANIMATION"
                    primaryColor={colors.outroAnimation}
                    isEmpty
                />
                <ClipThing
                    clipSize="10px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    backgroundColor={theme.factionTheme.background}
                    sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <></>
                </ClipThing>
                <Stack
                    spacing="1rem"
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "1rem",
                    }}
                >
                    {mechSkinsContent}
                </Stack>
            </Box>
        </Stack>
    )
}

interface MechLoadoutDraggableProps {
    renderDraggable: (ref: React.RefObject<HTMLDivElement>) => JSX.Element
    onDrag: CustomDragEvent
    onDragStart: DragStartEvent
    onDragStop: DragStopEvent
}

const MechLoadoutDraggable = ({ renderDraggable, onDrag, onDragStart, onDragStop }: MechLoadoutDraggableProps) => {
    const transformableRef = useRef<HTMLDivElement>(null)
    const draggableRef = useRef<HTMLDivElement>(null)

    return (
        <Box
            ref={transformableRef}
            sx={{
                "&:hover": {
                    transition: "transform .1s ease-out",
                    transform: "scale(1.1)",
                    cursor: "grab",
                },
                "&:active": {
                    transition: "transform .1s ease-in",
                    transform: "scale(1.0)",
                    cursor: "grabbing",
                },
            }}
        >
            <Draggable
                position={{ x: 0, y: 0 }}
                onDrag={() => {
                    if (!draggableRef.current || !transformableRef.current) return
                    onDrag(transformableRef.current, draggableRef.current.getBoundingClientRect())
                }}
                onStart={() => {
                    if (!draggableRef.current || !transformableRef.current) return
                    onDragStart(transformableRef.current)
                }}
                onStop={() => {
                    if (!draggableRef.current || !transformableRef.current) return
                    onDragStop(transformableRef.current, draggableRef.current.getBoundingClientRect())
                }}
            >
                {renderDraggable(draggableRef)}
            </Draggable>
        </Box>
    )
}
