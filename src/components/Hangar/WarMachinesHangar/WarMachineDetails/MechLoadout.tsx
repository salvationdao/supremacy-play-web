import { Box, Fade, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { MechDetails, MechSkin, MechStatus, MechStatusEnum, PowerCore, Utility, Weapon } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"
import { MechLoadoutItem } from "../Common/MechLoadoutItem"
import { MechLoadoutMechSkinModal } from "./Modals/Loadout/MechLoadoutMechSkinModal"
import { MechLoadoutPowerCoreModal } from "./Modals/Loadout/MechLoadoutPowerCoreModal"
import { MechLoadoutUtilityModal } from "./Modals/Loadout/MechLoadoutUtilityModal"
import { MechLoadoutWeaponModal } from "./Modals/Loadout/MechLoadoutWeaponModal"

interface PlayerAssetMechEquipRequest {
    mech_id: string
    equip_mech_skin?: string
    equip_power_core?: string
    equip_utility: EquipUtility[]
    equip_weapons: EquipWeapon[]
}

interface MechDetailsWithMaps extends MechDetails {
    weapons_map: Map<number, Weapon | null> // Map<slot_number, Weapon>
    changed_weapons_map: Map<number, LoadoutWeapon>
    utility_map: Map<number, Utility | null> // Map<slot_number, Utility>
    changed_utility_map: Map<number, LoadoutUtility>
    changed_power_core?: PowerCore
    changed_mech_skin?: MechSkin
}

interface EquipMechSkin {
    mech_skin_id: string
}

type LoadoutMechSkin = EquipMechSkin & {
    mech_skin: MechSkin
}

interface EquipPowerCore {
    power_core_id: string
}

type LoadoutPowerCore = EquipPowerCore & {
    power_core: PowerCore
}

interface EquipWeapon {
    weapon_id: string
    slot_number: number
    inherit_skin: boolean
}

type LoadoutWeapon = EquipWeapon & {
    weapon: Weapon
}

interface EquipUtility {
    utility_id: string
    slot_number: number
}

type LoadoutUtility = EquipUtility & {
    utility: Utility
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
    mechDetails: MechDetails
    mechStatus?: MechStatus
}

export const MechLoadout = ({ mechDetails, mechStatus }: MechLoadoutProps) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [currLoadout, setCurrLoadout] = useState<MechDetailsWithMaps>(generateLoadout(mechDetails))

    // Track if changes have been made
    useEffect(() => {
        setHasUnsavedChanges(
            currLoadout.changed_weapons_map.size > 0 ||
                currLoadout.changed_utility_map.size > 0 ||
                !!currLoadout.changed_power_core ||
                !!currLoadout.changed_mech_skin,
        )
    }, [currLoadout.changed_weapons_map.size, currLoadout.changed_utility_map.size, currLoadout.changed_power_core, currLoadout.changed_mech_skin])

    // Confirm selection and submit payload to server
    const saveSelection = useCallback(async () => {
        try {
            setLoading(true)

            const newMechDetails = await send<MechDetails, PlayerAssetMechEquipRequest>(GameServerKeys.EquipMech, {
                mech_id: mechDetails.id,
                equip_mech_skin: undefined,
                equip_power_core: currLoadout.changed_power_core?.id,
                equip_utility: Array.from(currLoadout.changed_utility_map, ([slotNumber, u]) => ({
                    utility_id: u.utility_id,
                    slot_number: slotNumber,
                })),
                equip_weapons: Array.from(currLoadout.changed_weapons_map, ([slotNumber, w]) => ({
                    weapon_id: w.weapon_id,
                    slot_number: slotNumber,
                    inherit_skin: w.inherit_skin,
                })),
            })

            newSnackbarMessage(`Successfully saved loadout.`, "success")
            setError(undefined)
            setCurrLoadout(generateLoadout(newMechDetails))
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            } else if (typeof e === "string") {
                setError(e)
            }
        } finally {
            setLoading(false)
        }
    }, [currLoadout.changed_power_core, currLoadout.changed_utility_map, currLoadout.changed_weapons_map, mechDetails.id, newSnackbarMessage, send])

    const addMechSkinSelection = useCallback((ep: LoadoutMechSkin) => {
        setCurrLoadout((prev) => {
            return {
                ...prev,
                changed_mech_skin: ep.mech_skin,
            }
        })
    }, [])

    const addPowerCoreSelection = useCallback((ep: LoadoutPowerCore) => {
        setCurrLoadout((prev) => {
            return {
                ...prev,
                changed_power_core: ep.power_core,
            }
        })
    }, [])

    const addWeaponSelection = useCallback((ew: LoadoutWeapon) => {
        setCurrLoadout((prev) => {
            const updated = new Map(prev.changed_weapons_map)
            updated.set(ew.slot_number, ew)

            return {
                ...prev,
                changed_weapons_map: updated,
            }
        })
    }, [])

    const addUtilitySelection = useCallback((eu: LoadoutUtility) => {
        setCurrLoadout((prev) => {
            const updated = new Map(prev.changed_utility_map)
            updated.set(eu.slot_number, eu)

            return {
                ...prev,
                changed_utility_map: updated,
            }
        })
    }, [])

    const undoMechSkinSelection = useCallback(() => {
        setCurrLoadout((prev) => ({ ...prev, changed_mech_skin: undefined }))
    }, [])

    const undoPowerCoreSelection = useCallback(() => {
        setCurrLoadout((prev) => ({ ...prev, changed_power_core: undefined }))
    }, [])

    const undoWeaponSelection = useCallback((slotNumber: number) => {
        setCurrLoadout((prev) => {
            const updated = prev.changed_weapons_map
            updated.delete(slotNumber)

            return {
                ...prev,
                changed_weapons_map: updated,
            }
        })
    }, [])

    const undoUtilitySelection = useCallback((slotNumber: number) => {
        setCurrLoadout((prev) => {
            const updated = prev.changed_utility_map
            updated.delete(slotNumber)

            return {
                ...prev,
                changed_utility_map: updated,
            }
        })
    }, [])

    const {
        weapons_map,
        changed_weapons_map,
        blueprint_weapon_ids_with_skin_inheritance,
        utility_map,
        changed_utility_map,
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
    console.log(compatible_blueprint_mech_skin_ids)

    const loadoutDisabled = useMemo(
        () =>
            xsyn_locked ||
            locked_to_marketplace ||
            mechStatus?.status === MechStatusEnum.Queue ||
            mechStatus?.status === MechStatusEnum.Battle ||
            mechStatus?.status === MechStatusEnum.Sold,
        [locked_to_marketplace, mechStatus?.status, xsyn_locked],
    )

    return (
        <Box
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
                    const powerCore = changed_power_core || power_core

                    const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                        <MechLoadoutPowerCoreModal
                            onClose={() => toggleShowLoadoutModal(false)}
                            onConfirm={(selectedPowerCore) => {
                                addPowerCoreSelection({
                                    power_core: selectedPowerCore,
                                    power_core_id: selectedPowerCore.id,
                                })
                                toggleShowLoadoutModal(false)
                            }}
                            equipped={powerCore}
                            powerCoresAlreadyEquippedInOtherSlots={changed_power_core ? [changed_power_core.id] : []}
                        />
                    )

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
                                prevEquipped={(() => {
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
                                        onClick: () => undoPowerCoreSelection(),
                                    }
                                })()}
                            />
                        )
                    }

                    return (
                        <MechLoadoutItem
                            disabled={loadoutDisabled}
                            label="POWER CORE"
                            primaryColor={colors.powerCore}
                            renderModal={renderModal}
                            isEmpty
                            locked
                        />
                    )
                })()}

                {Array.from(weapons_map, ([slotNumber, w]) => {
                    let weapon = w
                    if (changed_weapons_map.has(slotNumber)) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        weapon = changed_weapons_map.get(slotNumber)!.weapon
                    }

                    const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                        <MechLoadoutWeaponModal
                            onClose={() => toggleShowLoadoutModal(false)}
                            onConfirm={(selectedWeapon, inheritSkin) => {
                                addWeaponSelection({
                                    weapon: selectedWeapon,
                                    weapon_id: selectedWeapon.id,
                                    slot_number: slotNumber,
                                    inherit_skin: inheritSkin,
                                })
                                toggleShowLoadoutModal(false)
                            }}
                            equipped={weapon || undefined}
                            weaponsWithSkinInheritance={blueprint_weapon_ids_with_skin_inheritance}
                            weaponsAlreadyEquippedInOtherSlots={Array.from(changed_weapons_map.values(), (w) => w.weapon_id)}
                        />
                    )

                    if (weapon) {
                        return (
                            <MechLoadoutItem
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
                                prevEquipped={(() => {
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
                                        onClick: () => undoWeaponSelection(slotNumber),
                                    }
                                })()}
                                locked={weapon.locked_to_mech}
                            />
                        )
                    }

                    return (
                        <MechLoadoutItem
                            disabled={loadoutDisabled}
                            key={slotNumber}
                            slotNumber={slotNumber}
                            label="WEAPON"
                            primaryColor={colors.weapons}
                            renderModal={renderModal}
                            isEmpty
                        />
                    )
                })}

                {Array.from(utility_map, ([slotNumber, u]) => {
                    let utility = u
                    if (changed_utility_map.has(slotNumber)) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        utility = changed_utility_map.get(slotNumber)!.utility
                    }

                    const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                        <MechLoadoutUtilityModal
                            onClose={() => toggleShowLoadoutModal(false)}
                            onConfirm={(selectedUtility) => {
                                addUtilitySelection({
                                    utility: selectedUtility,
                                    utility_id: selectedUtility.id,
                                    slot_number: slotNumber,
                                })
                                toggleShowLoadoutModal(false)
                            }}
                            equipped={utility || undefined}
                            utilitiesAlreadyEquippedInOtherSlots={Array.from(changed_utility_map.values(), (u) => u.utility_id)}
                        />
                    )

                    if (utility) {
                        return (
                            <MechLoadoutItem
                                disabled={loadoutDisabled}
                                key={utility.id}
                                slotNumber={slotNumber}
                                imageUrl={utility.image_url || utility.avatar_url}
                                videoUrls={[utility.card_animation_url]}
                                label={utility.label}
                                primaryColor={colors.utilities}
                                Icon={SvgUtilities}
                                rarity={getRarityDeets(utility.tier)}
                                renderModal={renderModal}
                                prevEquipped={(() => {
                                    if (!changed_utility_map.has(slotNumber)) return

                                    const previouslyEquipped = utility_map.get(slotNumber)
                                    if (!previouslyEquipped) return

                                    return {
                                        slotNumber,
                                        imageUrl: previouslyEquipped.image_url || previouslyEquipped.avatar_url,
                                        videoUrls: [previouslyEquipped.card_animation_url],
                                        label: previouslyEquipped.label,
                                        primaryColor: colors.utilities,
                                        Icon: SvgUtilities,
                                        rarity: getRarityDeets(previouslyEquipped.tier),
                                        onClick: () => undoUtilitySelection(slotNumber),
                                    }
                                })()}
                                locked={utility.locked_to_mech}
                            />
                        )
                    }

                    return (
                        <MechLoadoutItem
                            disabled={loadoutDisabled}
                            key={slotNumber}
                            slotNumber={slotNumber}
                            label="UTILITY"
                            primaryColor={colors.utilities}
                            renderModal={renderModal}
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
            >
                {(() => {
                    const mechSkin = changed_mech_skin || chassis_skin

                    const renderModal = (toggleShowLoadoutModal: (value?: boolean | undefined) => void) => (
                        <MechLoadoutMechSkinModal
                            onClose={() => toggleShowLoadoutModal(false)}
                            onConfirm={(selectedMechSkin) => {
                                addMechSkinSelection({
                                    mech_skin: selectedMechSkin,
                                    mech_skin_id: selectedMechSkin.id,
                                })
                                toggleShowLoadoutModal(false)
                            }}
                            equipped={mechSkin}
                            mechSkinsAlreadyEquippedInOtherSlots={changed_mech_skin ? [changed_mech_skin.id] : []}
                            compatibleMechSkins={compatible_blueprint_mech_skin_ids}
                        />
                    )

                    if (mechSkin) {
                        return (
                            <MechLoadoutItem
                                side="right"
                                locked={chassis_skin?.locked_to_mech}
                                disabled={loadoutDisabled}
                                imageUrl={mechSkin.image_url || mechSkin.avatar_url}
                                videoUrls={[mechSkin.card_animation_url]}
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
                                        imageUrl: previouslyEquipped.image_url || previouslyEquipped.avatar_url,
                                        videoUrls: [previouslyEquipped.card_animation_url],
                                        label: previouslyEquipped.label,
                                        primaryColor: colors.powerCore,
                                        Icon: SvgPowerCore,
                                        rarity: getRarityDeets(previouslyEquipped.tier),
                                        onClick: () => undoMechSkinSelection(),
                                    }
                                })()}
                            />
                        )
                    }

                    return (
                        <MechLoadoutItem
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
                    <MechLoadoutItem label="INTRO ANIMATION" primaryColor={colors.introAnimation} onClick={() => console.log("AAAAA")} isEmpty disabled />
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
                    <MechLoadoutItem label="OUTRO ANIMATION" primaryColor={colors.outroAnimation} onClick={() => console.log("AAAAA")} isEmpty disabled />
                )}
            </Stack>
        </Box>
    )
}
