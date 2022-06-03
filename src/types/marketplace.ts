import { snakeToSlug, snakeToTitle } from "../helpers"

export enum ItemType {
    WarMachine = "WAR_MACHINE",
    KeyCards = "KEY_CARDS",
    Abilities = "ABILITIES",
}

export enum SaleType {
    Buyout = "BUYOUT",
    Auction = "AUCTION",
    DutchAuction = "DUTCH_AUCTION",
}

export enum SortType {
    OldestFirst = "OLDEST_FIRST",
    NewestFirst = "NEWEST_FIRST",
    Alphabetical = "ALPHABETICAL",
    AlphabeticalReverse = "ALPHABETICAL_REVERSE",
}

export interface MarketplaceMechItem {
    id: string
    item_id: string
    buyout: boolean
    auction: boolean
    end_at: Date
    buyout_price: string
    auction_price: string
    owner?: {
        username: string
        gid: number
        public_address: string
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
