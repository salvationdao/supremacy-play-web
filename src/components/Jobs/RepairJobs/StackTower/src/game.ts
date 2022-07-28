import { FallingBlock, NormalBlock } from "./block"
import { Stage } from "./stage"

export interface GamePattern {
    score: number
    stack_at: Date
    dimension: { width: number; height: number; depth: number }
    is_failed: boolean
}

export enum GameState {
    Loading = "LOADING",
    Ready = "READY",
    Playing = "PLAYING",
    Ended = "ENDED",
    Resetting = "RESETTING",
}

export class Game {
    container: HTMLElement | null
    stage: Stage
    state: GameState
    score: number
    blocks: NormalBlock[]
    fallingBlocks: FallingBlock[]
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    setRecentPattern: React.Dispatch<React.SetStateAction<GamePattern | undefined>>

    constructor(
        backgroundColor: string,
        _setGameState: React.Dispatch<React.SetStateAction<GameState>>,
        _setRecentPattern: React.Dispatch<React.SetStateAction<GamePattern | undefined>>,
    ) {
        // container
        this.container = document.getElementById("game")

        this.setGameState = _setGameState
        this.setRecentPattern = _setRecentPattern

        this.stage = new Stage(backgroundColor)
        this.blocks = []
        this.fallingBlocks = []
        this.state = GameState.Loading
        this.score = 0

        this.addBlock()
        this.tick()

        this.container?.addEventListener("keydown", (e) => {
            if (e.keyCode === 32) {
                // Space
                this.handleEvent()
            }
        })

        this.container?.addEventListener("click", () => {
            this.handleEvent()
        })

        this.container?.addEventListener("touchend", () => {
            this.handleEvent()
        })

        setTimeout(() => {
            this.setState(GameState.Ready)
        }, 250)
    }

    handleEvent() {
        switch (this.state) {
            case GameState.Ready:
                this.setState(GameState.Playing)
                this.addBlock()
                break
            case GameState.Playing:
                this.addBlock()
                break
            case GameState.Ended:
                this.blocks.forEach((block) => {
                    this.stage.remove(block.mesh)
                })
                this.blocks = []
                this.score = 0
                this.setRecentPattern(undefined)
                this.addBlock()
                this.setState(GameState.Ready)
                break
            default:
                break
        }
    }

    addBlock() {
        let lastBlock = this.blocks[this.blocks.length - 1]
        const lastToLastBlock = this.blocks[this.blocks.length - 2]

        if (lastBlock && lastToLastBlock) {
            const { axis, dimensionAlongAxis } = lastBlock.getAxis()
            const distance = lastBlock.position[axis as keyof typeof lastBlock.position] - lastToLastBlock.position[axis as keyof typeof lastBlock.position]
            let positionFalling, position
            const { color } = lastBlock
            const newLength = lastBlock.dimension[dimensionAlongAxis as keyof typeof lastBlock.dimension] - Math.abs(distance)

            // Game over
            if (newLength <= 0) {
                this.stage.remove(lastBlock.mesh)
                this.setState(GameState.Ended)
                this.stage.setCamera(Math.max((this.blocks.length - 3) * 2, 0))
                this.setRecentPattern({ score: this.score, is_failed: true, dimension: lastBlock.dimension, stack_at: new Date() })
                return
            }

            const dimension = { ...lastBlock.dimension }
            dimension[dimensionAlongAxis as keyof typeof dimension] = newLength
            const dimensionFalling = { ...lastBlock.dimension }
            dimensionFalling[dimensionAlongAxis as keyof typeof lastBlock.dimension] = Math.abs(distance)

            if (distance >= 0) {
                position = lastBlock.position

                positionFalling = { ...lastBlock.position }
                positionFalling[axis as keyof typeof positionFalling] = lastBlock.position[axis as keyof typeof lastBlock.position] + newLength
            } else {
                position = { ...lastBlock.position }
                position[axis as keyof typeof position] = lastBlock.position[axis as keyof typeof lastBlock.position] + Math.abs(distance)

                positionFalling = { ...lastBlock.position }
                positionFalling[axis as keyof typeof positionFalling] = lastBlock.position[axis as keyof typeof lastBlock.position] - Math.abs(distance)
            }

            this.blocks.pop()
            this.stage.remove(lastBlock.mesh)
            lastBlock = new NormalBlock({ dimension, position, color, axis }, true)

            this.blocks.push(lastBlock)
            this.stage.add(lastBlock.mesh)

            const fallingBlock = new FallingBlock({
                dimension: dimensionFalling,
                position: positionFalling,
                color,
                axis: null,
            })

            this.fallingBlocks.push(fallingBlock)
            this.stage.add(fallingBlock.mesh)
        }

        this.score = Math.max(this.blocks.length - 1, 0)
        if (lastBlock) {
            this.setRecentPattern({
                score: this.score,
                is_failed: false,
                dimension: lastBlock.dimension,
                stack_at: new Date(),
            })
        }

        const newBlock = new NormalBlock(lastBlock)
        this.stage.add(newBlock.mesh)
        this.blocks.push(newBlock)

        this.stage.setCamera(this.blocks.length * 2)
    }

    setState(state: GameState) {
        const oldState = this.state
        this.state = state
        this.setGameState(state)
        return oldState
    }

    tick() {
        if (this.blocks.length > 1) {
            this.blocks[this.blocks.length - 1].tick(this.blocks.length / 10)
        }
        this.fallingBlocks.forEach((block) => block.tick())
        this.fallingBlocks = this.fallingBlocks.filter((block) => {
            if (block.position.y > 0) {
                return true
            } else {
                this.stage.remove(block.mesh)
                return false
            }
        })
        this.stage.render()
        requestAnimationFrame(() => {
            this.tick()
        })
    }
}
