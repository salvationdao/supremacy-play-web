import { useCallback, useEffect, useState } from "react"
import { useGameServerCommandsFaction } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { MechDetails } from "../../../../types"
import { MarketplaceMechItem } from "../../../../types/marketplace"

export const WarMachineMarketDetails = ({ id }: { id: string }) => {
    const { send } = useGameServerCommandsFaction("/faction_commander")
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()
    const [marketItem, setMarketItem] = useState<MarketplaceMechItem>()
    const [mechDetails, setMechDetails] = useState<MechDetails>()

    // Get listing details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<MarketplaceMechItem>(GameServerKeys.MarketplaceSalesGet, {
                    id,
                })

                if (!resp) return
                setMarketItem(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get listing details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [id, send])

    // Get mech details
    useEffect(() => {
        ;(async () => {
            try {
                if (!marketItem || !marketItem.mech?.id) return
                const resp = await send<MechDetails>(GameServerKeys.GetMechDetails, {
                    mech_id: marketItem.mech.id,
                })

                if (!resp) return
                setMechDetails(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to get war machine details."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [marketItem, send])

    // const confirmBuyCloseHandler = useCallback(async () => {
    //     try {
    //         await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesBuy, {
    //             item_id: targetBuyItem.id,
    //         })
    //         setBuyError(null)
    //         listQuery()
    //     } catch (err) {
    //         setBuyError(err as string)
    //     }
    // },[])

    return <div>{id}</div>
}
