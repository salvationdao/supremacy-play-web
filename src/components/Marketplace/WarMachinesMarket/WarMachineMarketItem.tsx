import { Stack } from "@mui/material"
import { useMemo } from "react"
import { getRarityDeets } from "../../../helpers"
import { MarketplaceMechItem } from "../../../types/marketplace"

interface WarMachineMarketItemProps {
    item: MarketplaceMechItem
}

export const WarMachineMarketItem = ({ item }: WarMachineMarketItemProps) => {
    const rarityDeets = useMemo(() => getRarityDeets(item.collection?.tier || ""), [item.collection?.tier])

    const { end_at, buyout_price, owner, collection, mech } = item

    if (!mech || !collection || !owner) return null

    const { username, public_address } = owner
    const { tier, image_url: collectionImageUrl } = collection
    const { name, label, image_url } = mech

    // tier
    tier
    rarityDeets.label
    rarityDeets.color

    // mech
    name || label
    image_url || collectionImageUrl

    // owner
    username
    public_address

    // item
    end_at
    buyout_price

    return null
}

export const WarMachineMarketItemLoadingSkeleton = () => {
    return <Stack>Loading...</Stack>
}
