import { FallingBlock, NormalBlock } from "./block"
import { blockConfig, cameraConfig } from "./config"
import { Stage } from "./stage"

enum TriggerWith {
    Spacebar = "SPACE_BAR",
    LeftClick = "LEFT_CLICK",
    Touch = "TOUCH",
    None = "NONE",
}

export interface GamePattern {
    score: number
    stack_at: Date
    dimension: { width: number; height: number; depth: number }
    is_failed: boolean
    trigger_with: TriggerWith
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
    oneNewGamePattern: (gamePattern: GamePattern) => void
    triggerWith: TriggerWith

    constructor(
        backgroundColor: string,
        _setGameState: React.Dispatch<React.SetStateAction<GameState>>,
        _oneNewGamePattern: (gamePattern: GamePattern) => void,
    ) {
        const gameContainer = document.getElementById("game")
        const container = document.createElement("div")
        container.style.width = "100%"
        container.style.height = "100%"
        container.tabIndex = 0

        if (gameContainer) {
            let child = gameContainer.lastElementChild
            while (child) {
                gameContainer.removeChild(child)
                child = gameContainer.lastElementChild
            }

            container.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.key === "Spacebar" || e.key === " ") {
                    this.triggerWith = TriggerWith.Spacebar
                    this.handleEvent()
                }
            })

            container.addEventListener("click", () => {
                this.triggerWith = TriggerWith.LeftClick
                this.handleEvent()
            })

            container.addEventListener("touchend", () => {
                this.triggerWith = TriggerWith.Touch
                this.handleEvent()
            })

            gameContainer.appendChild(container)
        }
        container.focus()
        this.container = container

        this.setGameState = _setGameState
        this.oneNewGamePattern = _oneNewGamePattern
        this.triggerWith = TriggerWith.None

        this.stage = new Stage(this.container, backgroundColor)
        this.blocks = []
        this.fallingBlocks = []
        this.state = GameState.Loading
        this.score = 0

        this.addBlock()
        this.tick()

        setTimeout(() => {
            this.setState(GameState.Ready)
        }, 500) // This allows the parent to full load because game ready means it needs parent container dimensions
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
            const { color, topTexture, leftTexture, bottomTexture } = lastBlock
            const newLength = lastBlock.dimension[dimensionAlongAxis as keyof typeof lastBlock.dimension] - Math.abs(distance)

            // Game over
            if (newLength <= 0) {
                this.stage.remove(lastBlock.mesh)
                this.setState(GameState.Ended)
                this.stage.setCamera(Math.max(this.blocks.length * blockConfig.initHeight - 6, 6) + cameraConfig.offsetY)
                this.oneNewGamePattern({
                    score: this.score,
                    is_failed: true,
                    dimension: lastBlock.dimension,
                    stack_at: new Date(),
                    trigger_with: this.triggerWith,
                })
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
            lastBlock = new NormalBlock({ dimension, position, color, axis, topTexture, leftTexture, bottomTexture }, true)

            this.blocks.push(lastBlock)
            this.stage.add(lastBlock.mesh)

            const fallingBlock = new FallingBlock({
                dimension: dimensionFalling,
                position: positionFalling,
                color,
                axis: null,
                topTexture,
                leftTexture,
                bottomTexture,
            })

            this.fallingBlocks.push(fallingBlock)
            this.stage.add(fallingBlock.mesh)
        }

        this.score = Math.max(this.blocks.length - 1, 0)

        if (lastBlock) {
            this.oneNewGamePattern({
                score: this.score,
                is_failed: false,
                dimension: lastBlock.dimension,
                stack_at: new Date(),
                trigger_with: this.triggerWith,
            })
        }

        const newBlock = new NormalBlock(lastBlock)
        this.stage.add(newBlock.mesh)
        this.blocks.push(newBlock)

        this.stage.setCamera(this.blocks.length * blockConfig.initHeight + cameraConfig.offsetY)
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
