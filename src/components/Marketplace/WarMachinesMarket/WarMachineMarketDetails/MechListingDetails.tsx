import { MarketplaceMechItem } from "../../../../types/marketplace"

export const MechListingDetails = ({ marketItem }: { marketItem: MarketplaceMechItem }) => {
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

    const { buyout, auction, end_at, buyout_price, auction_price, owner, mech } = marketItem

    if (!owner || !mech) return null

    const { username, gid } = owner
    const { name, label, tier, avatar_url } = mech

    return null
}
