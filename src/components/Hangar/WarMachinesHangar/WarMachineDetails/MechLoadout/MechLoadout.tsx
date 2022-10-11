import { Box, Fade, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgWeapons } from "../../../../../assets"
import { useGlobalNotifications } from "../../../../../containers"
import { useTheme } from "../../../../../containers/theme"
import { getRarityDeets } from "../../../../../helpers"
import { useGameServerCommandsUser } from "../../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../../keys"
import { colors, fonts } from "../../../../../theme/theme"
import { AssetItemType, MechDetails, MechSkin, MechStatus, MechStatusEnum, PowerCore, Utility, Weapon } from "../../../../../types"
import { ClipThing } from "../../../../Common/ClipThing"
import { FancyButton } from "../../../../Common/FancyButton"
import { MechLoadoutItem } from "../../Common/MechLoadoutItem"
import { MechViewer } from "../MechViewer/MechViewer"
import { UnityHandle } from "../MechViewer/UnityViewer"
import { MechLoadoutMechSkinModal } from "../Modals/Loadout/MechLoadoutMechSkinModal"
import { MechLoadoutPowerCoreModal } from "../Modals/Loadout/MechLoadoutPowerCoreModal"
import { MechLoadoutWeaponModal } from "../Modals/Loadout/MechLoadoutWeaponModal"
import { CustomDragEventWithType, DraggablesHandle, DragStartEventWithType, DragStopEventWithType, MechLoadoutDraggables } from "./MechLoadoutDraggables"

interface PlayerAssetMechEquipRequest {
    mech_id: string
    equip_mech_skin?: EquipMechSkin
    equip_power_core?: EquipPowerCore
    equip_utility: EquipUtility[]
    equip_weapons: EquipWeapon[]
}

interface MechDetailsWithMaps extends MechDetails {
    weapons_map: Map<number, Weapon | null> // Map<slot_number, Weapon>
    changed_weapons_map: Map<number, LoadoutWeapon>
    utility_map: Map<number, Utility | null> // Map<slot_number, Utility>
    changed_utility_map: Map<number, LoadoutUtility>
    changed_power_core?: LoadoutPowerCore
    changed_mech_skin?: LoadoutMechSkin
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
        changed_weapons_map: new Map(),
        utility_map,
        changed_utility_map: new Map(),
    }
}

interface MechLoadoutProps {
    drawerContainerRef: React.MutableRefObject<HTMLElement | undefined>
    mechDetails: MechDetails
    mechStatus?: MechStatus
    onUpdate: (newMechDetails: MechDetails) => void
}

