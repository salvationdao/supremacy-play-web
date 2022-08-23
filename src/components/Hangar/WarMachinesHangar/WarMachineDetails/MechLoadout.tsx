import { Box, Fade, Slide, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgUtilities, SvgWeapons } from "../../../../assets"
import { useGlobalNotifications } from "../../../../containers"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { MechDetails, PowerCore, Utility, Weapon } from "../../../../types"
import { FancyButton } from "../../../Common/FancyButton"
import { MechLoadoutItem } from "../Common/MechLoadoutItem"
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
    weapons_map: Map<number, Weapon> // Map<slot_number, Weapon>
    changed_weapons_map: Map<number, Weapon>
    utility_map: Map<number, Utility> // Map<slot_number, utility>
    changed_utility_map: Map<number, Utility>
    changed_power_core?: PowerCore
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

const generateLoadout = (newMechDetails: MechDetails): MechDetailsWithMaps => ({
    ...newMechDetails,
    weapons_map: new Map(
        (newMechDetails.weapons ? newMechDetails.weapons.sort((w1, w2) => (w1.slot_number || 0) - (w2.slot_number || 0)) : []).map((w, index) => [
            w.slot_number != null ? w.slot_number : index,
            w,
        ]),
    ),
    changed_weapons_map: new Map(),
    utility_map: new Map(
        (newMechDetails.utility ? newMechDetails.utility.sort((u1, u2) => (u1.slot_number || 0) - (u2.slot_number || 0)) : []).map((u, index) => [
            u.slot_number != null ? u.slot_number : index,
            u,
        ]),
    ),
    changed_utility_map: new Map(),
})

