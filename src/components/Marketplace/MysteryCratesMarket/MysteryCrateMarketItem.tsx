import { SafePNG } from "../../../assets"
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

    const { label, description } = mystery_crate
    const { image_url, avatar_url, large_image_url, animation_url, card_animation_url } = collection_item

    return (
        <MarketItem
            item={item}
            imageUrl={image_url || large_image_url || avatar_url || SafePNG}
            animationUrl={animation_url}
            cardAnimationUrl={card_animation_url}
            isGridView={isGridView}
            linkSubPath={MARKETPLACE_TABS.MysteryCrates}
        >
            <CrateCommonArea isGridView={isGridView} label={label} description={description} />
        </MarketItem>
    )
}
