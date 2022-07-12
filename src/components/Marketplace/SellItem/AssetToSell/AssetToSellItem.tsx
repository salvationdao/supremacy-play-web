import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { KeycardPNG, SafePNG } from "../../../../assets"
import { getRarityDeets, getWeaponTypeColor } from "../../../../helpers"
import { useGameServerCommandsFaction, useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { Keycard, MechDetails, MysteryCrate, Weapon } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"
import { MediaPreview } from "../../../Common/MediaPreview/MediaPreview"
import { MechLoadoutIcons } from "../../../Hangar/WarMachinesHangar/Common/MechLoadoutIcons"
import { AssetToSellStruct } from "../SellItem"

export const AssetToSellItem = ({
    itemType,
    assetToSell,
    playVideo,
    onClick,
    orientation,
}: {
    itemType: ItemType
    assetToSell: AssetToSellStruct
    playVideo?: boolean
    onClick?: () => void
    orientation?: "horizontal" | "vertical"
}) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const { send: sendUser } = useGameServerCommandsUser("/user_commander")
    // Additional fetched data
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()
    const [mysteryCrate, setMysteryCrate] = useState<MysteryCrate>()
    const [keycard, setKeycard] = useState<Keycard>()

    // Things for render
    const [avatarUrl, setAvatarUrl] = useState<string>()
    const [imageUrl, setImageUrl] = useState<string>()
    const [animationUrl, setAnimationUrl] = useState<string>()
    const [cardAnimationUrl, setCardAnimationUrl] = useState<string>()
    const [label, setLabel] = useState<string>()
    const [weaponType, setWeaponType] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [rarityDeets, setRarityDeets] = useState<{
        label: string
        color: string
    }>()

    // Initial populate
    useEffect(() => {
        if (itemType === ItemType.WarMachine) {
            setAvatarUrl(assetToSell.mech?.avatar_url || mechDetails?.chassis_skin?.avatar_url)
            setImageUrl(assetToSell.mech?.large_image_url || mechDetails?.chassis_skin?.large_image_url)
            setAnimationUrl(assetToSell.mech?.animation_url || mechDetails?.chassis_skin?.animation_url)
            setCardAnimationUrl(assetToSell.mech?.card_animation_url || mechDetails?.chassis_skin?.card_animation_url)
            setLabel(assetToSell.mech?.name || assetToSell.mech?.label || mechDetails?.name || mechDetails?.label)
            const tier = assetToSell.mech?.tier || mechDetails?.tier
            setRarityDeets(tier ? getRarityDeets(tier) : undefined)
        } else if (itemType === ItemType.MysteryCrate) {
            setAvatarUrl(assetToSell.mysteryCrate?.image_url || mysteryCrate?.image_url || SafePNG)
            setImageUrl(assetToSell.mysteryCrate?.image_url || mysteryCrate?.image_url || SafePNG)
            setAnimationUrl(assetToSell.mysteryCrate?.animation_url || mysteryCrate?.animation_url)
            setCardAnimationUrl(assetToSell.mysteryCrate?.card_animation_url || mysteryCrate?.card_animation_url)
            setLabel(assetToSell.mysteryCrate?.label || mysteryCrate?.label)
            setDescription(assetToSell.mysteryCrate?.description || mysteryCrate?.description)
        } else if (itemType === ItemType.Weapon) {
            setAvatarUrl(assetToSell.weapon?.image_url || weaponDetails?.image_url)
            setImageUrl(assetToSell.weapon?.image_url || weaponDetails?.image_url)
            setAnimationUrl(assetToSell.weapon?.animation_url || weaponDetails?.animation_url)
            setCardAnimationUrl(assetToSell.weapon?.card_animation_url || weaponDetails?.card_animation_url)
            setLabel(assetToSell.weapon?.label)
            setWeaponType(assetToSell.weapon?.weapon_type || weaponDetails?.weapon_type)
            const tier = assetToSell.weapon?.tier || weaponDetails?.tier
            setRarityDeets(tier ? getRarityDeets(tier) : undefined)
        } else if (itemType === ItemType.Keycards) {
            setAvatarUrl(assetToSell.keycard?.blueprints.image_url || keycard?.blueprints.image_url || KeycardPNG)
            setImageUrl(assetToSell.keycard?.blueprints.image_url || keycard?.blueprints.image_url || KeycardPNG)
            setAnimationUrl(assetToSell.keycard?.blueprints.animation_url || keycard?.blueprints.animation_url)
            setCardAnimationUrl(assetToSell.keycard?.blueprints.card_animation_url || keycard?.blueprints.card_animation_url)
            setLabel(assetToSell.keycard?.blueprints.label || keycard?.blueprints.label)
            setDescription(assetToSell.keycard?.blueprints.description || keycard?.blueprints.description)
        }
    }, [assetToSell, mechDetails, weaponDetails, mysteryCrate, keycard, itemType])

    // Get addition mech data
    useEffect(() => {
        ;(async () => {
            try {
                if (itemType !== ItemType.WarMachine) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: assetToSell.id,
                })
                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [assetToSell, itemType, send])

    // Get additional weapon data
    useEffect(() => {
        ;(async () => {
            try {
                if (itemType !== ItemType.Weapon) return
                const resp = await send<Weapon>(GameServerKeys.GetWeaponDetails, {
                    weapon_id: assetToSell.id,
                })

                if (!resp) return
                setWeaponDetails(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [assetToSell, itemType, send])

    // Get additional mystery crate data
    useEffect(() => {
        ;(async () => {
            try {
                if (itemType !== ItemType.MysteryCrate) return
                const resp = await sendUser<MysteryCrate>(GameServerKeys.GetPlayerMysteryCrate, {
                    id: assetToSell.id,
                })

                if (!resp) return
                setMysteryCrate(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [assetToSell, itemType, sendUser])

    // Get additional keycard data
    useEffect(() => {
        ;(async () => {
            try {
                if (itemType !== ItemType.Keycards) return
                const resp = await sendUser<Keycard>(GameServerKeys.GetPlayerKeycard, {
                    id: assetToSell.id,
                })

                if (!resp) return
                setKeycard(resp)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [assetToSell, itemType, sendUser])

    return (
        <Stack
            direction={orientation === "horizontal" ? "row" : "column"}
            spacing="1.5rem"
            alignItems={orientation === "horizontal" ? "center" : "flex-start"}
            sx={{
                position: "relative",
                py: "1rem",
                px: "1rem",
                width: orientation === "horizontal" ? "unset" : "31rem",
                cursor: onClick ? "pointer" : "unset",
                ":hover": { backgroundColor: onClick ? "#FFFFFF15" : "unset" },
            }}
            onClick={onClick}
        >
            <Box
                sx={{
                    flexShrink: 0,
                    height: orientation === "horizontal" ? "7rem" : "28rem",
                    width: orientation === "horizontal" ? "7rem" : "100%",
                }}
            >
                <MediaPreview imageUrl={playVideo ? imageUrl : avatarUrl} {...{ videoUrls: playVideo ? [animationUrl, cardAnimationUrl] : [] }} />
            </Box>

            <Stack spacing=".3rem">
                {itemType !== ItemType.Weapon && rarityDeets && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: rarityDeets.color,
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {rarityDeets.label}
                    </Typography>
                )}

                {weaponType && (
                    <Typography variant="caption" sx={{ fontFamily: fonts.nostromoBlack, color: getWeaponTypeColor(weaponType) }}>
                        {weaponType}
                    </Typography>
                )}

                {label && (
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {label}
                    </Typography>
                )}

                {description && (
                    <Typography
                        sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            overflowWrap: "anywhere",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: orientation === "horizontal" ? 1 : 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {description}
                    </Typography>
                )}

                {weaponDetails && (
                    <Stack direction="row" spacing=".5rem" sx={{ pt: ".4rem" }}>
                        {weaponDetails?.weapon_skin && rarityDeets ? (
                            <>
                                <Typography variant="caption" sx={{ lineHeight: 1, color: colors.chassisSkin, fontFamily: fonts.nostromoBold }}>
                                    SUBMODEL: {weaponDetails?.weapon_skin.label}
                                </Typography>
                                <Typography variant="caption" sx={{ lineHeight: 1, color: rarityDeets.color, fontFamily: fonts.nostromoBold }}>
                                    ({rarityDeets.label})
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="caption" sx={{ lineHeight: 1, color: colors.chassisSkin, fontFamily: fonts.nostromoBold }}>
                                    SUBMODEL:
                                </Typography>
                                <Typography variant="caption" sx={{ lineHeight: 1, color: colors.darkGrey, fontFamily: fonts.nostromoBold }}>
                                    NOT EQUIPPED
                                </Typography>
                            </>
                        )}
                    </Stack>
                )}

                {mechDetails && (
                    <Box sx={{ pt: ".4rem" }}>
                        <MechLoadoutIcons mechDetails={mechDetails} />
                    </Box>
                )}
            </Stack>
        </Stack>
    )
}
