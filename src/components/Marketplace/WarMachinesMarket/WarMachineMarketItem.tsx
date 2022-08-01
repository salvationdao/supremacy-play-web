import { useTheme } from "@mui/material"
import { useState } from "react"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MARKETPLACE_TABS } from "../../../pages"
import { MechDetails } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MechCommonArea } from "../../Hangar/WarMachinesHangar/WarMachineHangarItem"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface WarMachineMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
    isExpanded: boolean
    toggleIsExpanded: (value?: boolean) => void
}

export const WarMachineMarketItem = ({ item, isGridView, isExpanded, toggleIsExpanded }: WarMachineMarketItemProps) => {
    const theme = useTheme()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useGameServerSubscriptionFaction<MechDetails>(
        {
            URI: `/mech/${item.mech?.id}/details`,
            key: GameServerKeys.GetMechDetails,
            ready: !!item.mech,
        },
        (payload) => {
            if (!payload) return
            setMechDetails(payload)
        },
    )

    const { mech, collection_item } = item

    if (!mech || !collection_item) return null

    return (
        <MarketItem item={item} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.WarMachines}>
            <MechCommonArea
                primaryColor={theme.factionTheme.primary}
                secondaryColor={theme.factionTheme.secondary}
                isGridView={isGridView}
                mechDetails={mechDetails}
                isExpanded={isExpanded}
                toggleIsExpanded={toggleIsExpanded}
                label={mech.label}
            />
        </MarketItem>
    )
}
