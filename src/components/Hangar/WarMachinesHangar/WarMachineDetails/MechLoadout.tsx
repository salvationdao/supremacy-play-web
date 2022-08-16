import { Box, Stack } from "@mui/material"
import { SvgIntroAnimation, SvgOutroAnimation, SvgPowerCore, SvgSkin, SvgUtilities, SvgWeapons } from "../../../../assets"
import { getRarityDeets } from "../../../../helpers"
import { colors } from "../../../../theme/theme"
import { AssetItemType, MechDetails } from "../../../../types"
import { MechLoadoutItem } from "../Common/MechLoadoutItem"

export const MechLoadout = ({ mechDetails }: { mechDetails: MechDetails }) => {
    const weaponSlots = mechDetails.weapon_hardpoints
    const utilitySlots = mechDetails.utility_slots
    const weapons = mechDetails.weapons
    const weaponsWithSkinInheritance = mechDetails.blueprint_weapon_ids_with_skin_inheritance
    const utilities = mechDetails.utility
    const powerCore = mechDetails.power_core
    const chassisSkin = mechDetails.chassis_skin
    const introAnimation = mechDetails.intro_animation
    const outroAnimation = mechDetails.outro_animation

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
                {powerCore ? (
                    <MechLoadoutItem
                        type={AssetItemType.PowerCore}
                        imageUrl={powerCore.image_url || powerCore.avatar_url}
                        videoUrls={[powerCore.card_animation_url]}
                        label={powerCore.label}
                        primaryColor={colors.powerCore}
                        Icon={SvgPowerCore}
                    />
                ) : (
                    <MechLoadoutItem
                        type={AssetItemType.PowerCore}
                        label="POWER CORE"
                        primaryColor={colors.powerCore}
                        onClick={() => console.log("AAAAA")}
                        isEmpty
                        disabled
                    />
                )}

                {weapons &&
                    weapons.length > 0 &&
                    weapons.map((w) => {
                        return (
                            <MechLoadoutItem
                                key={w.id}
                                type={AssetItemType.Weapon}
                                weaponsWithSkinInheritance={weaponsWithSkinInheritance}
                                imageUrl={w.image_url || w.avatar_url}
                                videoUrls={[w.card_animation_url]}
                                label={w.label}
                                primaryColor={colors.weapons}
                                Icon={SvgWeapons}
                                imageTransform="rotate(-30deg) scale(.95)"
                                rarity={w.weapon_skin ? getRarityDeets(w.weapon_skin.tier) : undefined}
                                hasSkin={!!w.weapon_skin}
                            />
                        )
                    })}

                {weaponSlots &&
                    weapons &&
                    weaponSlots - weapons.length > 0 &&
                    new Array(weaponSlots - weapons.length)
                        .fill(0)
                        .map((_, index) => (
                            <MechLoadoutItem
                                type={AssetItemType.Weapon}
                                key={index}
                                label="WEAPON"
                                primaryColor={colors.weapons}
                                onClick={() => console.log("AAAAA")}
                                isEmpty
                                disabled
                            />
                        ))}

                {utilities &&
                    utilities.length > 0 &&
                    utilities.map((w) => {
                        return (
                            <MechLoadoutItem
                                key={w.id}
                                type={AssetItemType.Utility}
                                imageUrl={w.image_url || w.avatar_url}
                                videoUrls={[w.card_animation_url]}
                                label={w.label}
                                primaryColor={colors.utilities}
                                Icon={SvgUtilities}
                            />
                        )
                    })}

                {utilitySlots &&
                    utilities &&
                    utilitySlots - utilities.length &&
                    new Array(utilitySlots - utilities.length)
                        .fill(0)
                        .map((_, index) => (
                            <MechLoadoutItem
                                key={index}
                                type={AssetItemType.Utility}
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
                {chassisSkin ? (
                    <MechLoadoutItem
                        type={AssetItemType.MechSkin}
                        imageUrl={chassisSkin.image_url || chassisSkin.avatar_url}
                        videoUrls={[chassisSkin.card_animation_url]}
                        label={chassisSkin.label}
                        primaryColor={colors.chassisSkin}
                        Icon={SvgSkin}
                        rarity={getRarityDeets(chassisSkin.tier)}
                    />
                ) : (
                    <MechLoadoutItem
                        type={AssetItemType.MechSkin}
                        label="SUBMODEL"
                        primaryColor={colors.chassisSkin}
                        onClick={() => console.log("AAAAA")}
                        isEmpty
                        disabled
                    />
                )}

                {introAnimation ? (
                    <MechLoadoutItem
                        type={AssetItemType.IntroAnimation}
                        imageUrl={introAnimation.image_url || introAnimation.avatar_url}
                        videoUrls={[introAnimation.card_animation_url]}
                        label={introAnimation.label}
                        primaryColor={colors.introAnimation}
                        Icon={SvgIntroAnimation}
                    />
                ) : (
                    <MechLoadoutItem
                        type={AssetItemType.IntroAnimation}
                        label="INTRO ANIMATION"
                        primaryColor={colors.introAnimation}
                        onClick={() => console.log("AAAAA")}
                        isEmpty
                        disabled
                    />
                )}

                {outroAnimation ? (
                    <MechLoadoutItem
                        type={AssetItemType.OutroAnimation}
                        imageUrl={outroAnimation.image_url || outroAnimation.avatar_url}
                        videoUrls={[outroAnimation.card_animation_url]}
                        label={outroAnimation.label}
                        primaryColor={colors.outroAnimation}
                        Icon={SvgOutroAnimation}
                    />
                ) : (
                    <MechLoadoutItem
                        type={AssetItemType.OutroAnimation}
                        label="OUTRO ANIMATION"
                        primaryColor={colors.outroAnimation}
                        onClick={() => console.log("AAAAA")}
                        isEmpty
                        disabled
                    />
                )}
            </Stack>
        </Box>
    )
}
