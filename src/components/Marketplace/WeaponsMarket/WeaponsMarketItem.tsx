import { useEffect, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MARKETPLACE_TABS } from "../../../pages"
import { Weapon } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { WeaponCommonArea } from "../../Hangar/WeaponsHangar/WeaponHangarItem"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
    isExpanded: boolean
    toggleIsExpanded: (value?: boolean) => void
}

export const WeaponsMarketItem = ({ item, isGridView, isExpanded, toggleIsExpanded }: WarMachineMarketItemProps) => {
    const theme = useTheme()
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

    const avatarUrl = weaponDetails?.weapon_skin?.avatar_url || weaponDetails?.avatar_url || weapon.avatar_url || collection_item.avatar_url || ""
    const imageUrl = weaponDetails?.weapon_skin?.image_url || weaponDetails?.image_url || weapon.image_url || collection_item.image_url || ""
    const largeImageUrl =
        weaponDetails?.weapon_skin?.large_image_url || weaponDetails?.large_image_url || weapon.large_image_url || collection_item.large_image_url || ""

    return (
        <MarketItem item={item} imageUrl={imageUrl || largeImageUrl || avatarUrl} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
            <WeaponCommonArea
                primaryColor={theme.factionTheme.primary}
                secondaryColor={theme.factionTheme.secondary}
                isGridView={isGridView}
                weaponDetails={weaponDetails}
                isExpanded={isExpanded}
                toggleIsExpanded={toggleIsExpanded}
            />
        </MarketItem>
    )
}
