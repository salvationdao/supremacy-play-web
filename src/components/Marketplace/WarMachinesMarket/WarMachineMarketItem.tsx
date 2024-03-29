import { useTheme } from "@mui/material"
import { useState } from "react"
import { useGameServerSubscriptionFaction } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { MechDetails } from "../../../types"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { MechCommonArea } from "../../Hangar/Deprecated/HangarItemDeprecated"
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
        <MarketItem item={item} isGridView={isGridView} linkSubPath={"mechs"}>
            <MechCommonArea
                primaryColor={theme.factionTheme.primary}
                secondaryColor={theme.factionTheme.text}
                isGridView={isGridView}
                mechDetails={mechDetails}
                isExpanded={isExpanded}
                toggleIsExpanded={toggleIsExpanded}
                label={mech.label}
            />
        </MarketItem>
    )
}
