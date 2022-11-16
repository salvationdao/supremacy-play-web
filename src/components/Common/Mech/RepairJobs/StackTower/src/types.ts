export enum BlockType {
    Normal = "NORMAL",
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
    speed_multiplier: number
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

export interface Position {
    x: number
    y: number
    z: number
}

export enum Axis {
    x = "x",
    y = "y",
    z = "z",
}

export enum AxisDimension {
    width = "width",
    height = "height",
    depth = "depth",
}

export interface PrevBlockBrief {
    dimension: BlockDimension
    position: Position
    direction: number
    axis: Axis
    topTexture: THREE.Texture
    frontTexture: THREE.Texture
    rightTexture: THREE.Texture
}
