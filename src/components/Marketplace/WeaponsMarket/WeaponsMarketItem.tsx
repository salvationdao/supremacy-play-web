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

    const { avatar_url, image_url, large_image_url } = weapon

    return (
        <MarketItem item={item} imageUrl={image_url || large_image_url || avatar_url} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
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
