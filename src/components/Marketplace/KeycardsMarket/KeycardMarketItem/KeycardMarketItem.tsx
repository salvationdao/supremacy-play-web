import { MARKETPLACE_TABS } from "../../../../pages"
import { MarketplaceBuyAuctionItem } from "../../../../types/marketplace"
import { MarketItem } from "../../Common/MarketItem/MarketItem"
import { KeycardInfo } from "./KeycardInfo"

interface KeycardMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const KeycardMarketItem = ({ item, isGridView }: KeycardMarketItemProps) => {
    const { keycard } = item

    if (!keycard) return null

    const { label, image_url, animation_url, description } = keycard

    return (
        <MarketItem item={item} imageUrl={image_url} animationUrl={animation_url} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.Keycards}>
            <KeycardInfo isGridView={isGridView} label={label} description={description} />
        </MarketItem>
    )
}