export const MechLoadout = ({ drawerContainerRef, mechDetails, mechStatus, onUpdate }: MechLoadoutProps) => {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()
    const unityControlsRef = useRef<UnityHandle>(null)
    const orbitControlsRef = useRef<HTMLDivElement>(null)
    const draggablesRef = useRef<DraggablesHandle>(null)

    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [currLoadout, setCurrLoadout] = useState<MechDetailsWithMaps>(generateLoadout(mechDetails))
    const [isDragging, setIsDragging] = useState(false)
    const [isUnityLoaded, setIsUnityLoaded] = useState(false)
    const [isUnityPendingChange, setIsUnityPendingChange] = useState(false)

    const {
        weapons_map,
        changed_weapons_map,
        blueprint_weapon_ids_with_skin_inheritance,
        // utility_map,
        // changed_utility_map,
        power_core,
        changed_power_core,
        chassis_skin,
        changed_mech_skin,
        compatible_blueprint_mech_skin_ids,
        intro_animation,
        outro_animation,
        locked_to_marketplace,
        xsyn_locked,
    } = currLoadout
    const loadoutDisabled = useMemo(
        () =>
            isUnityPendingChange ||
            !isUnityLoaded ||
            xsyn_locked ||
            locked_to_marketplace ||
            (mechStatus?.battle_lobby_is_locked && mechStatus?.status === MechStatusEnum.Queue) ||
            mechStatus?.status === MechStatusEnum.Battle ||
            mechStatus?.status === MechStatusEnum.Sold,
        [isUnityLoaded, isUnityPendingChange, locked_to_marketplace, mechStatus?.battle_lobby_is_locked, mechStatus?.status, xsyn_locked],
    )

    useEffect(() => {
        setCurrLoadout(generateLoadout(mechDetails))
    }, [mechDetails])

    // Track if changes have been made
    useEffect(() => {
        const hasUnsaved =
            currLoadout.changed_weapons_map.size > 0 ||
            currLoadout.changed_utility_map.size > 0 ||
            !!currLoadout.changed_power_core ||
            !!currLoadout.changed_mech_skin
        setHasUnsavedChanges(hasUnsaved)
        if (!hasUnsaved) {
            setError(undefined)
        }
    }, [currLoadout.changed_weapons_map.size, currLoadout.changed_utility_map.size, currLoadout.changed_power_core, currLoadout.changed_mech_skin])

    // Confirm selection and submit payload to server
    const saveSelection = useCallback(async () => {
        try {
            setLoading(true)

            const newMechDetails = await send<MechDetails, PlayerAssetMechEquipRequest>(GameServerKeys.EquipMech, {
                mech_id: mechDetails.id,
                equip_mech_skin: currLoadout.changed_mech_skin
                    ? {
                          mech_skin_id: currLoadout.changed_mech_skin.mech_skin.id,
                      }
                    : undefined,
                equip_power_core: currLoadout.changed_power_core
                    ? {
                          power_core_id: currLoadout.changed_power_core.power_core_id,
                          unequip: currLoadout.changed_power_core.unequip,
                      }
                    : undefined,
                equip_utility: Array.from(currLoadout.changed_utility_map, ([slotNumber, u]) => ({
                    utility_id: u.utility_id,
                    slot_number: slotNumber,
                    unequip: u.unequip,
                })),
                equip_weapons: Array.from(currLoadout.changed_weapons_map, ([slotNumber, w]) => ({
                    weapon_id: w.weapon_id,
                    slot_number: slotNumber,
                    inherit_skin: w.inherit_skin,
                    unequip: w.unequip,
                })),
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
    }, [
        currLoadout.changed_mech_skin,
        currLoadout.changed_power_core,
        currLoadout.changed_utility_map,
        currLoadout.changed_weapons_map,
        mechDetails.id,
        newSnackbarMessage,
        onUpdate,
        send,
    ])

    const modifyMechSkin = useCallback((ems: LoadoutMechSkin) => {
        if (unityControlsRef.current) {
            unityControlsRef.current.handleMechSkinUpdate(ems)
            setIsUnityPendingChange(true)
        }

        setCurrLoadout((prev) => {
            return {
                ...prev,
                changed_mech_skin: ems,
            }
        })
    }, [])

    const modifyPowerCore = useCallback((ep: LoadoutPowerCore) => {
        setCurrLoadout((prev) => {
            let updated: LoadoutPowerCore | undefined = ep
            if (ep.unequip && !prev.power_core) {
                updated = undefined
            }
            return {
                ...prev,
                changed_power_core: updated,
            }
        })
    }, [])

    const modifyWeaponSlot = useCallback((ew: LoadoutWeapon) => {
        if (unityControlsRef.current) {
            unityControlsRef.current.handleWeaponUpdate(ew)
            setIsUnityPendingChange(true)
        }

        setCurrLoadout((prev) => {
            const updated = new Map(prev.changed_weapons_map)
            if (ew.unequip && !prev.weapons_map.get(ew.slot_number)) {
                updated.delete(ew.slot_number)
            } else {
                updated.set(ew.slot_number, ew)
            }

            return {
                ...prev,
                changed_weapons_map: updated,
            }
        })
    }, [])

    const undoMechSkinChanges = useCallback(() => {
        if (unityControlsRef.current && currLoadout.chassis_skin) {
            const prevMechSkin = currLoadout.chassis_skin
            unityControlsRef.current.handleMechSkinUpdate({
                mech_skin_id: prevMechSkin.id,
                mech_skin: prevMechSkin,
            })
            setIsUnityPendingChange(true)
        }

        setCurrLoadout((prev) => ({ ...prev, changed_mech_skin: undefined }))
    }, [currLoadout.chassis_skin])

    const undoPowerCoreChanges = useCallback(() => {
        setCurrLoadout((prev) => ({ ...prev, changed_power_core: undefined }))
    }, [])

    const undoWeaponChanges = useCallback(
        (slotNumber: number) => {
            if (unityControlsRef.current) {
                const prevWeapon = currLoadout.weapons_map.get(slotNumber)
                unityControlsRef.current.handleWeaponUpdate(
                    prevWeapon
                        ? {
                              weapon_id: prevWeapon.id,
                              slot_number: slotNumber,
                              weapon: prevWeapon,
                          }
                        : {
                              weapon_id: "",
                              slot_number: slotNumber,
                              unequip: true,
                          },
                )
                setIsUnityPendingChange(true)
            }

            setCurrLoadout((prev) => {
                const updated = prev.changed_weapons_map
                updated.delete(slotNumber)

                return {
                    ...prev,
                    changed_weapons_map: updated,
                }
            })
        },
        [currLoadout.weapons_map],
    )

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
                {/* Unity View */}
                <MechViewer
                    mechDetails={mechDetails}
                    unity={{
                        unityRef: unityControlsRef,
                        orbitControlsRef: orbitControlsRef,
                        onUnlock: () => {
                            setIsUnityPendingChange(false)
                        },
                        onReady: () => {
                            setIsUnityLoaded(true)
                        },
                    }}
                />
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
                    {/* Save Changes Button */}
                    <Box
                        sx={{
                            zIndex: 1,
                            position: "absolute",
                            right: "6rem",
                            bottom: "5rem",
                        }}
                    >
                        <Slide direction="up" in={hasUnsavedChanges} mountOnEnter unmountOnExit>
                            <Stack direction="row" alignItems="end">
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
                                <FancyButton
                                    sx={{ px: "1.6rem", py: ".6rem" }}
                                    clipThingsProps={{
                                        backgroundColor: colors.green,
                                    }}
                                    onClick={() => saveSelection()}
                                    loading={loading}
                                    disabled={isUnityPendingChange}
                                >
                                    <Typography variant="h6">Save Changes</Typography>
                                </FancyButton>
                            </Stack>
                        </Slide>
                    </Box>
                    {/* Left side */}
                    <Stack
                        flexWrap="wrap"
                        sx={{
                            position: "absolute",
                            top: "5rem",
                            bottom: "5rem",
                            left: "6rem",
                        }}
                    >
                        {(() => {
                            let powerCore = power_core
                            const changed = changed_power_core
                            if (changed) {
                                if (changed.unequip) {
                                    powerCore = undefined
                                } else if (changed.power_core) {
                                    powerCore = changed.power_core
                                }
                            }

                            const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                                <MechLoadoutPowerCoreModal
                                    onClose={() => toggleShowLoadoutModal(false)}
                                    onConfirm={(selectedPowerCore) => {
                                        modifyPowerCore({
                                            power_core: selectedPowerCore,
                                            power_core_id: selectedPowerCore.id,
                                        })
                                        toggleShowLoadoutModal(false)
                                    }}
                                    equipped={powerCore}
                                    powerCoresAlreadyEquippedInOtherSlots={changed_power_core?.power_core ? [changed_power_core.power_core.id] : []}
                                />
                            )

                            const prevEquipped = () => {
                                if (!changed_power_core) return

                                const previouslyEquipped = power_core
                                if (!previouslyEquipped) return

                                return {
                                    imageUrl: previouslyEquipped.image_url || previouslyEquipped.avatar_url,
                                    videoUrls: [previouslyEquipped.card_animation_url],
                                    label: previouslyEquipped.label,
                                    primaryColor: colors.powerCore,
                                    Icon: SvgPowerCore,
                                    rarity: getRarityDeets(previouslyEquipped.tier),
                                    onClick: () => undoPowerCoreChanges(),
                                    disabled: loadoutDisabled,
                                }
                            }

                            if (powerCore) {
                                return (
                                    <MechLoadoutItem
                                        locked
                                        disabled={loadoutDisabled}
                                        imageUrl={powerCore.image_url || powerCore.avatar_url}
                                        videoUrls={[powerCore.card_animation_url]}
                                        label={powerCore.label}
                                        primaryColor={colors.powerCore}
                                        Icon={SvgPowerCore}
                                        rarity={getRarityDeets(powerCore.tier)}
                                        renderModal={renderModal}
                                        prevEquipped={prevEquipped()}
                                        onUnequip={() =>
                                            modifyPowerCore({
                                                power_core_id: "",
                                                unequip: true,
                                            })
                                        }
                                    />
                                )
                            }

                            return (
                                <MechLoadoutItem
                                    disabled={loadoutDisabled}
                                    label="POWER CORE"
                                    primaryColor={colors.powerCore}
                                    renderModal={renderModal}
                                    prevEquipped={prevEquipped()}
                                    isEmpty
                                    locked
                                />
                            )
                        })()}

                        {Array.from(weapons_map, ([slotNumber, w]) => {
                            let weapon = w
                            const changed = changed_weapons_map.get(slotNumber)
                            if (changed) {
                                if (changed.unequip) {
                                    weapon = null
                                } else if (changed.weapon) {
                                    weapon = changed.weapon
                                }
                            }

                            const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                                <MechLoadoutWeaponModal
                                    containerRef={drawerContainerRef}
                                    onClose={() => toggleShowLoadoutModal(false)}
                                    onConfirm={(selectedWeapon, inheritSkin) => {
                                        modifyWeaponSlot({
                                            weapon: selectedWeapon,
                                            weapon_id: selectedWeapon.id,
                                            slot_number: slotNumber,
                                            inherit_skin: inheritSkin,
                                        })
                                        toggleShowLoadoutModal(false)
                                    }}
                                    equipped={weapon || undefined}
                                    weaponsWithSkinInheritance={blueprint_weapon_ids_with_skin_inheritance}
                                    weaponsAlreadyEquippedInOtherSlots={Array.from(changed_weapons_map.values(), (w) => w.weapon_id).filter((w) => !!w)}
                                />
                            )

                            const prevEquipped = () => {
                                if (!changed_weapons_map.has(slotNumber)) return

                                const previouslyEquipped = weapons_map.get(slotNumber)
                                if (!previouslyEquipped) return

                                return {
                                    slotNumber,
                                    imageUrl: previouslyEquipped.image_url || previouslyEquipped.avatar_url,
                                    videoUrls: [previouslyEquipped.card_animation_url],
                                    label: previouslyEquipped.label,
                                    primaryColor: colors.weapons,
                                    Icon: SvgWeapons,
                                    rarity: previouslyEquipped.weapon_skin ? getRarityDeets(previouslyEquipped.weapon_skin.tier) : undefined,
                                    hasSkin: !!previouslyEquipped.weapon_skin,
                                    onClick: () => undoWeaponChanges(slotNumber),
                                    disabled: loadoutDisabled,
                                }
                            }

                            if (weapon) {
                                return (
                                    <MechLoadoutItem
                                        ref={(r) => weaponItemRefs.current.set(slotNumber, r)}
                                        disabled={loadoutDisabled}
                                        key={weapon.id}
                                        slotNumber={slotNumber}
                                        imageUrl={weapon.image_url || weapon.avatar_url}
                                        videoUrls={[weapon.card_animation_url]}
                                        label={weapon.label}
                                        primaryColor={colors.weapons}
                                        Icon={SvgWeapons}
                                        rarity={weapon.weapon_skin ? getRarityDeets(weapon.weapon_skin.tier) : undefined}
                                        hasSkin={!!weapon.weapon_skin}
                                        renderModal={renderModal}
                                        prevEquipped={prevEquipped()}
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
                                    primaryColor={colors.weapons}
                                    renderModal={renderModal}
                                    prevEquipped={prevEquipped()}
                                    isEmpty
                                />
                            )
                        })}
                    </Stack>

                    {/* Right side */}
                    <Stack
                        flexWrap="wrap"
                        sx={{
                            position: "absolute",
                            top: "5rem",
                            bottom: "5rem",
                            right: "6rem",
                        }}
                        alignItems="end"
                    >
                        {(() => {
                            const mechSkin = changed_mech_skin?.mech_skin || chassis_skin

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
                                    mechSkinsAlreadyEquippedInOtherSlots={
                                        changed_mech_skin?.mech_skin ? [changed_mech_skin.mech_skin.id] : chassis_skin ? [chassis_skin.id] : []
                                    }
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
                                        imageUrl={
                                            mechSkin.swatch_images?.image_url || mechSkin.swatch_images?.avatar_url || mechSkin.image_url || mechSkin.avatar_url
                                        }
                                        label={mechSkin.label}
                                        primaryColor={colors.chassisSkin}
                                        Icon={SvgSkin}
                                        rarity={getRarityDeets(mechSkin.tier)}
                                        renderModal={renderModal}
                                        prevEquipped={(() => {
                                            if (!changed_mech_skin) return

                                            const previouslyEquipped = chassis_skin
                                            if (!previouslyEquipped) return

                                            return {
                                                imageUrl:
                                                    previouslyEquipped.swatch_images?.image_url ||
                                                    previouslyEquipped.swatch_images?.avatar_url ||
                                                    previouslyEquipped.image_url ||
                                                    previouslyEquipped.avatar_url,
                                                label: previouslyEquipped.label,
                                                primaryColor: colors.powerCore,
                                                Icon: SvgPowerCore,
                                                rarity: getRarityDeets(previouslyEquipped.tier),
                                                onClick: () => undoMechSkinChanges(),
                                                disabled: loadoutDisabled,
                                            }
                                        })()}
                                    />
                                )
                            }

                            return (
                                <MechLoadoutItem
                                    ref={mechSkinItemRef}
                                    disabled={loadoutDisabled}
                                    label="SUBMODEL"
                                    primaryColor={colors.chassisSkin}
                                    renderModal={renderModal}
                                    isEmpty
                                    locked
                                />
                            )
                        })()}

                        {intro_animation ? (
                            <MechLoadoutItem
                                imageUrl={intro_animation.image_url || intro_animation.avatar_url}
                                videoUrls={[intro_animation.card_animation_url]}
                                label={intro_animation.label}
                                primaryColor={colors.introAnimation}
                                Icon={SvgIntroAnimation}
                                side="right"
                            />
                        ) : (
                            <MechLoadoutItem
                                label="INTRO ANIMATION"
                                primaryColor={colors.introAnimation}
                                onClick={() => console.log("AAAAA")}
                                isEmpty
                                disabled
                            />
                        )}

                        {outro_animation ? (
                            <MechLoadoutItem
                                imageUrl={outro_animation.image_url || outro_animation.avatar_url}
                                videoUrls={[outro_animation.card_animation_url]}
                                label={outro_animation.label}
                                primaryColor={colors.outroAnimation}
                                Icon={SvgOutroAnimation}
                                side="right"
                            />
                        ) : (
                            <MechLoadoutItem
                                label="OUTRO ANIMATION"
                                primaryColor={colors.outroAnimation}
                                onClick={() => console.log("AAAAA")}
                                isEmpty
                                disabled
                            />
                        )}
                    </Stack>
                </Box>
            </ClipThing>
            <MechLoadoutDraggables
                draggablesRef={draggablesRef}
                excludeWeaponIDs={Array.from(changed_weapons_map.values(), (w) => w.weapon_id)}
                includeMechSkinIDs={compatible_blueprint_mech_skin_ids}
                onDrag={onItemDrag}
                onDragStart={onItemDragStart}
                onDragStop={onItemDragStop}
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
