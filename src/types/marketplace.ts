import { Collection, Images } from "./assets"

export enum ItemType {
    WarMachine = "WAR_MACHINE",
    Weapon = "WEAPON",
    Keycards = "KEY_CARDS",
    MysteryCrate = "MYSTERY_CRATE",
}

export enum MarketSaleType {
    Buyout = "BUYOUT",
    Auction = "AUCTION",
    DutchAuction = "DUTCH_AUCTION",
}

export enum SortDir {
    Asc = "asc",
    Desc = "desc",
}

export enum SortTypeLabel {
    CreateTimeOldestFirst = "Create time: oldest",
    CreateTimeNewestFirst = "Create time: newly listed",
    EndTimeEndingSoon = "End time: ending soon",
    EndTimeEndingLast = "End time: ending last",
    PriceLowest = "Price: lowest first",
    PriceHighest = "Price: highest first",
    Alphabetical = "Name: ascending",
    AlphabeticalReverse = "Name: descending",
    MechQueueAsc = "Queue: lowest first",
    MechQueueDesc = "Queue: highest first",
    RarestAsc = "Rarity: least rarest",
    RarestDesc = "Rarity: most rarest",
    RewardAmountHighest = "Reward: highest first",
    RewardAmountLowest = "Reward: lowest first",
    DateAddedNewest = "Date added (newest)",
    DateAddedOldest = "Date added (oldest)",
    MostViewed = "Most viewed",
    QueuedAmountHighest = "Queued amount: highest",
    QueuedAmountLowest = "Queued amount: lowest",
    ReadyTimeOldestFirst = "Ready time: oldest",
    ReadyTimeNewestFirst = "Ready time: newly listed",
}

export interface MarketUser {
    id: string
    username: string
    gid: number
    public_address: string
    faction_id: string
}

export interface MarketKeycard extends Images {
    id: string
    label: string
    description: string
    collection: string
    keycard_token_id: string
    keycard_group: string
    syndicate: string
    created_at: Date
}

export interface MarketCrate extends Images {
    id: string
    label: string
    description: string
}

export interface MarketMech extends Images {
    id: string
    name: string
    label: string
}

export interface MarketWeapon extends Images {
    id: string
    label: string
    weapon_type: string
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
    collection_item?: Collection
    mech?: MarketMech
    keycard?: MarketKeycard
    mystery_crate?: MarketCrate
    weapon?: MarketWeapon
    sold_for?: string
    sold_at?: Date
    sold_to?: MarketUser
}

export enum MarketplaceEventType {
    // Buyer's POV
    Purchased = "purchase",
    Bid = "bid",
    BidReturned = "bid_refund",
    // Seller's POV
    Created = "created",
    Sold = "sold",
    // Common
    Cancelled = "cancelled",
}

export interface MarketplaceEvent {
    id: string
    event_type: MarketplaceEventType
    created_at: Date
    item: MarketplaceBuyAuctionItem
    amount?: string
}
