import { Box, Button, Divider, Fade, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Svg2DView, Svg3DView, SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgWeapons } from "../../../../../assets"
import { useAuth, useGlobalNotifications } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { getRarityDeets } from "../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { AssetItemType, MechDetails, MechSkin, MechStatus, MechStatusEnum, MechTypeEnum, PowerCore, Utility, Weapon, WeaponType } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { MechLoadoutItem } from "../../Common/MechLoadoutItem"
import { MechViewer } from "../MechViewer/MechViewer"
import { MechViewer3D } from "../MechViewer/MechViewer3D"
import { UnityHandle } from "../MechViewer/UnityViewer"
import { MechLoadoutMechSkinModal } from "../Modals/Loadout/MechLoadoutMechSkinModal"
import { MechLoadoutPowerCoreModal } from "../Modals/Loadout/MechLoadoutPowerCoreModal"
import { MechLoadoutWeaponModal } from "../Modals/Loadout/MechLoadoutWeaponModal"
import { CustomDragEventWithType, DraggablesHandle, DragStartEventWithType, DragStopEventWithType, MechLoadoutDraggables } from "./MechLoadoutDraggables"

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
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechDetails: MechDetails
    mechStatus?: MechStatus
    onUpdate: (newMechDetails: MechDetails) => void
}

const LOCAL_STORAGE_KEY_PREFERS_2D_LOADOUT = "prefers2DLoadout"

