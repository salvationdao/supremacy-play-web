import { Box, Button, Divider, Fade, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Svg2DView, Svg3DView, SvgLoadoutDamage, SvgLoadoutEmote, SvgLoadoutPowerCore, SvgLoadoutSkin, SvgLoadoutWeapon, SvgView } from "../../../../../assets"
import { useAuth, useGlobalNotifications } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { getRarityDeets } from "../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { useLocalStorage } from "../../../../../hooks/useLocalStorage"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { AssetItemType, MechDetails, MechSkin, MechStatus, MechStatusEnum, MechTypeEnum, PowerCore, Utility, Weapon, WeaponType } from "../../../../../types"
import { ClipThing } from "../../../../Common/Deprecated/ClipThing"
import { NiceBoxThing } from "../../../../Common/Nice/NiceBoxThing"
import { MechLoadoutItem } from "../../Common/MechLoadoutItem"
import { MechViewer } from "../MechViewer/MechViewer"
import { MechViewer3D } from "../MechViewer/MechViewer3D"
import { UnityHandle } from "../MechViewer/UnityViewer"
import { CustomDragEventWithType, DragStartEventWithType, DragStopEventWithType } from "./Draggables/LoadoutDraggable"
import { DraggablesHandle, MechLoadoutDraggables, OnClickEventWithType } from "./MechLoadoutDraggables"
import { PowerCoreTooltip } from "./Tooltips/PowerCoreTooltip"
import { WeaponTooltip } from "./Tooltips/WeaponTooltip"

export interface SavedSelection {
    inherit_all_weapon_skins?: boolean
    equip_mech_skin?: EquipMechSkin
    equip_power_core?: EquipPowerCore
    equip_utility?: EquipUtility[]
    equip_weapons?: EquipWeapon[]
}

export interface PlayerAssetMechEquipRequest {
    mech_id: string
    inherit_all_weapon_skins?: boolean
    equip_mech_skin?: EquipMechSkin
    equip_power_core?: EquipPowerCore
    equip_utility: EquipUtility[]
    equip_weapons: EquipWeapon[]
}

export interface MechDetailsWithMaps extends MechDetails {
    weapons_map: Map<number, Weapon | null> // Map<slot_number, Weapon>
    utility_map: Map<number, Utility | null> // Map<slot_number, Utility>
}

interface EquipMechSkin {
    mech_skin_id: string
}

export type LoadoutMechSkin = EquipMechSkin & {
    mech_skin: MechSkin
}

interface EquipPowerCore {
    power_core_id: string
    unequip?: boolean
}

export type LoadoutPowerCore = EquipPowerCore & {
    power_core?: PowerCore
}

interface EquipWeapon {
    weapon_id: string
    slot_number: number
    inherit_skin?: boolean
    unequip?: boolean
}

export type LoadoutWeapon = EquipWeapon & {
    weapon?: Weapon
}

interface EquipUtility {
    utility_id: string
    slot_number: number
    unequip?: boolean
}

export type LoadoutUtility = EquipUtility & {
    utility?: Utility
}

const generateLoadout = (newMechDetails: MechDetails): MechDetailsWithMaps => {
    // Build weapons map
    const weapons_map = new Map<number, Weapon | null>()
    for (let i = 0; i < newMechDetails.weapon_hardpoints; i++) {
        weapons_map.set(i, null)
    }
    if (newMechDetails.weapons) {
        newMechDetails.weapons.forEach((w, index) => {
            weapons_map.set(w.slot_number != null ? w.slot_number : index, w)
        })
    }

    // Build utility map
    const utility_map = new Map<number, Utility | null>()
    for (let i = 0; i < newMechDetails.utility_slots; i++) {
        utility_map.set(i, null)
    }
    if (newMechDetails.utility) {
        newMechDetails.utility.forEach((u, index) => {
            utility_map.set(u.slot_number != null ? u.slot_number : index, u)
        })
    }

    return {
        ...newMechDetails,
        weapons_map,
        utility_map,
    }
}

interface MechLoadoutProps {
    mechDetails: MechDetails
    mechStatus?: MechStatus
    mechStaked: boolean
    onUpdate: (newMechDetails: MechDetails) => void
}

const LOCAL_STORAGE_KEY_PREFERS_3D_LOADOUT = "prefers3DLoadout"

