import { useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { useGameServerCommandsFaction } from "../../../hooks/useGameServer"
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
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    useEffect(() => {
        ;(async () => {
            try {
                if (!item.mech) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: item.mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (e) {
                console.error(e)
            }
        })()
    }, [item.mech, send])

    const { mech, collection_item } = item

    if (!mech || !collection_item) return null

    const skin = mechDetails ? mechDetails.chassis_skin || mechDetails.default_chassis_skin : undefined
    const largeImageUrl = skin?.large_image_url || mechDetails?.large_image_url || mech.large_image_url || collection_item.large_image_url || ""

    return (
        <MarketItem item={item} backgroundImageUrl={largeImageUrl} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.WarMachines}>
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