export const MechLoadout = ({ drawerContainerRef, mechDetails, mechStatus, onUpdate }: MechLoadoutProps) => {
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
    const [enable3DLoadout, setEnable3DLoadout] = useState(localStorage.getItem(LOCAL_STORAGE_KEY_PREFERS_2D_LOADOUT) !== "true")
    const unityControlsRef = useRef<UnityHandle>(null)
    const orbitControlsRef = useRef<HTMLDivElement>(null)

    const {
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
        mech_type,
        inherit_all_weapon_skins,
    } = currLoadout
    const loadoutDisabled = useMemo(
        () =>
            userID !== owner_id ||
            (enable3DLoadout && (isUnityPendingChange || !isUnityLoaded)) ||
            xsyn_locked ||
            locked_to_marketplace ||
            (mechStatus?.battle_lobby_is_locked && mechStatus?.status === MechStatusEnum.Queue) ||
            mechStatus?.status === MechStatusEnum.Battle ||
            mechStatus?.status === MechStatusEnum.Sold,
        [
            enable3DLoadout,
            isUnityLoaded,
            isUnityPendingChange,
            locked_to_marketplace,
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

            setCurrLoadout((prev) => {
                return {
                    ...prev,
                    chassis_skin: ems.mech_skin,
                }
            })
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

            setCurrLoadout((prev) => {
                let updated: PowerCore | undefined = ep.power_core
                if (ep.unequip) {
                    updated = undefined
                } else if (ep.power_core) {
                    updated = ep.power_core
                }
                return {
                    ...prev,
                    power_core: updated,
                }
            })
            saveSelection({
                equip_power_core: ep
                    ? {
                          power_core_id: ep.power_core_id,
                          unequip: ep.unequip,
                      }
                    : undefined,
            })
        },
        [saveSelection],
    )
    const modifyWeaponSlot = useCallback(
        (ew: LoadoutWeapon) => {
            if (unityControlsRef.current) {
                unityControlsRef.current.handleWeaponUpdate(ew)
            }

            // Don't inherit weapon skin if incompatible with mech
            if (ew.inherit_skin && !blueprint_weapon_ids_with_skin_inheritance.find((s) => s === ew.weapon?.blueprint_id)) {
                ew.inherit_skin = false
            }

            setCurrLoadout((prev) => {
                const updated = new Map(prev.weapons_map)
                if (ew.unequip) {
                    updated.set(ew.slot_number, null)
                } else if (ew.weapon) {
                    updated.set(ew.slot_number, {
                        ...ew.weapon,
                        inherit_skin: !!ew.inherit_skin,
                    })
                }

                return {
                    ...prev,
                    weapons_map: updated,
                }
            })

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
    const inheritAllWeaponSkinsMemo = useRef<boolean | undefined>(undefined)
    useEffect(() => {
        if (typeof inheritAllWeaponSkinsMemo.current === "undefined") return
        if (inherit_all_weapon_skins === inheritAllWeaponSkinsMemo.current) return
        if (inherit_all_weapon_skins) {
            inheritAllWeaponSkins()
        } else {
            uninheritAllWeaponSkins()
        }
        inheritAllWeaponSkinsMemo.current = inherit_all_weapon_skins
    }, [inheritAllWeaponSkins, inherit_all_weapon_skins, uninheritAllWeaponSkins])

    // DRAG HANDLERS
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
            }
        },
        [chassis_skin?.locked_to_mech, loadoutDisabled, weapons_map],
    )
    const onItemDragStart = useCallback<DragStartEventWithType>(
        (type) => {
            if (loadoutDisabled) return
            setIsDragging(true)

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
                    if (!mechSkinItemRef.current) return
                    if (chassis_skin?.locked_to_mech) return

                    mechSkinItemRef.current.style.filter = `grayscale(80%)`
                    break
                case AssetItemType.MechSkin:
                    if (!mechSkinItemRef.current) return
                    if (chassis_skin?.locked_to_mech) return

                    mechSkinItemRef.current.style.filter = `drop-shadow(0 0 1rem ${colors.chassisSkin})`

                    for (const kv of weaponItemRefs.current.entries()) {
                        const slotNumber = kv[0]
                        const element = kv[1]
                        if (!element) continue
                        if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                        element.style.filter = `grayscale(80%)`
                    }
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
                                inherit_skin: false,
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
            }

            for (const kv of weaponItemRefs.current.entries()) {
                const slotNumber = kv[0]
                const element = kv[1]
                if (!element) continue
                if (weapons_map.get(slotNumber)?.locked_to_mech) continue

                element.style.filter = "none"
            }

            if (!mechSkinItemRef.current) return
            if (chassis_skin?.locked_to_mech) return
            mechSkinItemRef.current.style.filter = "none"

            setIsDragging(false)
        },
        [chassis_skin?.locked_to_mech, loadoutDisabled, modifyMechSkin, modifyWeaponSlot, weapons_map],
    )

    // 2D/3D VIEW SWITCHERS
    const switchTo2DView = async () => {
        if (!unityControlsRef.current) return
        await unityControlsRef.current.handleUnload()
        setEnable3DLoadout(false)
        setIsUnityLoaded(false)
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFERS_2D_LOADOUT, "true")
    }
    const switchTo3DView = async () => {
        setEnable3DLoadout(true)
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFERS_2D_LOADOUT, "false")
    }

    // LOADOUT ITEM RENDERERS
    const renderWeaponSlot = useCallback(
        (slotNumber: number) => {
            const weapon = weapons_map.get(slotNumber)
            if (typeof weapon === "undefined") return

            const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                <MechLoadoutWeaponModal
                    containerRef={drawerContainerRef}
                    onClose={() => toggleShowLoadoutModal(false)}
                    onConfirm={(selectedWeapon) => {
                        modifyWeaponSlot({
                            weapon: selectedWeapon,
                            weapon_id: selectedWeapon.id,
                            slot_number: slotNumber,
                            inherit_skin: inherit_all_weapon_skins,
                        })
                        toggleShowLoadoutModal(false)
                    }}
                    equipped={weapon || undefined}
                    weaponsWithSkinInheritance={blueprint_weapon_ids_with_skin_inheritance}
                    weaponsAlreadyEquippedInOtherSlots={(() => {
                        const result: string[] = []
                        for (const ew of weapons_map.values()) {
                            if (!ew) continue
                            result.push(ew.id)
                        }
                        return result
                    })()}
                />
            )

            if (weapon) {
                return (
                    <MechLoadoutItem
                        ref={(r) => weaponItemRefs.current.set(slotNumber, r)}
                        disabled={loadoutDisabled}
                        key={weapon.id}
                        slotNumber={slotNumber}
                        imageUrl={weapon.image_url || weapon.avatar_url}
                        label={weapon.label}
                        subLabel={weapon.weapon_type}
                        Icon={SvgWeapons}
                        TopRight={
                            <Stack>
                                <Typography
                                    sx={{
                                        fontFamily: fonts.shareTech,
                                    }}
                                >
                                    {weapon.damage}
                                </Typography>
                            </Stack>
                        }
                        rarity={weapon.weapon_skin ? getRarityDeets(weapon.weapon_skin.tier) : undefined}
                        renderModal={renderModal}
                        locked={weapon.locked_to_mech}
                        onUnequip={() =>
                            modifyWeaponSlot({
                                weapon_id: "",
                                slot_number: slotNumber,
                                unequip: true,
                            })
                        }
                    />
                )
            }

            return (
                <MechLoadoutItem
                    ref={(r) => weaponItemRefs.current.set(slotNumber, r)}
                    disabled={loadoutDisabled}
                    key={slotNumber}
                    slotNumber={slotNumber}
                    label="WEAPON"
                    renderModal={renderModal}
                    Icon={SvgWeapons}
                    isEmpty
                />
            )
        },
        [blueprint_weapon_ids_with_skin_inheritance, drawerContainerRef, inherit_all_weapon_skins, loadoutDisabled, modifyWeaponSlot, weapons_map],
    )

    const renderPowerCoreSlot = useCallback(() => {
        const powerCore = power_core

        const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
            <MechLoadoutPowerCoreModal
                containerRef={drawerContainerRef}
                onClose={() => toggleShowLoadoutModal(false)}
                onConfirm={(selectedPowerCore) => {
                    modifyPowerCore({
                        power_core: selectedPowerCore,
                        power_core_id: selectedPowerCore.id,
                    })
                    toggleShowLoadoutModal(false)
                }}
                equipped={powerCore}
                powerCoresAlreadyEquippedInOtherSlots={powerCore ? [powerCore.id] : []}
                powerCoreSize={currLoadout.power_core_size}
            />
        )

        if (powerCore) {
            return (
                <MechLoadoutItem
                    disabled={loadoutDisabled}
                    imageUrl={powerCore.image_url || powerCore.avatar_url}
                    label={powerCore.label}
                    Icon={SvgPowerCore}
                    rarity={getRarityDeets(powerCore.tier)}
                    renderModal={renderModal}
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
            <MechLoadoutItem disabled={loadoutDisabled} label="POWER CORE" renderModal={renderModal} Icon={SvgPowerCore} shape="square" size="small" isEmpty />
        )
    }, [currLoadout.power_core_size, drawerContainerRef, loadoutDisabled, modifyPowerCore, power_core])

    const renderMechSkinSlot = useCallback(() => {
        const mechSkin = chassis_skin

        const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
            <MechLoadoutMechSkinModal
                onClose={() => toggleShowLoadoutModal(false)}
                onConfirm={(selectedMechSkin) => {
                    modifyMechSkin({
                        mech_skin: selectedMechSkin,
                        mech_skin_id: selectedMechSkin.id,
                    })
                    toggleShowLoadoutModal(false)
                }}
                mech={mechDetails}
                equipped={mechSkin}
                mechSkinsAlreadyEquippedInOtherSlots={chassis_skin ? [chassis_skin.id] : []}
                compatibleMechSkins={compatible_blueprint_mech_skin_ids}
            />
        )

        if (mechSkin) {
            return (
                <MechLoadoutItem
                    ref={mechSkinItemRef}
                    side="right"
                    locked={chassis_skin?.locked_to_mech}
                    disabled={loadoutDisabled}
                    imageUrl={mechSkin.swatch_images?.image_url || mechSkin.swatch_images?.avatar_url || mechSkin.image_url || mechSkin.avatar_url}
                    label={mechSkin.label}
                    Icon={SvgSkin}
                    rarity={getRarityDeets(mechSkin.tier)}
                    renderModal={renderModal}
                    shape="square"
                    size="small"
                />
            )
        }

        return (
            <MechLoadoutItem
                ref={mechSkinItemRef}
                disabled={loadoutDisabled}
                label="SUBMODEL"
                renderModal={renderModal}
                Icon={SvgSkin}
                shape="square"
                size="small"
                isEmpty
                locked
            />
        )
    }, [chassis_skin, compatible_blueprint_mech_skin_ids, loadoutDisabled, mechDetails, modifyMechSkin])

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
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ flex: 1, height: "100%" }}
            >
                {/* Viewer Actions */}
                <Stack
                    sx={{
                        zIndex: 7,
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <ClipThing
                        clipSize="10px"
                        border={{
                            borderColor: theme.factionTheme.primary,
                            borderThickness: ".3rem",
                        }}
                        backgroundColor={theme.factionTheme.background}
                        corners={{
                            topRight: !(enable3DLoadout && isUnityLoaded),
                        }}
                    >
                        <Stack direction="row">
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
                                }}
                                onClick={enable3DLoadout ? switchTo2DView : switchTo3DView}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                        fontSize: "2rem",
                                    }}
                                >
                                    Switch to {enable3DLoadout ? "2D" : "3D"} View
                                </Typography>
                            </Button>
                        </Stack>
                    </ClipThing>
                </Stack>
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
                            backgroundColor={theme.factionTheme.background}
                            corners={{
                                topRight: !(enable3DLoadout && isUnityLoaded),
                            }}
                        >
                            <Stack direction="row" alignItems="end" p="1rem">
                                {
                                    <Fade in={!!error} mountOnEnter unmountOnExit>
                                        <Typography
                                            sx={{
                                                color: colors.red,
                                            }}
                                        >
                                            {error}
                                        </Typography>
                                    </Fade>
                                }
                                <Typography
                                    sx={{
                                        fontFamily: fonts.nostromoBlack,
                                        fontSize: "2rem",
                                    }}
                                >
                                    Saving Changes
                                </Typography>
                            </Stack>
                        </ClipThing>
                    </Slide>
                </Box>
                {/* Mech Viewer */}
                {enable3DLoadout ? (
                    <MechViewer3D
                        initialMech={currLoadout}
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
                    />
                )}
                {/* Drag and Drop Overlay */}
                <Fade in={isDragging} unmountOnExit>
                    <Box
                        sx={{
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
                        sx={{
                            position: "absolute",
                            top: "3rem",
                            right: "3rem",
                        }}
                    >
                        {mech_type === MechTypeEnum.Humanoid && renderWeaponSlot(1)}
                        {mech_type === MechTypeEnum.Platform && (
                            <>
                                {renderWeaponSlot(2)}
                                {renderWeaponSlot(3)}
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
                        {renderPowerCoreSlot()}
                        {renderMechSkinSlot()}
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
                                Icon={SvgIntroAnimation}
                                side="right"
                                shape="square"
                                size="small"
                            />
                        ) : (
                            <MechLoadoutItem
                                label="INTRO ANIMATION"
                                onClick={() => console.log("AAAAA")}
                                Icon={SvgIntroAnimation}
                                shape="square"
                                size="small"
                                isEmpty
                                disabled
                            />
                        )}

                        {outro_animation ? (
                            <MechLoadoutItem
                                imageUrl={outro_animation.image_url || outro_animation.avatar_url}
                                label={outro_animation.label}
                                Icon={SvgOutroAnimation}
                                side="right"
                                shape="square"
                                size="small"
                            />
                        ) : (
                            <MechLoadoutItem
                                label="OUTRO ANIMATION"
                                onClick={() => console.log("AAAAA")}
                                Icon={SvgOutroAnimation}
                                shape="square"
                                size="small"
                                isEmpty
                                disabled
                            />
                        )}
                    </Stack>
                </Box>
            </ClipThing>
            <MechLoadoutDraggables
                draggablesRef={draggablesRef}
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
                onDrag={onItemDrag}
                onDragStart={onItemDragStart}
                onDragStop={onItemDragStop}
                onMechSkinClick={(ms) => {
                    if (loadoutDisabled) return
                    modifyMechSkin({
                        mech_skin: ms,
                        mech_skin_id: ms.id,
                    })
                }}
            />
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
