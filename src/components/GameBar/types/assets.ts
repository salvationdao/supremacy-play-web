export interface Collection {
	id: string
	name: string
	image: string
	createdAt: Date
	updatedAt: Date
	frozenAt?: Date
	deletedAt?: Date
}

export interface Asset {
	hash: string
	userID: string
	username: string
	name: string
	collection: Collection
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

export interface QueuedWarMachine {
	position: number
	warMachineMetadata: WarMachineMetadata
}

export interface WarMachineMetadata {
	hash: string
	isInsured: boolean
	contractReward: string
}

export interface AssetDurability {
	durability: number
	repairType: "FAST" | "STANDARD" | ""
}
