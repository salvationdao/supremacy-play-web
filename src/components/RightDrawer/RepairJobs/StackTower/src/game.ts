import TWEEN from "@tweenjs/tween.js"
import { getRandomIntInclusive } from "../../../../../helpers"
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

enum PlayButton {
    Spacebar = "Spacebar",
    MKey = "M",
    NKey = "N",
}

export class Game {
    private container: HTMLElement | null
    private stage: Stage
    private blocks: NormalBlock[] = []
    private fallingBlocks: FallingBlock[] = []
    private state: GameState = GameState.Loading
    private score: number = 0
    private activePlayButton = PlayButton.Spacebar
    private animationID: number | null = null
    private timestamp: number = 0

    // External
    private setGameState: React.Dispatch<React.SetStateAction<GameState>>
    private onNewGameScore: React.MutableRefObject<(gameScore: GameScore) => Promise<void>>
    private setActivePlayButton: React.Dispatch<React.SetStateAction<string | undefined>>

    // User events
    private onKeydownBound: (e: KeyboardEvent) => void
    private onClickBound: () => void
    private onTouchedBound: () => void

    constructor(
        backgroundColor: string,
        setGameState: React.Dispatch<React.SetStateAction<GameState>>,
        onNewGameScore: React.MutableRefObject<(gameScore: GameScore) => Promise<void>>,
        setActivePlayButton: React.Dispatch<React.SetStateAction<string | undefined>>,
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
        this.setActivePlayButton = setActivePlayButton
        this.stage = new Stage(this.container, backgroundColor)

        // Function binds
        this.onKeydownBound = this.onKeydown.bind(this)
        this.onClickBound = this.onClick.bind(this)
        this.onTouchedBound = this.onTouched.bind(this)
    }

    // Random picks a button on the keyboard to be the activate button
    assignRandomPlayButton() {
        const randomNum = getRandomIntInclusive(1, 3)
        switch (randomNum) {
            case 1:
                this.activePlayButton = PlayButton.MKey
                break
            case 2:
                this.activePlayButton = PlayButton.NKey
                break
            case 3:
                this.activePlayButton = PlayButton.Spacebar
                break
        }
        this.setActivePlayButton(this.activePlayButton)
    }

    onKeydown(e: KeyboardEvent) {
        if (e.key.toLowerCase() === this.activePlayButton.toLowerCase() || (e.key === " " && this.activePlayButton === PlayButton.Spacebar)) {
            this.handleEvent(TriggeredWith.Spacebar)
        }
    }

    onClick() {
        // Disabled so game is can have randomized keyboard keys to play
        // this.handleEvent(TriggeredWith.LeftClick)
    }

    onTouched() {
        // Disabled so game is can have randomized keyboard keys to play
        // this.handleEvent(TriggeredWith.Touch)
    }

    start() {
        // Set the key down listener
        this.setActivePlayButton(this.activePlayButton)
        document.addEventListener("keydown", this.onKeydownBound)
        this.container?.addEventListener("click", this.onClickBound)
        this.container?.addEventListener("touchend", this.onTouchedBound)

        // Add initial block
        this.addBlock(TriggeredWith.None)

        // Start the ticker for the game loop
        this.tick(0)
        setTimeout(() => {
            this.setState(GameState.Ready)
        }, 500) // This allows the parent to full load because game ready means it needs parent container dimensions
        this.stage.resetContainerSize()
    }

