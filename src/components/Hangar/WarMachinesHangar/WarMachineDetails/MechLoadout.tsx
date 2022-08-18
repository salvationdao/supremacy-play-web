import { Box, Stack } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { colors } from "../../../../theme/theme"
import { MechDetails, PowerCore, Utility, Weapon } from "../../../../types"
import { MechLoadoutItem } from "../Common/MechLoadoutItem"
import { MechLoadoutPowerCoreModal } from "./Modals/Loadout/MechLoadoutPowerCoreModal"
import { MechLoadoutWeaponModal } from "./Modals/Loadout/MechLoadoutWeaponModal"

interface LoadoutChanges {
    power_core?: PowerCore
    utility?: Utility
    weapons: LoadoutWeapon[]
}

type LoadoutWeapon = EquipWeapon & {
    weapon: Weapon
}

interface PlayerAssetMechEquipRequest {
    mech_id: string
    equip_power_core?: string
    equip_shield?: string
    equip_weapons: EquipWeapon[]
    equip_mech_skin?: string
}

interface EquipWeapon {
    weapon_id: string
    slot_number: number
    inherit_skin: boolean
}

export const MechLoadout = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const { send } = useGameServerCommandsUser("/user_commander")

    const [prevLoadout, setPrevLoadout] = useState(mechDetails)
    const [currLoadout, setCurrLoadout] = useState(mechDetails)
    const [loadoutChanges, setLoadoutChanges] = useState<LoadoutChanges>({
        weapons: [],
    })

    // const submitLoadout = () => {

    // }

    const addWeaponSelection = useCallback((ew: LoadoutWeapon) => {
        setLoadoutChanges((prev) => {
            const equippedWeapons = prev.weapons.filter((w) => w.weapon_id !== ew.weapon_id)
            equippedWeapons.push(ew)
            return {
                ...prev,
                weapons: equippedWeapons,
            }
        })
        setCurrLoadout((prev) => {
            const prevWeapons = prev.weapons
            const newWeapons = prev.weapons.map((w) => w)
            for (let i = 0; i < prevWeapons.length; i++) {
                if (prevWeapons[i].slot_number === ew.slot_number) {
                    newWeapons[i] = ew.weapon
                }
            }

            return {
                ...prev,
                weapons: newWeapons,
            }
        })
    }, [])

    const {
        weapons,
        weapon_hardpoints,
        utility_slots,
        blueprint_weapon_ids_with_skin_inheritance,
        utility,
        power_core,
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

                {weapons &&
                    weapons.length > 0 &&
                    weapons.map((w, index) => {
                        return (
                            <MechLoadoutItem
                                key={w.id}
                                imageUrl={w.image_url || w.avatar_url}
                                videoUrls={[w.card_animation_url]}
                                label={w.label}
                                primaryColor={colors.weapons}
                                Icon={SvgWeapons}
                                rarity={w.weapon_skin ? getRarityDeets(w.weapon_skin.tier) : undefined}
                                hasSkin={!!w.weapon_skin}
                                renderModal={(toggleShowLoadoutModal) => (
                                    <MechLoadoutWeaponModal
                                        onClose={() => toggleShowLoadoutModal(false)}
                                        onConfirm={(selectedWeapon, inheritSkin) =>
                                            addWeaponSelection({
                                                weapon: selectedWeapon,
                                                weapon_id: selectedWeapon.id,
                                                slot_number: w.slot_number || index,
                                                inherit_skin: inheritSkin,
                                            })
                                        }
                                        equipped={w}
                                        weaponsWithSkinInheritance={blueprint_weapon_ids_with_skin_inheritance}
                                        weaponsAlreadyEquippedInOtherSlots={loadoutChanges.weapons.map((w) => w.weapon_id)}
                                    />
                                )}
                            />
                        )
                    })}

                {weapon_hardpoints &&
                    weapons &&
                    weapon_hardpoints - weapons.length > 0 &&
                    new Array(weapon_hardpoints - weapons.length)
                        .fill(0)
                        .map((_, index) => (
                            <MechLoadoutItem key={index} label="WEAPON" primaryColor={colors.weapons} onClick={() => console.log("AAAAA")} isEmpty disabled />
                        ))}

                {utility &&
                    utility.length > 0 &&
                    utility.map((w) => {
                        return (
                            <MechLoadoutItem
                                key={w.id}
                                imageUrl={w.image_url || w.avatar_url}
                                videoUrls={[w.card_animation_url]}
                                label={w.label}
                                primaryColor={colors.utilities}
                                Icon={SvgUtilities}
                            />
                        )
                    })}

                {utility_slots &&
                    utility &&
                    utility_slots - utility.length &&
                    new Array(utility_slots - utility.length)
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
                        Icon={SvgSkin}
                        rarity={getRarityDeets(chassis_skin.tier)}
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