export const MechLoadout = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const { send } = useGameServerCommandsUser("/user_commander")
    const { newSnackbarMessage } = useGlobalNotifications()

    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [currLoadout, setCurrLoadout] = useState<MechDetailsWithMaps>(generateLoadout(mechDetails))

    // Track if changes have been made
    useEffect(() => {
        setHasUnsavedChanges(currLoadout.changed_weapons_map.size > 0 || currLoadout.changed_utility_map.size > 0 || !!currLoadout.changed_power_core)
    }, [currLoadout.changed_weapons_map.size, currLoadout.changed_utility_map.size, currLoadout.changed_power_core])

    // Confirm selection and submit payload to server
    const saveSelection = useCallback(async () => {
        try {
            setLoading(true)

            const newMechDetails = await send<MechDetails, PlayerAssetMechEquipRequest>(GameServerKeys.EquipMech, {
                mech_id: mechDetails.id,
                equip_mech_skin: undefined,
                equip_power_core: undefined,
                equip_utility: Array.from(currLoadout.changed_utility_map, ([slotNumber, u]) => ({
                    utility_id: u.id,
                    slot_number: slotNumber,
                })),
                equip_weapons: Array.from(currLoadout.changed_weapons_map, ([slotNumber, w]) => ({
                    weapon_id: w.id,
                    slot_number: slotNumber,
                    inherit_skin: false,
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
    }, [currLoadout, mechDetails.id, newSnackbarMessage, send])

    const addWeaponSelection = useCallback((ew: LoadoutWeapon) => {
        setCurrLoadout((prev) => {
            const updated = new Map(prev.changed_weapons_map)
            updated.set(ew.slot_number, ew.weapon)

            return {
                ...prev,
                changed_weapons_map: updated,
            }
        })
    }, [])

    const addUtilitySelection = useCallback((eu: LoadoutUtility) => {
        setCurrLoadout((prev) => {
            const updated = new Map(prev.changed_utility_map)
            updated.set(eu.slot_number, eu.utility)

            return {
                ...prev,
                changed_utility_map: updated,
            }
        })
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

    const {
        weapon_hardpoints,
        weapons_map,
        changed_weapons_map,
        utility_slots,
        utility_map,
        changed_utility_map,
        power_core,
        blueprint_weapon_ids_with_skin_inheritance,
        chassis_skin,
        intro_animation,
        outro_animation,
    } = currLoadout

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
                    <Stack>
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
                {power_core ? (
                    <MechLoadoutItem
                        imageUrl={power_core.image_url || power_core.avatar_url}
                        videoUrls={[power_core.card_animation_url]}
                        label={power_core.label}
                        primaryColor={colors.powerCore}
                        Icon={SvgPowerCore}
                        renderModal={(toggleShowLoadoutModal) => <MechLoadoutPowerCoreModal onClose={() => toggleShowLoadoutModal(false)} />}
                    />
                ) : (
                    <MechLoadoutItem label="POWER CORE" primaryColor={colors.powerCore} onClick={() => console.log("AAAAA")} isEmpty disabled />
                )}

                {Array.from(weapons_map, ([slotNumber, w]) => {
                    const weapon = changed_weapons_map.get(slotNumber) || w

                    return (
                        <MechLoadoutItem
                            key={weapon.id}
                            slotNumber={slotNumber}
                            imageUrl={weapon.image_url || weapon.avatar_url}
                            videoUrls={[weapon.card_animation_url]}
                            label={weapon.label}
                            primaryColor={colors.weapons}
                            Icon={SvgWeapons}
                            rarity={weapon.weapon_skin ? getRarityDeets(weapon.weapon_skin.tier) : undefined}
                            hasSkin={!!weapon.weapon_skin}
                            renderModal={(toggleShowLoadoutModal) => (
                                <MechLoadoutWeaponModal
                                    onClose={() => toggleShowLoadoutModal(false)}
                                    onConfirm={(selectedWeapon, inheritSkin) =>
                                        addWeaponSelection({
                                            weapon: selectedWeapon,
                                            weapon_id: selectedWeapon.id,
                                            slot_number: slotNumber,
                                            inherit_skin: inheritSkin,
                                        })
                                    }
                                    equipped={weapon}
                                    weaponsWithSkinInheritance={blueprint_weapon_ids_with_skin_inheritance}
                                    weaponsAlreadyEquippedInOtherSlots={Array.from(changed_weapons_map.values(), (w) => w.id)}
                                />
                            )}
                            prevEquipped={(() => {
                                if (!changed_weapons_map.has(slotNumber)) return

                                const previouslyEquipped = weapons_map.get(slotNumber)
                                if (!previouslyEquipped) return

                                return {
                                    slotNumber,
                                    imageUrl: previouslyEquipped.image_url,
                                    videoUrls: [previouslyEquipped.card_animation_url],
                                    label: previouslyEquipped.label,
                                    primaryColor: colors.weapons,
                                    Icon: SvgWeapons,
                                    rarity: previouslyEquipped.weapon_skin ? getRarityDeets(previouslyEquipped.weapon_skin?.tier || "") : undefined,
                                    hasSkin: !!previouslyEquipped.weapon_skin,
                                    onClick: () => undoWeaponSelection(slotNumber),
                                }
                            })()}
                            locked={weapon.locked_to_mech}
                        />
                    )
                })}

                {weapon_hardpoints &&
                    weapon_hardpoints - weapons_map.size > 0 &&
                    new Array(weapon_hardpoints - weapons_map.size)
                        .fill(0)
                        .map((_, index) => (
                            <MechLoadoutItem key={index} label="WEAPON" primaryColor={colors.weapons} onClick={() => console.log("AAAAA")} isEmpty disabled />
                        ))}

                {Array.from(utility_map, ([slotNumber, u]) => {
                    const utility = changed_utility_map.get(slotNumber) || u

                    return (
                        <MechLoadoutItem
                            key={utility.id}
                            slotNumber={slotNumber}
                            imageUrl={utility.image_url || utility.avatar_url}
                            videoUrls={[utility.card_animation_url]}
                            label={utility.label}
                            primaryColor={colors.utilities}
                            Icon={SvgUtilities}
                            rarity={getRarityDeets(utility.tier)}
                            renderModal={(toggleShowLoadoutModal) => (
                                <MechLoadoutUtilityModal
                                    onClose={() => toggleShowLoadoutModal(false)}
                                    onConfirm={(selectedUtility) =>
                                        addUtilitySelection({
                                            utility: selectedUtility,
                                            utility_id: selectedUtility.id,
                                            slot_number: slotNumber,
                                        })
                                    }
                                    equipped={utility}
                                    utilitiesAlreadyEquippedInOtherSlots={Array.from(changed_utility_map.values(), (u) => u.id)}
                                />
                            )}
                            prevEquipped={(() => {
                                if (!changed_utility_map.has(slotNumber)) return

                                const previouslyEquipped = utility_map.get(slotNumber)
                                if (!previouslyEquipped) return

                                return {
                                    slotNumber,
                                    imageUrl: previouslyEquipped.image_url,
                                    videoUrls: [previouslyEquipped.card_animation_url],
                                    label: previouslyEquipped.label,
                                    primaryColor: colors.utilities,
                                    Icon: SvgUtilities,
                                    rarity: getRarityDeets(previouslyEquipped.tier),
                                    onClick: () => undoWeaponSelection(slotNumber),
                                }
                            })()}
                            locked={utility.locked_to_mech}
                        />
                    )
                })}

                {utility_slots &&
                    utility_slots - utility_map.size &&
                    new Array(utility_slots - utility_map.size)
                        .fill(0)
                        .map((_, index) => (
                            <MechLoadoutItem
                                key={index}
                                label="UTILITY"
                                primaryColor={colors.utilities}
                                onClick={() => console.log("AAAAA")}
                                isEmpty
                                disabled
                            />
                        ))}
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
                {chassis_skin ? (
                    <MechLoadoutItem
                        imageUrl={chassis_skin.image_url || chassis_skin.avatar_url}
                        videoUrls={[chassis_skin.card_animation_url]}
                        label={chassis_skin.label}
                        primaryColor={colors.chassisSkin}
                        rarity={getRarityDeets(chassis_skin.tier)}
                        hasSkin
                    />
                ) : (
                    <MechLoadoutItem label="SUBMODEL" primaryColor={colors.chassisSkin} onClick={() => console.log("AAAAA")} isEmpty disabled />
                )}

                {intro_animation ? (
                    <MechLoadoutItem
                        imageUrl={intro_animation.image_url || intro_animation.avatar_url}
                        videoUrls={[intro_animation.card_animation_url]}
                        label={intro_animation.label}
                        primaryColor={colors.introAnimation}
                        Icon={SvgIntroAnimation}
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
                    />
                ) : (
                    <MechLoadoutItem label="OUTRO ANIMATION" primaryColor={colors.outroAnimation} onClick={() => console.log("AAAAA")} isEmpty disabled />
                )}
            </Stack>
        </Box>
    )
}