    destroy() {
        if (this.animationID) cancelAnimationFrame(this.animationID)
        document.removeEventListener("keydown", this.onKeydownBound)
        this.stage.destroy()
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

    setState(state: GameState) {
        this.state = state
        this.setGameState(state)
    }

    tick(elapsedTime: number) {
        // Only the top block gets tick running, others are stationary
        if (this.blocks.length > 1) {
            this.blocks[this.blocks.length - 1].tick(this.blocks.length / 10, elapsedTime)
        }

        // Run tick on all falling blocks
        this.fallingBlocks.forEach((block) => block.tick())

        // If falling block falls below y=0, remove from stage
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
            TWEEN.update(ts)
            this.tick(ts - this.timestamp)
            this.timestamp = ts
        })
    }

    addBlock(triggeredWith: TriggeredWith) {
        let curBlock = this.blocks[this.blocks.length - 1] // Note this block is moving
        const prevBlock = this.blocks[this.blocks.length - 2]

        if (curBlock && prevBlock) {
            // Assign random keyboard button for next block
            this.assignRandomPlayButton()

            const { axis, dimensionAlongAxis } = curBlock.getAxis()

            let positionFalling, position
            // If its a special fast block, dont cut the block
            const distance = curBlock.isSpecialFastBlock ? 0 : curBlock.position[axis] - prevBlock.position[axis]
            const newLength = curBlock.dimension[dimensionAlongAxis] - Math.abs(distance)

            // Game over, don't continue the code
            if (curBlock.dimension[dimensionAlongAxis] - Math.abs(curBlock.position[axis] - prevBlock.position[axis]) <= 0) {
                this.stage.remove(curBlock.mesh)
                this.setState(GameState.Ended)
                this.stage.setCamera(0, Math.max(this.blocks.length * blockConfig.initHeight - 6, 6) + cameraConfig.offsetY, 0)
                this.onNewGameScore.current({
                    score: this.score,
                    is_failed: true,
                    dimension: curBlock.dimension,
                    stack_at: new Date(),
                    trigger_with: triggeredWith,
                })
                return
            }

            if (distance >= 0) {
                position = curBlock.position
                positionFalling = { ...curBlock.position }
                positionFalling[axis] = curBlock.position[axis] + newLength
            } else {
                position = { ...curBlock.position }
                position[axis] = curBlock.position[axis] + Math.abs(distance)

                positionFalling = { ...curBlock.position }
                positionFalling[axis] = curBlock.position[axis] - Math.abs(distance)
            }

            // Pop the current block out, and replace with a new one that's cropped, and doesn't move
            this.blocks.pop()
            this.stage.remove(curBlock.mesh)

            const newDimension = { ...curBlock.dimension }
            newDimension[dimensionAlongAxis] = newLength

            curBlock = new NormalBlock(
                {
                    dimension: newDimension,
                    position,
                    direction: curBlock.direction,
                    axis,
                    topTexture: curBlock.topTexture,
                    frontTexture: curBlock.frontTexture,
                    rightTexture: curBlock.rightTexture,
                },
                true,
            )

            this.blocks.push(curBlock)
            this.stage.add(curBlock.mesh)

            // Add falling block
            const dimensionFalling = { ...curBlock.dimension }
            dimensionFalling[dimensionAlongAxis] = Math.abs(distance)

            const fallingBlock = new FallingBlock(
                {
                    dimension: dimensionFalling,
                    position: positionFalling,
                    direction: curBlock.direction,
                    axis,
                    topTexture: curBlock.topTexture,
                    frontTexture: curBlock.frontTexture,
                    rightTexture: curBlock.rightTexture,
                },
                distance,
            )

            this.fallingBlocks.push(fallingBlock)
            this.stage.add(fallingBlock.mesh)
        }

        // Score will count from [0, 0, 1, 2 ...etc]
        this.score = Math.max(this.blocks.length - 1, 0)

        // +1 score if there was a block before because the starting block doesn't count
        if (curBlock) {
            this.onNewGameScore.current({
                score: this.score,
                is_failed: false,
                dimension: curBlock.dimension,
                stack_at: new Date(),
                trigger_with: triggeredWith,
            })
        }

        // Add new block
        const newBlock = new NormalBlock(curBlock)
        this.blocks.push(newBlock)
        this.stage.add(newBlock.mesh)

        // Update camera y position
        this.stage.setCamera(curBlock?.mesh.position.x || 0, this.blocks.length * blockConfig.initHeight + cameraConfig.offsetY, curBlock?.mesh.position.z || 0)
    }
}
