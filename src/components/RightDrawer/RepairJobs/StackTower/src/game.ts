import { FallingBlock, NormalBlock } from "./block"
import { blockConfig, cameraConfig } from "./config"
import { Stage } from "./stage"

enum TriggeredWith {
    Spacebar = "SPACE_BAR",
    LeftClick = "LEFT_CLICK",
    Touch = "TOUCH",
    None = "NONE",
}

export interface GameScore {
    score: number
    stack_at: Date
    dimension: { width: number; height: number; depth: number }
    is_failed: boolean
    trigger_with: TriggeredWith
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
    blocks: NormalBlock[] = []
    fallingBlocks: FallingBlock[] = []
    state: GameState = GameState.Loading
    score: number = 0
    animationID: number | null = null
    timestamp: number = 0

    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    onNewGameScore: React.MutableRefObject<(gameScore: GameScore) => Promise<void>>

    onKeydownBound: (e: KeyboardEvent) => void
    onClickBound: () => void
    onTouchedBound: () => void

    constructor(
        backgroundColor: string,
        setGameState: React.Dispatch<React.SetStateAction<GameState>>,
        onNewGameScore: React.MutableRefObject<(gameScore: GameScore) => Promise<void>>,
    ) {
        // DOM setup
        const gameContainer = document.getElementById("tower-stack-game")
        this.container = document.createElement("div")
        this.container.style.width = "100%"
        this.container.style.height = "100%"
        this.container.tabIndex = 0

        if (gameContainer) {
            // Empty out the parent container
            let child = gameContainer.lastElementChild
            while (child) {
                gameContainer.removeChild(child)
                child = gameContainer.lastElementChild
            }

            // Then append our new container into it
            gameContainer.appendChild(this.container)
        }
        this.container.focus()

        // Set class variables
        this.setGameState = setGameState
        this.onNewGameScore = onNewGameScore
        this.stage = new Stage(this.container, backgroundColor)

        // Function binds
        this.onKeydownBound = this.onKeydown.bind(this)
        this.onClickBound = this.onClick.bind(this)
        this.onTouchedBound = this.onTouched.bind(this)
    }

    onKeydown(e: KeyboardEvent) {
        if (e.key === "Spacebar" || e.key === " ") {
            this.handleEvent(TriggeredWith.Spacebar)
        }
    }

    onClick() {
        this.handleEvent(TriggeredWith.LeftClick)
    }

    onTouched() {
        this.handleEvent(TriggeredWith.Touch)
    }

    start() {
        document.addEventListener("keydown", this.onKeydownBound)
        this.container?.addEventListener("click", this.onClickBound)
        this.container?.addEventListener("touchend", this.onTouchedBound)

        this.addBlock(TriggeredWith.None)
        this.tick(0)
        setTimeout(() => {
            this.setState(GameState.Ready)
        }, 500) // This allows the parent to full load because game ready means it needs parent container dimensions
        this.stage.resetContainerSize()
    }

    tick(elapsedTime: number) {
        if (this.blocks.length > 1) {
            this.blocks[this.blocks.length - 1].tick(this.blocks.length / 10, elapsedTime)
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
        this.animationID = requestAnimationFrame((ts) => {
            this.tick(ts - this.timestamp)
            this.timestamp = ts
        })
    }

    cleanup() {
        if (this.animationID) cancelAnimationFrame(this.animationID)
        document.removeEventListener("keydown", this.onKeydownBound)
        this.container?.removeEventListener("click", this.onClickBound)
        this.container?.removeEventListener("touchend", this.onTouchedBound)
        this.stage.renderer.dispose()
        this.container?.remove()
    }

    handleEvent(triggeredWith: TriggeredWith) {
        switch (this.state) {
            case GameState.Ready:
                this.setState(GameState.Playing)
                this.addBlock(triggeredWith)
                break
            case GameState.Playing:
                this.addBlock(triggeredWith)
                break
            case GameState.Ended:
                this.blocks.forEach((block) => {
                    this.stage.remove(block.mesh)
                })
                this.blocks = []
                this.score = 0
                this.addBlock(triggeredWith)
                this.setState(GameState.Ready)
                break
            default:
                break
        }
    }

    addBlock(triggeredWith: TriggeredWith) {
        let lastBlock = this.blocks[this.blocks.length - 1]
        const lastToLastBlock = this.blocks[this.blocks.length - 2]

        if (lastBlock && lastToLastBlock) {
            const { axis, dimensionAlongAxis } = lastBlock.getAxis()
            const distance = lastBlock.position[axis] - lastToLastBlock.position[axis]
            let positionFalling, position
            const { color, topTexture, frontTexture, rightTexture, direction } = lastBlock
            const newLength = lastBlock.dimension[dimensionAlongAxis] - Math.abs(distance)

            // Game over
            if (newLength <= 0) {
                this.stage.remove(lastBlock.mesh)
                this.setState(GameState.Ended)
                this.stage.setCamera(Math.max(this.blocks.length * blockConfig.initHeight - 6, 6) + cameraConfig.offsetY)
                this.onNewGameScore.current({
                    score: this.score,
                    is_failed: true,
                    dimension: lastBlock.dimension,
                    stack_at: new Date(),
                    trigger_with: triggeredWith,
                })
                return
            }

            const dimension = { ...lastBlock.dimension }
            dimension[dimensionAlongAxis] = newLength
            const dimensionFalling = { ...lastBlock.dimension }
            dimensionFalling[dimensionAlongAxis] = Math.abs(distance)

            if (distance >= 0) {
                position = lastBlock.position

                positionFalling = { ...lastBlock.position }
                positionFalling[axis] = lastBlock.position[axis] + newLength
            } else {
                position = { ...lastBlock.position }
                position[axis] = lastBlock.position[axis] + Math.abs(distance)

                positionFalling = { ...lastBlock.position }
                positionFalling[axis] = lastBlock.position[axis] - Math.abs(distance)
            }

            this.blocks.pop()
            this.stage.remove(lastBlock.mesh)
            lastBlock = new NormalBlock({ dimension, position, direction, color, axis, topTexture, frontTexture, rightTexture }, true)

            this.blocks.push(lastBlock)
            this.stage.add(lastBlock.mesh)

            const fallingBlock = new FallingBlock({
                dimension: dimensionFalling,
                position: positionFalling,
                direction,
                color,
                axis,
                topTexture,
                frontTexture,
                rightTexture,
            })

            this.fallingBlocks.push(fallingBlock)
            this.stage.add(fallingBlock.mesh)
        }

        this.score = Math.max(this.blocks.length - 1, 0)

        if (lastBlock) {
            this.onNewGameScore.current({
                score: this.score,
                is_failed: false,
                dimension: lastBlock.dimension,
                stack_at: new Date(),
                trigger_with: triggeredWith,
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
}
