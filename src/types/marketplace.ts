import { snakeToSlug, snakeToTitle } from "../helpers"

export enum ItemType {
    WarMachine = "WAR_MACHINE",
    Keycards = "KEY_CARDS",
    MysteryCrate = "MYSTERY_CRATE",
}

export enum SaleType {
    Buyout = "BUYOUT",
    Auction = "AUCTION",
    AuctionOrBuyout = "AUCTION_OR_BUYOUT",
    DutchAuction = "DUTCH_AUCTION",
}

export enum SortType {
    OldestFirst = "Oldest first",
    NewestFirst = "Newest first",
    Alphabetical = "Ascending",
    AlphabeticalReverse = "Descending",
}

export interface MarketplaceBuyItem {
    id: string
    item_id: string
    buyout_price: string
    created_at: Date
    end_at: Date
    owner?: {
        username: string
        gid: number
        public_address: string
        faction_id: string
    }
    keycard?: {
        id: string
        label: string
        image_url: string
        animation_url: string
        description: string
        collection: string
        keycard_token_id: string
        keycard_group: string
        syndicate: string
        created_at: Date
    }
}

export interface MarketUser {
    username: string
    gid: number
    public_address: string
    faction_id: string
}

export interface MarketCrate {
    id: string
    label: string
    description: string
}

export interface MarketplaceBuyAuctionItem {
    id: string
    item_id: string
    auction: boolean
    auction_current_price: string
    auction_reserved_price: string
    dutch_auction: boolean
    dutch_auction_drop_rate: string
    buyout: boolean
    buyout_price: string
    faction_id: string
    created_at: Date
    end_at: Date
    total_bids: number
    last_bid?: MarketUser
    owner?: MarketUser
    collection_item?: {
        tier: string
        image_url?: string
        animation_url?: string
        card_animation_url?: string
        avatar_url?: string
        large_image_url?: string
    }
    mech?: {
        id: string
        name: string
        label: string
        avatar_url: string
    }
    mystery_crate?: MarketCrate
}

// TODO: remove
export const ItemTypeInfo = Object.values(ItemType).map((t) => {
    return {
        name: t,
        slug: snakeToSlug(t),
        label: snakeToTitle(t),
    }
})
