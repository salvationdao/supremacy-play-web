import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { KeycardCommonArea } from "../../Hangar/Deprecated/HangarItemDeprecated"
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
        <MarketItem item={item} isGridView={isGridView} linkSubPath={"keycards"}>
            <KeycardCommonArea
                isGridView={isGridView}
                label={label}
                description={description}
                imageUrl={image_url}
                videoUrls={[animation_url, card_animation_url]}
            />
        </MarketItem>
    )
}
