import { Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { getRarityDeets, getWeaponTypeColor } from "../../../helpers"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MARKETPLACE_TABS } from "../../../pages"
import { colors, fonts } from "../../../theme/theme"
import { Weapon } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const WeaponsMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useEffect(() => {
        ;(async () => {
            try {
                if (!item.weapon) return
                const resp = await send<Weapon>(GameServerKeys.GetWeaponDetails, {
                    weapon_id: item.weapon.id,
                })
                if (!resp) return
                setWeaponDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [item.weapon, send])

    const { weapon, collection_item } = item

    if (!weapon || !collection_item) return null

    const { label, weapon_type, avatar_url, image_url, large_image_url } = weapon

    return (
        <MarketItem item={item} imageUrl={image_url || large_image_url || avatar_url} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
            <WeaponInfo isGridView={isGridView} label={label} weaponType={weapon_type} weaponDetails={weaponDetails} />
        </MarketItem>
    )
}

const WeaponInfo = ({ isGridView, label, weaponType, weaponDetails }: { isGridView: boolean; label: string; weaponType: string; weaponDetails?: Weapon }) => {
    const skin = weaponDetails?.weapon_skin
    const rarityDeets = useMemo(() => getRarityDeets(skin?.tier || ""), [skin?.tier])

    return (
        <Stack spacing={isGridView ? ".1rem" : ".6rem"}>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: fonts.nostromoBlack,
                    color: getWeaponTypeColor(weaponType),
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {weaponType}
            </Typography>

            <Typography
                sx={{
                    fontWeight: "fontWeightBold",
                    display: "-webkit-box",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {label}
            </Typography>

            <Stack direction="row" spacing=".5rem">
                <Typography
                    variant="body2"
                    sx={{
                        lineHeight: 1,
                        color: colors.chassisSkin,
                        fontFamily: fonts.nostromoBold,
                        display: "-webkit-box",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    SUBMODEL:{" "}
                    {skin ? (
                        <>
                            {skin.label} <span style={{ color: rarityDeets.color }}>({rarityDeets.label})</span>
                        </>
                    ) : (
                        <span style={{ color: colors.darkGrey }}>NOT EQUIPPED</span>
                    )}
                </Typography>
            </Stack>
        </Stack>
    )
}
