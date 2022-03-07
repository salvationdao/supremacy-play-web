export interface AssetDurability {
    hash: string
    started_at: Date
    expect_completed_at: Date
    repair_type: "FAST" | "STANDARD" | ""
}

// position = undefined	 	// currently not queuing
// position = -1        	// currently in game
// position >= 0         	// current queuing position
export interface AssetQueueStat {
    position?: number
    contract_reward?: string
}

export interface Asset {
    hash: string
    user_id: string
    username: string
    name: string
    game_object?: any
    description: string
    external_url: string
    image: string
    animation_url: string
    attributes: Attribute[]
    additional_metadata?: any
    created_at: Date
    updated_at: Date
    frozen_at?: Date
    locked_by_id?: string
    deleted_at?: Date
    minting_signature?: string
    tx_history: any[]
}

export interface Attribute {
    display_type?: "number"
    trait_type: string
    token_id?: number
    value: string | number
}
