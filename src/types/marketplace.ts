import { snakeToSlug, snakeToTitle } from "../helpers"

export enum ItemType {
    WarMachine = "WAR_MACHINE",
    KeyCards = "KEY_CARDS",
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

export interface MarketplaceMechItem {
    id: string
    item_id: string
    auction: boolean
    auction_current_price: string
    auction_reserved_price: string
    dutch_auction: boolean
    dutch_auction_drop_rate: string
    buyout: boolean
    buyout_price: string
    created_at: Date
    end_at: Date
    owner?: {
        username: string
        gid: number
        public_address: string
        faction_id: string
    }
    mech?: {
        id: string
        name: string
        label: string
        avatar_url: string
        tier: string
        hash: string
        slug: string
        asset_type: string
        deleted_at?: string
        updated_at: string
        created_at: string
    }
}

// TODO: remove
export const ItemTypeInfo = Object.values(ItemType).map((t) => {
    return {
        name: t,
        slug: snakeToSlug(t),
        label: snakeToTitle(t),
    }
})
