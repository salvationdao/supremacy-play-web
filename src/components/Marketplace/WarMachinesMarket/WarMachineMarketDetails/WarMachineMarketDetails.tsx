export const WarMachineMarketDetails = ({ itemID }: { itemID: string }) => {
    // const confirmBuyCloseHandler = async (confirmBuy: boolean) => {
    //     if (!targetBuyItem) return
    //     if (!confirmBuy) {
    //         setTargetBuyItem(null)
    //         return
    //     }

    //     try {
    //         await send<{ total: number; records: MarketplaceMechItem[] }>(GameServerKeys.MarketplaceSalesBuy, {
    //             item_id: targetBuyItem.id,
    //         })
    //         setTargetBuyItem(null)
    //         setBuyError(null)
    //         listQuery()
    //     } catch (err) {
    //         setBuyError(err as string)
    //     }
    // }

    return <div>{itemID}</div>
}
