import { useState } from "react"
import { useTheme } from "../../../containers/theme"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
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
    const [weaponDetails, setWeaponDetails] = useState<Weapon>()

    useGameServerSubscriptionFaction<Weapon>(
        {
            URI: `/weapon/${item.weapon?.id}/details`,
            key: GameServerKeys.GetWeaponDetails,
            ready: !!item.weapon,
        },
        (payload) => {
            if (!payload) return
            setWeaponDetails(payload)
        },
    )

    const { weapon, collection_item } = item

    if (!weapon || !collection_item) return null

    return (
        <MarketItem item={item} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Weapons}>
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
