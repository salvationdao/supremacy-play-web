import TWEEN from "@tweenjs/tween.js"
import { FallingBlock, MovingBlock } from "./block"
import { blockConfig, cameraConfig } from "./config"
import { Stage } from "./stage"
import { BlockServer, BlockType, GameState, NewStackInfo, PlayButton } from "./types"

export class Game {
    private container: HTMLElement | null
    private stage: Stage
    private blocks: MovingBlock[] = []
    private fallingBlocks: FallingBlock[] = []
    private score: number = 0
    private state: GameState = GameState.Loading
    private activePlayButton = PlayButton.Spacebar
    private animationID: number | null = null
    private timestamp: number = 0

    // External
    private setGameState: React.Dispatch<React.SetStateAction<GameState>>
    private onPlaceBlock: React.MutableRefObject<(newStackInfo: NewStackInfo) => Promise<void>>
    private setActivePlayButton: React.Dispatch<React.SetStateAction<string>>

    // User events
    private onKeydownBound: (e: KeyboardEvent) => void

    constructor(
        backgroundColor: string,
        setGameState: React.Dispatch<React.SetStateAction<GameState>>,
        onPlaceBlock: React.MutableRefObject<(newStackInfo: NewStackInfo) => Promise<void>>,
        setActivePlayButton: React.Dispatch<React.SetStateAction<string>>,
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
        this.onPlaceBlock = onPlaceBlock
        this.setActivePlayButton = setActivePlayButton
        this.stage = new Stage(this.container, backgroundColor)

        // Function binds
        this.onKeydownBound = this.onKeydown.bind(this)
    }

    start() {
        // Set the key down listener
        this.setPlayButton(this.activePlayButton)
        document.addEventListener("keydown", this.onKeydownBound)

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

    setState(state: GameState) {
        this.state = state
        this.setGameState(state)
    }

    setPlayButton(playButton: PlayButton) {
        this.activePlayButton = playButton
        this.setActivePlayButton(this.activePlayButton)
    }

    onKeydown(e: KeyboardEvent) {
        if (e.key.toLowerCase() === this.activePlayButton.toLowerCase() || (e.key === " " && this.activePlayButton === PlayButton.Spacebar)) {
            switch (this.state) {
                case GameState.Ready:
                    this.setState(GameState.Playing)
                    this.placeBlock()
                    break
                case GameState.Playing:
                    this.placeBlock()
                    break
                case GameState.Ended:
                    this.blocks.forEach((block) => {
                        this.stage.remove(block.mesh)
                    })
                    this.blocks = []
                    this.score = 0
                    this.setState(GameState.Ready)
                    this.placeBlock()
                    break
                default:
                    break
            }
        }
    }

    tick(elapsedTime: number) {
        // Only the top block (except the initial first one) gets tick running, others are stationary
        if (this.blocks.length > 1) {
            this.blocks[this.blocks.length - 1].tick(this.blocks.length / 10, elapsedTime)
        }

        // Run tick on all falling blocks
        this.fallingBlocks.forEach((block) => block.tick())

        // If falling block falls below y = 0, remove from stage
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

    // Generate a new block to play
    onNewBlock(blockServer: BlockServer) {
        // Set the active keyboard button to play
        this.setPlayButton(blockServer.key)

        const curBlock = this.blocks[this.blocks.length - 1] // Note this is the top most block on stack

        // Add new block
        const newBlock = new MovingBlock(blockServer, curBlock)
        this.blocks.push(newBlock)
        this.stage.add(newBlock.mesh)
    }

    placeBlock() {
        let curBlock = this.blocks[this.blocks.length - 1] // Note this is the current moving block
        const prevBlock = this.blocks[this.blocks.length - 2]

        // Return if there isn't a block to place
        if (!curBlock || !prevBlock) return

        const { axis, dimensionAlongAxis } = curBlock.getAxis()
        const landedOnStack = curBlock.dimension[dimensionAlongAxis] - Math.abs(curBlock.position[axis] - prevBlock.position[axis]) > 0

        // *******************************
        // ********** Game Over **********
        // *******************************
        // If moving block misses the stack completely and not bomb, game over
        if (!landedOnStack && curBlock.blockServer.type !== BlockType.Bomb) {
            this.stage.remove(curBlock.mesh)
            this.stage.setCamera(0, Math.max(this.blocks.length * blockConfig.initHeight - 6, 6) + cameraConfig.offsetY, 0)
            this.onPlaceBlock.current({
                id: curBlock.blockServer.id,
                score: this.score,
                is_failed: true,
                dimension: curBlock.dimension,
            })
            this.setPlayButton(PlayButton.Spacebar)
            this.setState(GameState.Ended)
            return
        }

        // ***************************************
        // ********** Replacement Block **********
        // ***************************************
        // Calculate the dimension of the falling block
        // If its a special fast block, dont cut the block
        const lengthStickingOut = curBlock.blockServer.type === BlockType.Fast ? 0 : curBlock.position[axis] - prevBlock.position[axis]
        const newLength = curBlock.dimension[dimensionAlongAxis] - Math.abs(lengthStickingOut)

        // The position of the replacement block
        const positionReplacement = {
            ...curBlock.position,
            [axis]: lengthStickingOut >= 0 ? curBlock.position[axis] : curBlock.position[axis] + Math.abs(lengthStickingOut),
        }

        // Pop the current block out, and replace with a new one that's cropped, and doesn't move
        this.blocks.pop()
        this.stage.remove(curBlock.mesh)

        curBlock = new MovingBlock(
            curBlock.blockServer,
            {
                dimension: { ...curBlock.dimension, [dimensionAlongAxis]: newLength },
                position: positionReplacement,
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

        // ***********************************
        // ********** Falling Block **********
        // ***********************************
        // The position of the falling block
        const positionFalling = {
            ...curBlock.position,
            [axis]: lengthStickingOut >= 0 ? curBlock.position[axis] + newLength : curBlock.position[axis] - Math.abs(lengthStickingOut),
        }

        const fallingBlock = new FallingBlock(
            curBlock.blockServer,
            {
                dimension: { ...curBlock.dimension, [dimensionAlongAxis]: Math.abs(lengthStickingOut) },
                position: positionFalling,
                direction: curBlock.direction,
                axis,
                topTexture: curBlock.topTexture,
                frontTexture: curBlock.frontTexture,
                rightTexture: curBlock.rightTexture,
            },
            lengthStickingOut,
        )

        this.fallingBlocks.push(fallingBlock)
        this.stage.add(fallingBlock.mesh)

        // **************************
        // ********** Misc **********
        // **************************
        // Score will count from [0, 0, 1, 2 ...etc]
        this.score = Math.max(this.blocks.length - 1, 0)

        // Send place block update to server
        if (prevBlock) {
            this.onPlaceBlock.current({
                id: curBlock.blockServer.id,
                score: this.score,
                is_failed: !landedOnStack,
                dimension: curBlock.dimension,
            })
        }

        // Update camera y position
        this.stage.setCamera(curBlock?.mesh.position.x || 0, this.blocks.length * blockConfig.initHeight + cameraConfig.offsetY, curBlock?.mesh.position.z || 0)
    }
}
