import { MARKETPLACE_TABS } from "../../../pages"
import { MarketplaceBuyAuctionItem } from "../../../types/marketplace"
import { CrateCommonArea } from "../../Hangar/MysteryCratesHangar/MysteryCrateHangarItem"
import { MarketItem } from "../Common/MarketItem/MarketItem"

interface MysteryCratesMarketItemProps {
    item: MarketplaceBuyAuctionItem
    isGridView: boolean
}

export const MysteryCrateMarketItem = ({ item, isGridView }: MysteryCratesMarketItemProps) => {
    const { mystery_crate, collection_item } = item

    if (!mystery_crate || !collection_item) return null

    const { label, description, image_url, large_image_url, animation_url, card_animation_url } = mystery_crate


    return (
        <MarketItem item={item} isGridView={isGridView} linkSubPath={MARKETPLACE_TABS.MysteryCrates}>
            <CrateCommonArea
                isGridView={isGridView}
                label={label}
                description={description}
                imageUrl={image_url || large_image_url}
                videoUrls={[animation_url, card_animation_url]}
            />
        </MarketItem>
    )
}
