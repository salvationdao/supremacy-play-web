export enum BlockType {
    Normal = "NORMAL",
    Shrink = "SHRINK",
    Fast = "FAST",
    Bomb = "BOMB",
    End = "END",
}

// Make sure it matches with keydown event.key
export enum PlayButton {
    Spacebar = "SPACEBAR",
    MKey = "M",
    NKey = "N",
}

export interface BlockDimension {
    width: number
    height: number
    depth: number
}

export interface BlockServer {
    id: string
    type: BlockType
    key: PlayButton
    dimension: BlockDimension
    speed_multiplier: string
    total_score: number
}

export enum GameState {
    Loading = "LOADING",
    Ready = "READY",
    Playing = "PLAYING",
    Ended = "ENDED",
    Resetting = "RESETTING",
}

export interface NewStackInfo {
    id: string
    score: number
    dimension: BlockDimension
    is_failed: boolean
}
