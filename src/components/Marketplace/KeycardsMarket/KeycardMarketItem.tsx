import { MARKETPLACE_TABS } from "../../../pages"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { KeycardCommonArea } from "../../Hangar/KeycardsHangar/KeycardHangarItem"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface KeycardMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const KeycardMarketItem = ({ item, isGridView }: KeycardMarketItemProps) => {
    const { keycard } = item

    if (!keycard) return null

    const { label, image_url, animation_url, card_animation_url, description } = keycard

    return (
        <MarketItem
            item={item}
            imageUrl={image_url}
            animationUrl={animation_url}
            cardAnimationUrl={card_animation_url}
            isGridView={isGridView}
            linkSubPath={MARKETPLACE_TABS.Keycards}
        >
            <KeycardCommonArea isGridView={isGridView} label={label} description={description} />
        </MarketItem>
    )
}
