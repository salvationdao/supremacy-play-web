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

export interface ItemSale {
    id: string
    end_at: string
    buyout_price: string
    owner?: {
        username: string
        public_address: string
    }
    collection?: {
        id: string
        tier: string
        image_url: string
    }
    mech?: {
        id: string
        name: string
        label: string
        image_url: string
        tier: string
        hash: string
        slug: string
        asset_type: string
        deleted_at?: string
        updated_at: string
        created_at: string
    }
}

export enum SortType {
    OldestFirst = "OLDEST_FIRST",
    NewestFirst = "NEWEST_FIRST",
    Alphabetical = "ALPHABETICAL",
    AlphabeticalReverse = "ALPHABETICAL_REVERSE",
}

// TODO: remove
export const ItemTypeInfo = Object.values(ItemType).map((t) => {
    return {
        name: t,
        slug: snakeToSlug(t),
        label: snakeToTitle(t),
    }
})
