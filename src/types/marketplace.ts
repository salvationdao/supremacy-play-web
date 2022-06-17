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
    ExpiringFirst = "Time: ending soonest",
    ExpiringReverse = "Time: newly listed",
    PriceLowest = "Price: lowest first",
    PriceHighest = "Price: highest first",
    Alphabetical = "Name (ascending)",
    AlphabeticalReverse = "Name (descending)",
}

export interface MarketUser {
    id: string
    username: string
    gid: number
    public_address: string
    faction_id: string
}

export interface MarketKeycard {
    id: string
    label: string
    image_url: string
    animation_url: string
    card_animation_url: string
    description: string
    collection: string
    keycard_token_id: string
    keycard_group: string
    syndicate: string
    created_at: Date
}

export interface MarketCrate {
    id: string
    label: string
    description: string
}

export interface MarketplaceBuyAuctionItem {
    id: string
    item_id: string
    auction_current_price: string
    auction_reserved_price: string
    dutch_auction_drop_rate: string
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
    keycard?: MarketKeycard
    mystery_crate?: MarketCrate
    sold_for?: string
    sold_at?: Date
}
