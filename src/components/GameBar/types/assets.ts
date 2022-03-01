export interface AssetDurability {
    hash: string
    startedAt: Date
    expectCompletedAt: Date
    repairType: "FAST" | "STANDARD" | ""
}

// position = undefined	 	// currently not queuing
// position = -1        	// currently in game
// position >= 0         	// current queuing position
export interface AssetQueueStat {
    position?: number
    contractReward?: string
}

export interface Asset {
    hash: string
    userID: string
    username: string
    name: string
    game_object?: any
    description: string
    externalURL: string
    image: string
    animation_url: string
    attributes: Attribute[]
    additional_metadata?: any
    createdAt: Date
    updatedAt: Date
    frozenAt?: Date
    lockedByID?: string
    deletedAt?: Date
    mintingSignature?: string
    txHistory: any[]
}

export interface Attribute {
    display_type?: "number"
    trait_type: string
    token_id?: number
    value: string | number
}
