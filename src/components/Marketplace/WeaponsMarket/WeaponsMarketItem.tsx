import { useEffect, useState } from "react"
import { useToggle } from "../../../hooks"
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
}

export const WeaponsMarketItem = ({ item, isGridView }: WarMachineMarketItemProps) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()
    const [isExpanded, toggleIsExpanded] = useToggle(false)

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

    const { avatar_url, image_url, large_image_url } = weapon

    return (
        <MarketItem item={item} imageUrl={image_url || large_image_url || avatar_url} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
            <WeaponCommonArea isGridView={isGridView} weaponDetails={weaponDetails} isExpanded={isExpanded} toggleIsExpanded={toggleIsExpanded} />
        </MarketItem>
    )
}