export const MechLoadout = ({ mechDetails, mechStatus, mechStaked, onUpdate }: MechLoadoutProps) => {
    const theme = useTheme()
    const { userID } = useAuth()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [currLoadout, setCurrLoadout] = useState<MechDetailsWithMaps>(generateLoadout(mechDetails))

    const [isDragging, setIsDragging] = useState(false)
    const draggablesRef = useRef<DraggablesHandle>(null)

    const [isUnityLoaded, setIsUnityLoaded] = useState(false)
    const [isUnityPendingChange, setIsUnityPendingChange] = useState(false)
    const [enable3DLoadout, setEnable3DLoadout] = useLocalStorage<boolean>(LOCAL_STORAGE_KEY_PREFERS_3D_LOADOUT, true)
    const unityControlsRef = useRef<UnityHandle>(null)
    const orbitControlsRef = useRef<HTMLDivElement>(null)

    const {
        id,
        owner_id,
        weapons_map,
        blueprint_weapon_ids_with_skin_inheritance,
        // utility_map,
        power_core,
        chassis_skin,
        compatible_blueprint_mech_skin_ids,
        intro_animation,
        outro_animation,
        locked_to_marketplace,
        xsyn_locked,
        market_locked,
        mech_type,
        inherit_all_weapon_skins,
    } = currLoadout
    const loadoutDisabled = useMemo(
        () =>
            userID !== owner_id ||
            (enable3DLoadout && (isUnityPendingChange || !isUnityLoaded)) ||
            xsyn_locked ||
            locked_to_marketplace ||
            market_locked ||
            mechStaked ||
            (mechStatus?.battle_lobby_is_locked && mechStatus?.status === MechStatusEnum.Queue) ||
            mechStatus?.status === MechStatusEnum.Battle ||
            mechStatus?.status === MechStatusEnum.Sold,
        [
            enable3DLoadout,
            isUnityLoaded,
            isUnityPendingChange,
            locked_to_marketplace,
            market_locked,
            mechStaked,
            mechStatus?.battle_lobby_is_locked,
            mechStatus?.status,
            owner_id,
            userID,
            xsyn_locked,
        ],
    )

    useEffect(() => {
        setCurrLoadout(generateLoadout(mechDetails))
    }, [mechDetails])

    // Confirm selection and submit payload to server
    const saveSelection = useCallback(
        async (selection: SavedSelection) => {
            try {
                console.info("saving loadout")
                setLoading(true)

                const newMechDetails = await send<MechDetails, PlayerAssetMechEquipRequest>(GameServerKeys.EquipMech, {
                    ...selection,
                    equip_weapons: selection.equip_weapons ? selection.equip_weapons : [],
                    equip_utility: selection.equip_utility ? selection.equip_utility : [],
                    mech_id: mechDetails.id,
                })

                newSnackbarMessage(`Successfully saved loadout.`, "success")
                setError(undefined)
                onUpdate(newMechDetails)

                if (draggablesRef.current) {
                    draggablesRef.current.handleMechLoadoutUpdated()
                }
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message)
                } else if (typeof e === "string") {
                    setError(e)
                }
            } finally {
                setLoading(false)
            }
        },
        [mechDetails.id, newSnackbarMessage, onUpdate, send],
    )

    // EQUIP HANDLERS
    const modifyMechSkin = useCallback(
        (ems: LoadoutMechSkin) => {
            if (unityControlsRef.current) {
                unityControlsRef.current.handleMechSkinUpdate(ems)
            }

            saveSelection({
                equip_mech_skin: ems
                    ? {
                          mech_skin_id: ems.mech_skin.id,
                      }
                    : undefined,
            })
        },
        [saveSelection],
    )
    const modifyPowerCore = useCallback(
        (ep: LoadoutPowerCore) => {
            if (unityControlsRef.current) {
                unityControlsRef.current.handlePowerCoreUpdate(ep)
            }

            saveSelection({
                equip_power_core: ep
                    ? {
                          power_core_id: ep.power_core_id,
                          unequip: ep.unequip,
                      }
                    : undefined,
            })
            setCompareToPowerCore(undefined)
        },
        [saveSelection],
    )
    const modifyWeaponSlot = useCallback(
        (ew: LoadoutWeapon) => {
            // Don't inherit weapon skin if incompatible with mech
            if (ew.inherit_skin && !blueprint_weapon_ids_with_skin_inheritance.find((s) => s === ew.weapon?.blueprint_id)) {
                ew.inherit_skin = false
            }

            if (unityControlsRef.current) {
                unityControlsRef.current.handleWeaponUpdate(ew)
            }

            saveSelection({
                equip_weapons: [
                    {
                        weapon_id: ew.weapon_id,
                        slot_number: ew.slot_number,
                        inherit_skin: ew.inherit_skin,
                        unequip: ew.unequip,
                    },
                ],
            })

            setCompareToWeapon(undefined)
        },
        [blueprint_weapon_ids_with_skin_inheritance, saveSelection],
    )

    // WEAPON INHERIT SKIN INHERITANCE
    const inheritAllWeaponSkins = useCallback(() => {
        const changes: LoadoutWeapon[] = []
        for (let weaponSlotNumber = 0; weaponSlotNumber < currLoadout.weapon_hardpoints; weaponSlotNumber++) {
            const w = currLoadout.weapons_map.get(weaponSlotNumber)
            if (!w || w.weapon_type === WeaponType.RocketPods) continue
            if (!blueprint_weapon_ids_with_skin_inheritance.find((s) => s === w?.blueprint_id)) continue

            const change: LoadoutWeapon = {
                inherit_skin: true,
                slot_number: weaponSlotNumber,
                weapon_id: w.id,
                weapon: w,
            }
            changes.push(change)
            if (unityControlsRef.current) {
                unityControlsRef.current.handleWeaponUpdate(change)
            }
        }
        if (changes.length > 0) {
            saveSelection({
                equip_weapons: changes,
            })
        }
    }, [blueprint_weapon_ids_with_skin_inheritance, currLoadout.weapon_hardpoints, currLoadout.weapons_map, saveSelection])
    const uninheritAllWeaponSkins = useCallback(() => {
        const changes: LoadoutWeapon[] = []
        for (let weaponSlotNumber = 0; weaponSlotNumber < currLoadout.weapon_hardpoints; weaponSlotNumber++) {
            const w = currLoadout.weapons_map.get(weaponSlotNumber)
            if (!w || w.weapon_type === WeaponType.RocketPods) continue
            if (!blueprint_weapon_ids_with_skin_inheritance.find((s) => s === w?.blueprint_id)) continue

            const change: LoadoutWeapon = {
                inherit_skin: false,
                slot_number: weaponSlotNumber,
                weapon_id: w.id,
                weapon: w,
            }
            changes.push(change)
            if (unityControlsRef.current) {
                unityControlsRef.current.handleWeaponUpdate({
                    inherit_skin: false,
                    slot_number: weaponSlotNumber,
                    weapon_id: w.id,
                    weapon: w,
                })
            }
        }
        if (changes.length > 0) {
            saveSelection({
                equip_weapons: changes,
            })
        }
    }, [blueprint_weapon_ids_with_skin_inheritance, currLoadout.weapon_hardpoints, currLoadout.weapons_map, saveSelection])
    const prevMechID = useRef<string | undefined>(undefined) // we can use these refs to avoid triggering any unecessary work in the unity viewer on rerender
    const inheritAllWeaponSkinsMemo = useRef<boolean | undefined>(undefined)
    useEffect(() => {
        if (prevMechID.current !== id) {
            prevMechID.current = id
            inheritAllWeaponSkinsMemo.current = undefined
            return
        }
        if (typeof inheritAllWeaponSkinsMemo.current === "undefined") {
            inheritAllWeaponSkinsMemo.current = inherit_all_weapon_skins
            return
        }

        if (inherit_all_weapon_skins === inheritAllWeaponSkinsMemo.current) return

        console.log("inheriting", inherit_all_weapon_skins)
        if (inherit_all_weapon_skins) {
            inheritAllWeaponSkins()
        } else {
            uninheritAllWeaponSkins()
        }
        inheritAllWeaponSkinsMemo.current = inherit_all_weapon_skins
    }, [id, inheritAllWeaponSkins, inherit_all_weapon_skins, uninheritAllWeaponSkins])

    // DRAG HANDLERS
    const powerCoreItemRef = useRef<HTMLDivElement>(null)
    const mechSkinItemRef = useRef<HTMLDivElement>(null)
    const weaponItemRefs = useRef<Map<number, HTMLDivElement | null>>(new Map()) // Map<slot_number, Element ref>
    const onItemDrag = useCallback<CustomDragEventWithType>(
        (rect, type) => {
            if (loadoutDisabled) return
            switch (type) {
                case AssetItemType.Weapon:
                    for (const kv of weaponItemRefs.current.entries()) {
                        const slotNumber = kv[0]
                        const element = kv[1]
                        if (!element) continue
                        if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                        const slotBoundingRect = element.getBoundingClientRect()
                        const overlaps = checkDOMRectOverlap(rect, slotBoundingRect, 70)

                        if (overlaps) {
                            element.style.transform = "scale(1.1)"
                            element.style.transition = "transform .1s ease-out"
                        } else {
                            element.style.transform = "scale(1.0)"
                            element.style.transition = "transform .1s ease-in"
                        }
                    }
                    break
                case AssetItemType.MechSkin: {
                    if (!mechSkinItemRef.current) return
                    if (chassis_skin?.locked_to_mech) return

                    const slotBoundingRect = mechSkinItemRef.current.getBoundingClientRect()
                    const overlaps = checkDOMRectOverlap(rect, slotBoundingRect, 70)

                    if (overlaps) {
                        mechSkinItemRef.current.style.transform = "scale(1.1)"
                        mechSkinItemRef.current.style.transition = "transform .1s ease-out"
                    } else {
                        mechSkinItemRef.current.style.transform = "scale(1.0)"
                        mechSkinItemRef.current.style.transition = "transform .1s ease-in"
                    }
                    break
                }
                case AssetItemType.PowerCore: {
                    if (!powerCoreItemRef.current) return

                    const slotBoundingRect = powerCoreItemRef.current.getBoundingClientRect()
                    const overlaps = checkDOMRectOverlap(rect, slotBoundingRect, 70)

                    if (overlaps) {
                        powerCoreItemRef.current.style.transform = "scale(1.1)"
                        powerCoreItemRef.current.style.transition = "transform .1s ease-out"
                    } else {
                        powerCoreItemRef.current.style.transform = "scale(1.0)"
                        powerCoreItemRef.current.style.transition = "transform .1s ease-in"
                    }
                    break
                }
            }
        },
        [chassis_skin?.locked_to_mech, loadoutDisabled, weapons_map],
    )
    const onItemDragStart = useCallback<DragStartEventWithType>(
        (type) => {
            if (loadoutDisabled) return
            setIsDragging(true)

            const unhighlightOthers = (type: AssetItemType) => {
                if (type !== AssetItemType.Weapon) {
                    for (const kv of weaponItemRefs.current.entries()) {
                        const slotNumber = kv[0]
                        const element = kv[1]
                        if (!element) continue
                        if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                        element.style.filter = `grayscale(80%)`
                    }
                }
                if (type !== AssetItemType.MechSkin) {
                    if (mechSkinItemRef.current && !chassis_skin?.locked_to_mech) {
                        mechSkinItemRef.current.style.filter = `grayscale(80%)`
                    }
                }
                if (type !== AssetItemType.PowerCore) {
                    if (powerCoreItemRef.current) {
                        powerCoreItemRef.current.style.filter = `grayscale(80%)`
                    }
                }
            }

            switch (type) {
                case AssetItemType.Weapon:
                    // Highlight elements
                    for (const kv of weaponItemRefs.current.entries()) {
                        const slotNumber = kv[0]
                        const element = kv[1]
                        if (!element) continue
                        if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                        element.style.filter = `drop-shadow(0 0 1rem ${colors.weapons})`
                    }

                    // Unhighlight unrelated slots
                    unhighlightOthers(AssetItemType.Weapon)
                    break
                case AssetItemType.MechSkin:
                    if (!mechSkinItemRef.current) return
                    if (chassis_skin?.locked_to_mech) return

                    mechSkinItemRef.current.style.filter = `drop-shadow(0 0 1rem ${colors.chassisSkin})`

                    unhighlightOthers(AssetItemType.MechSkin)
                    break
                case AssetItemType.PowerCore:
                    if (!powerCoreItemRef.current) return

                    powerCoreItemRef.current.style.filter = `drop-shadow(0 0 1rem ${colors.powerCore})`

                    unhighlightOthers(AssetItemType.PowerCore)
                    break
            }
        },
        [chassis_skin?.locked_to_mech, loadoutDisabled, weapons_map],
    )
    const onItemDragStop = useCallback<DragStopEventWithType>(
        (rect, type, item) => {
            if (loadoutDisabled) return
            switch (type) {
                case AssetItemType.Weapon:
                    for (const kv of weaponItemRefs.current.entries()) {
                        const slotNumber = kv[0]
                        const element = kv[1]
                        if (!element) continue
                        if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                        const slotBoundingRect = element.getBoundingClientRect()
                        const overlaps = checkDOMRectOverlap(rect, slotBoundingRect, 70)

                        if (overlaps) {
                            const weapon = item as Weapon
                            modifyWeaponSlot({
                                weapon: weapon,
                                weapon_id: weapon.id,
                                slot_number: kv[0],
                                inherit_skin: inherit_all_weapon_skins,
                            })
                            break
                        }
                    }
                    break
                case AssetItemType.MechSkin: {
                    if (!mechSkinItemRef.current) return
                    if (chassis_skin?.locked_to_mech) return

                    const slotBoundingRect = mechSkinItemRef.current.getBoundingClientRect()
                    const overlaps = checkDOMRectOverlap(rect, slotBoundingRect, 70)

                    if (overlaps) {
                        const mechSkin = item as MechSkin
                        modifyMechSkin({
                            mech_skin: mechSkin,
                            mech_skin_id: mechSkin.id,
                        })
                    }
                    break
                }
                case AssetItemType.PowerCore: {
                    if (!powerCoreItemRef.current) return

                    const slotBoundingRect = powerCoreItemRef.current.getBoundingClientRect()
                    const overlaps = checkDOMRectOverlap(rect, slotBoundingRect, 70)

                    if (overlaps) {
                        const powerCore = item as PowerCore
                        modifyPowerCore({
                            power_core: powerCore,
                            power_core_id: powerCore.id,
                        })
                    }
                    break
                }
            }

            for (const kv of weaponItemRefs.current.entries()) {
                const slotNumber = kv[0]
                const element = kv[1]
                if (!element) continue
                if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                element.style.filter = "none"
            }

            if (mechSkinItemRef.current && !chassis_skin?.locked_to_mech) {
                mechSkinItemRef.current.style.filter = "none"
            }

            if (powerCoreItemRef.current) {
                powerCoreItemRef.current.style.filter = "none"
            }

            setIsDragging(false)
        },
        [chassis_skin?.locked_to_mech, inherit_all_weapon_skins, loadoutDisabled, modifyMechSkin, modifyPowerCore, modifyWeaponSlot, weapons_map],
    )
    // Some items (i.e. mech skin) have an on click event, not a drag event
    const onItemClick = useCallback<OnClickEventWithType>(
        (e, type, item) => {
            if (loadoutDisabled) return
            switch (type) {
                case AssetItemType.MechSkin: {
                    if (!mechSkinItemRef.current) return
                    if (chassis_skin?.locked_to_mech) return

                    const mechSkin = item as MechSkin
                    modifyMechSkin({
                        mech_skin: mechSkin,
                        mech_skin_id: mechSkin.id,
                    })
                    break
                }
                case AssetItemType.PowerCore: {
                    if (!powerCoreItemRef.current) return
                    const powerCore = item as PowerCore
                    modifyPowerCore({
                        power_core: powerCore,
                        power_core_id: powerCore.id,
                    })
                    break
                }
            }
        },
        [chassis_skin?.locked_to_mech, loadoutDisabled, modifyMechSkin, modifyPowerCore],
    )

    // 2D/3D VIEW SWITCHERS
    const switchTo2DView = async () => {
        if (!unityControlsRef.current) return
        await unityControlsRef.current.handleUnload()
        setEnable3DLoadout(false)
        setIsUnityLoaded(false)
    }
    const switchTo3DView = async () => {
        setEnable3DLoadout(true)
    }

    // LOADOUT ITEM RENDERERS
    const [compareToWeapon, setCompareToWeapon] = useState<LoadoutWeapon>()
    const renderWeaponSlot = useCallback(
        (slotNumber: number, side?: "left" | "right") => {
            const weapon = weapons_map.get(slotNumber)
            if (typeof weapon === "undefined") return

            if (weapon) {
                return (
                    <MechLoadoutItem
                        ref={(r) => weaponItemRefs.current.set(slotNumber, r)}
                        disabled={loadoutDisabled}
                        key={weapon.id}
                        imageUrl={weapon.image_url || weapon.avatar_url}
                        label={weapon.label}
                        subLabel={`${weapon.weapon_type} | ${weapon.default_damage_type}`}
                        Icon={SvgLoadoutWeapon}
                        TopRight={
                            <Typography
                                sx={{
                                    fontFamily: fonts.rajdhaniMedium,
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
                                {weapon.damage}
                            </Typography>
                        }
                        BottomRight={compareToWeapon?.weapon_id === weapon.id && <SvgView fill={colors.neonBlue} />}
                        renderTooltip={() => <WeaponTooltip id={weapon.id} />}
                        rarity={weapon.weapon_skin ? getRarityDeets(weapon.weapon_skin.tier) : undefined}
                        locked={weapon.locked_to_mech}
                        onClick={() =>
                            setCompareToWeapon({
                                slot_number: slotNumber,
                                weapon_id: weapon.id,
                                weapon: weapon,
                            })
                        }
                        onUnequip={() =>
                            modifyWeaponSlot({
                                weapon_id: "",
                                slot_number: slotNumber,
                                unequip: true,
                            })
                        }
                        side={side}
                    />
                )
            }

            return (
                <MechLoadoutItem
                    ref={(r) => weaponItemRefs.current.set(slotNumber, r)}
                    disabled={loadoutDisabled}
                    key={slotNumber}
                    label="WEAPON"
                    Icon={SvgLoadoutWeapon}
                    side={side}
                    isEmpty
                />
            )
        },
        [loadoutDisabled, modifyWeaponSlot, compareToWeapon?.weapon_id, weapons_map],
    )

    const [compareToPowerCore, setCompareToPowerCore] = useState<LoadoutPowerCore>()
    const powerCoreSlot = useMemo(() => {
        const powerCore = power_core

        if (powerCore) {
            return (
                <MechLoadoutItem
                    ref={powerCoreItemRef}
                    disabled={loadoutDisabled}
                    imageUrl={powerCore.image_url || powerCore.avatar_url}
                    label={powerCore.label}
                    Icon={SvgLoadoutPowerCore}
                    rarity={getRarityDeets(powerCore.tier)}
                    BottomRight={compareToPowerCore?.power_core_id === powerCore.id && <SvgView fill={colors.neonBlue} />}
                    onClick={() =>
                        setCompareToPowerCore({
                            power_core_id: power_core.id,
                            power_core: power_core,
                        })
                    }
                    renderTooltip={() => <PowerCoreTooltip id={powerCore.id} />}
                    onUnequip={() =>
                        modifyPowerCore({
                            power_core_id: "",
                            unequip: true,
                        })
                    }
                    shape="square"
                    size="small"
                />
            )
        }

        return (
            <MechLoadoutItem
                ref={powerCoreItemRef}
                disabled={loadoutDisabled}
                label="POWER CORE"
                Icon={SvgLoadoutPowerCore}
                shape="square"
                size="small"
                isEmpty
            />
        )
    }, [compareToPowerCore, loadoutDisabled, modifyPowerCore, power_core])

    const mechSkinSlot = useMemo(() => {
        const mechSkin = chassis_skin

        if (mechSkin) {
            return (
                <MechLoadoutItem
                    ref={mechSkinItemRef}
                    locked={chassis_skin?.locked_to_mech}
                    disabled={loadoutDisabled}
                    imageUrl={mechSkin.swatch_images?.image_url || mechSkin.swatch_images?.avatar_url || mechSkin.image_url || mechSkin.avatar_url}
                    label={mechSkin.label}
                    Icon={SvgLoadoutSkin}
                    rarity={getRarityDeets(mechSkin.tier)}
                    shape="square"
                    size="small"
                />
            )
        }

        return (
            <MechLoadoutItem ref={mechSkinItemRef} disabled={loadoutDisabled} label="SKIN" Icon={SvgLoadoutSkin} shape="square" size="small" isEmpty locked />
        )
    }, [chassis_skin, loadoutDisabled])

    const draggables = useMemo(
        () =>
            userID === owner_id ? (
                <MechLoadoutDraggables
                    draggablesRef={draggablesRef}
                    compareToWeapon={compareToWeapon?.weapon}
                    excludeWeaponIDs={(() => {
                        const result: string[] = []
                        for (const ew of weapons_map.values()) {
                            if (!ew) continue
                            result.push(ew.id)
                        }
                        return result
                    })()}
                    excludeMechSkinIDs={chassis_skin ? [chassis_skin.blueprint_id] : []}
                    includeMechSkinIDs={compatible_blueprint_mech_skin_ids}
                    mechModelID={mechDetails.blueprint_id}
                    compareToPowerCore={compareToPowerCore?.power_core}
                    powerCoreSize={currLoadout.power_core_size}
                    excludePowerCoreIDs={power_core?.id ? [power_core.id] : []}
                    drag={{
                        onDrag: onItemDrag,
                        onDragStart: onItemDragStart,
                        onDragStop: onItemDragStop,
                    }}
                    onClick={onItemClick}
                />
            ) : undefined,
        [
            chassis_skin,
            compareToPowerCore?.power_core,
            compareToWeapon?.weapon,
            compatible_blueprint_mech_skin_ids,
            currLoadout.power_core_size,
            mechDetails.blueprint_id,
            onItemClick,
            onItemDrag,
            onItemDragStart,
            onItemDragStop,
            owner_id,
            power_core?.id,
            userID,
            weapons_map,
        ],
    )

    return (
        <Stack
            direction="row"
            spacing="1rem"
            sx={{
                flex: 1,
                position: "relative",
                height: "100%",
            }}
        >
            <Stack flex={1}>
                {/* Viewer Actions */}
                <Stack
                    sx={{
                        position: "relative",
                        alignSelf: "end",
                    }}
                >
                    <NiceBoxThing
                        border={{
                            color: theme.factionTheme.primary,
                            thickness: "thicc",
                        }}
                        background={{
                            colors: [theme.factionTheme.u800],
                        }}
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            transform: "translateY(-100%)",
                            display: "flex",
                            borderBottom: "none",
                        }}
                    >
                        <Box p="1rem">{!enable3DLoadout ? <Svg3DView /> : <Svg2DView />}</Box>
                        <Divider
                            orientation="vertical"
                            color={colors.darkGrey}
                            sx={{
                                height: "auto",
                            }}
                        />
                        <Button
                            sx={{
                                borderRadius: 0,
                                whiteSpace: "nowrap",
                            }}
                            onClick={enable3DLoadout ? switchTo2DView : switchTo3DView}
                        >
                            <Typography
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                    fontSize: "1.6rem",
                                }}
                            >
                                Switch to {enable3DLoadout ? "2D" : "3D"} View
                            </Typography>
                        </Button>
                    </NiceBoxThing>
                </Stack>
                <NiceBoxThing
                    flex={1}
                    border={{
                        color: theme.factionTheme.primary,
                        thickness: "thicc",
                    }}
                    background={{
                        colors: [theme.factionTheme.u800],
                    }}
                >
                    {/* Saving Changes */}
                    <Box
                        sx={{
                            zIndex: 7,
                            position: "absolute",
                            right: 0,
                            bottom: 0,
                        }}
                    >
                        <Slide direction="up" in={loading || !!error} mountOnEnter unmountOnExit>
                            <ClipThing
                                clipSize="10px"
                                border={{
                                    borderColor: theme.factionTheme.primary,
                                    borderThickness: ".3rem",
                                }}
                                backgroundColor={theme.factionTheme.u800}
                                corners={{
                                    topRight: !(enable3DLoadout && isUnityLoaded),
                                }}
                            >
                                <Stack direction="row" alignItems="end" p="1rem">
                                    {error ? (
                                        <Typography
                                            sx={{
                                                color: colors.red,
                                            }}
                                        >
                                            {error}
                                        </Typography>
                                    ) : (
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.nostromoBlack,
                                                fontSize: "2rem",
                                            }}
                                        >
                                            Saving Changes
                                        </Typography>
                                    )}
                                </Stack>
                            </ClipThing>
                        </Slide>
                    </Box>
                    {/* Mech Viewer */}
                    {enable3DLoadout ? (
                        <MechViewer3D
                            mech={currLoadout}
                            unity={{
                                unityRef: unityControlsRef,
                                orbitControlsRef: orbitControlsRef,
                                onUnlock: () => {
                                    setIsUnityPendingChange(false)
                                },
                                onLock: () => {
                                    setIsUnityPendingChange(true)
                                },
                                onReady: () => {
                                    setIsUnityLoaded(true)
                                },
                            }}
                        />
                    ) : (
                        <MechViewer
                            mechDetails={{
                                ...mechDetails,
                                chassis_skin: mechDetails.chassis_skin,
                            }}
                            fillContainer
                        />
                    )}
                    {/* Drag and Drop Overlay */}
                    <Fade in={isDragging} unmountOnExit>
                        <Box
                            sx={{
                                zIndex: 4,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: `${colors.black2}aa`,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: fonts.nostromoBlack,
                                    fontSize: "3rem",
                                    textTransform: "uppercase",
                                }}
                            >
                                Drag loadout item to a valid slot
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Main Loadout */}
                    <Box
                        ref={orbitControlsRef}
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            overflow: "hidden",
                            zIndex: 6,
                        }}
                    >
                        {/* Top Left Side */}
                        <Stack
                            spacing="2rem"
                            sx={{
                                position: "absolute",
                                top: "3rem",
                                left: "3rem",
                            }}
                        >
                            {renderWeaponSlot(0)}
                            {mech_type === MechTypeEnum.Platform && renderWeaponSlot(1)}
                        </Stack>

                        {/* Top Right Side */}
                        <Stack
                            spacing="2rem"
                            sx={{
                                position: "absolute",
                                top: "3rem",
                                right: "3rem",
                                alignItems: "end",
                            }}
                        >
                            {mech_type === MechTypeEnum.Humanoid && renderWeaponSlot(1, "right")}
                            {mech_type === MechTypeEnum.Platform && (
                                <>
                                    {renderWeaponSlot(3, "right")}
                                    {renderWeaponSlot(2, "right")}
                                </>
                            )}
                        </Stack>

                        {/* Bottom Left Side */}
                        <Stack
                            direction="row"
                            spacing="2rem"
                            sx={{
                                position: "absolute",
                                bottom: "3rem",
                                left: "3rem",
                            }}
                        >
                            {powerCoreSlot}
                            {mechSkinSlot}
                        </Stack>

                        {/* Bottom Right Side */}
                        <Stack
                            direction="row"
                            spacing="2rem"
                            sx={{
                                position: "absolute",
                                bottom: "3rem",
                                right: "3rem",
                            }}
                        >
                            {intro_animation ? (
                                <MechLoadoutItem
                                    imageUrl={intro_animation.image_url || intro_animation.avatar_url}
                                    label={intro_animation.label}
                                    Icon={SvgLoadoutEmote}
                                    shape="square"
                                    size="small"
                                    side="right"
                                />
                            ) : (
                                <MechLoadoutItem
                                    label="INTRO ANIMATION"
                                    onClick={() => console.log("AAAAA")}
                                    Icon={SvgLoadoutEmote}
                                    shape="square"
                                    size="small"
                                    side="right"
                                    isEmpty
                                    disabled
                                />
                            )}

                            {outro_animation ? (
                                <MechLoadoutItem
                                    imageUrl={outro_animation.image_url || outro_animation.avatar_url}
                                    label={outro_animation.label}
                                    Icon={SvgLoadoutEmote}
                                    shape="square"
                                    size="small"
                                    side="right"
                                />
                            ) : (
                                <MechLoadoutItem
                                    label="OUTRO ANIMATION"
                                    onClick={() => console.log("AAAAA")}
                                    Icon={SvgLoadoutEmote}
                                    shape="square"
                                    size="small"
                                    side="right"
                                    isEmpty
                                    disabled
                                />
                            )}
                        </Stack>
                    </Box>
                </NiceBoxThing>
            </Stack>
            {draggables}
        </Stack>
    )
}

const checkDOMRectOverlap = (rect1: DOMRect, rect2: DOMRect, give?: number) => {
    const realGive = give || 0
    return !(
        rect1.right - realGive < rect2.left ||
        rect1.left + realGive > rect2.right ||
        rect1.bottom - realGive < rect2.top ||
        rect1.top + realGive > rect2.bottom
    )
}
