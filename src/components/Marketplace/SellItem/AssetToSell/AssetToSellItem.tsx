import { Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { KeycardPNG, SafePNG } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser, useGameServerSubscriptionFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { Keycard, MechDetails, MysteryCrate, Weapon } from "../../../../types"
import { ItemType } from "../../../../types/marketplace"
import { KeycardCommonArea } from "../../../Hangar/KeycardsHangar/KeycardHangarItem"
import { CrateCommonArea } from "../../../Hangar/MysteryCratesHangar/MysteryCrateHangarItem"
import { MechCommonArea } from "../../../Hangar/WarMachinesHangar/WarMachineHangarItem"
import { WeaponCommonArea } from "../../../Hangar/WeaponsHangar/WeaponHangarItem"
import { AssetToSellStruct } from "../SellItem"

export const AssetToSellItem = ({
    itemType,
    assetToSell,
    onClick,
    orientation,
}: {
    itemType: ItemType
    assetToSell: AssetToSellStruct
    onClick?: () => void
    orientation?: "horizontal" | "vertical"
}) => {
    const theme = useTheme()
    const { send: sendUser } = useGameServerCommandsUser("/user_commander")
    // Additional fetched data
    const [mechDetails, setMechDetails] = useState<MechDetails>()
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()
    const [mysteryCrate, setMysteryCrate] = useState<MysteryCrate>()
    const [keycard, setKeycard] = useState<Keycard>()

    // Get addition mech data
    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${assetToSell.id}/details`,
            key: GameServerKeys.GetMechDetails,
            ready: itemType === ItemType.WarMachine,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    // Get additional weapon data
    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${assetToSell.id}/details`,
            key: GameServerKeys.GetWeaponDetails,
            ready: itemType === ItemType.Weapon,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
        },
    )

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

    const commonArea = useMemo(() => {
        if (itemType === ItemType.WarMachine) {
            return (
                <MechCommonArea
                    primaryColor={theme.factionTheme.primary}
                    secondaryColor={theme.factionTheme.secondary}
                    isGridView={orientation === "vertical"}
                    mech={assetToSell.mech}
                    mechDetails={mechDetails}
                />
            )
        }

        if (itemType === ItemType.Weapon) {
            return (
                <WeaponCommonArea
                    primaryColor={theme.factionTheme.primary}
                    secondaryColor={theme.factionTheme.secondary}
                    isGridView={orientation === "vertical"}
                    weapon={assetToSell.weapon}
                    weaponDetails={weaponDetails}
                />
            )
        }

        if (itemType === ItemType.MysteryCrate) {
            const imageUrl = mysteryCrate?.image_url || assetToSell.mysteryCrate?.image_url || SafePNG
            const animationUrl = mysteryCrate?.animation_url || assetToSell.mysteryCrate?.animation_url
            const cardAnimationUrl = mysteryCrate?.card_animation_url || assetToSell.mysteryCrate?.card_animation_url

            return (
                <CrateCommonArea
                    isGridView={orientation === "vertical"}
                    label={mysteryCrate?.label || assetToSell.mysteryCrate?.label || "Mystery Crate"}
                    description={mysteryCrate?.description || assetToSell.mysteryCrate?.description || ""}
                    imageUrl={imageUrl}
                    videoUrls={[animationUrl, cardAnimationUrl]}
                />
            )
        }

        if (itemType === ItemType.Keycards) {
            const avatarUrl = assetToSell.keycard?.blueprints.image_url || keycard?.blueprints.image_url || KeycardPNG
            const ImageUrl = assetToSell.keycard?.blueprints.image_url || keycard?.blueprints.image_url || KeycardPNG
            const animationUrl = assetToSell.keycard?.blueprints.animation_url || keycard?.blueprints.animation_url
            const cardAnimationUrl = assetToSell.keycard?.blueprints.card_animation_url || keycard?.blueprints.card_animation_url

            return (
                <KeycardCommonArea
                    isGridView={orientation === "vertical"}
                    label={assetToSell.keycard?.blueprints.label || keycard?.blueprints.label || "Keycard"}
                    description={assetToSell.keycard?.blueprints.description || keycard?.blueprints.description || ""}
                    imageUrl={avatarUrl || ImageUrl}
                    videoUrls={[animationUrl, cardAnimationUrl]}
                />
            )
        }

        return null
    }, [
        assetToSell.keycard?.blueprints.animation_url,
        assetToSell.keycard?.blueprints.card_animation_url,
        assetToSell.keycard?.blueprints.description,
        assetToSell.keycard?.blueprints.image_url,
        assetToSell.keycard?.blueprints.label,
        assetToSell.mech,
        assetToSell.mysteryCrate?.animation_url,
        assetToSell.mysteryCrate?.card_animation_url,
        assetToSell.mysteryCrate?.description,
        assetToSell.mysteryCrate?.image_url,
        assetToSell.mysteryCrate?.label,
        assetToSell.weapon,
        itemType,
        keycard?.blueprints.animation_url,
        keycard?.blueprints.card_animation_url,
        keycard?.blueprints.description,
        keycard?.blueprints.image_url,
        keycard?.blueprints.label,
        mechDetails,
        mysteryCrate?.animation_url,
        mysteryCrate?.card_animation_url,
        mysteryCrate?.description,
        mysteryCrate?.image_url,
        mysteryCrate?.label,
        orientation,
        theme.factionTheme.primary,
        theme.factionTheme.secondary,
        weaponDetails,
    ])

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
            {commonArea}
        </Stack>
    )
}
