import TWEEN from "@tweenjs/tween.js"
import { isInBetweenInclusive } from "../../../../../../helpers"
import { FallingBlock, MovingBlock } from "./block"
import { blockConfig, cameraConfig, shrinkMultiplier } from "./config"
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

        this.stage.setCamera(0, blockConfig.initHeight + cameraConfig.offsetY, 0)

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
        e.stopPropagation()
        e.preventDefault()

        // Dont execute if key being help down
        if (e.repeat) return

        if (e.key.toLowerCase() === this.activePlayButton.toLowerCase() || (e.key === " " && this.activePlayButton === PlayButton.Spacebar)) {
            switch (this.state) {
                case GameState.Ready:
                    this.stage.setCamera(0, blockConfig.initHeight + cameraConfig.offsetY, 0)
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
                    this.stage.setCamera(0, blockConfig.initHeight + cameraConfig.offsetY, 0)
                    this.setState(GameState.Ready)
                    this.placeBlock()
                    break
                default:
                    break
            }

            return
        }

        // If player pressed the wrong (but valid) button, punish them by shrinking the block
        if (this.state === GameState.Playing && (e.key === " " || Object.values(PlayButton).find((pb) => pb.toLowerCase() === e.key.toLowerCase()))) {
            // Get the top block
            const topBlock = this.blocks[this.blocks.length - 1]
            this.blocks.pop()
            this.stage.remove(topBlock.mesh)

            const newBlock = new MovingBlock(
                topBlock.blockServer,
                {
                    dimension: {
                        ...topBlock.dimension,
                        width: Math.max(topBlock.dimension.width * shrinkMultiplier, 0.4),
                        depth: Math.max(topBlock.dimension.depth * shrinkMultiplier, 0.4),
                    },
                    position: topBlock.position,
                    direction: topBlock.direction,
                    axis: topBlock.axis,
                    topTexture: topBlock.topTexture,
                    frontTexture: topBlock.frontTexture,
                    rightTexture: topBlock.rightTexture,
                },
                true,
            )
            newBlock.shouldReplace = false
            this.blocks.push(newBlock)
            this.stage.add(newBlock.mesh)
            return
        }
    }

    tick(elapsedTime: number) {
        // Only the top block (except the initial first one) gets tick running, others are stationary
        if (this.blocks.length > 1) {
            this.blocks[this.blocks.length - 1].tick(this.blocks.length / 10, elapsedTime)
        }

        // Run tick on all falling blocks
        this.fallingBlocks.forEach((block) => block.tick(elapsedTime))

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
        let landedOnStack = true
        let curBlock = this.blocks[this.blocks.length - 1] // Note this is the current moving block
        const prevBlock = this.blocks[this.blocks.length - 2]

        // If the top most block is a block we already placed, then return
        // Server shouldve sent a new block
        if (curBlock?.shouldReplace) return

        // Return if there isn't a block to place
        if (curBlock && prevBlock) {
            const { axis, dimensionAlongAxis } = curBlock.getAxis()
            const isFrontEdgeInside = isInBetweenInclusive(
                curBlock.position[axis] + curBlock.dimension[dimensionAlongAxis],
                prevBlock.position[axis],
                prevBlock.position[axis] + prevBlock.dimension[dimensionAlongAxis],
            )
            const isBackEdgeInside = isInBetweenInclusive(
                curBlock.position[axis],
                prevBlock.position[axis],
                prevBlock.position[axis] + prevBlock.dimension[dimensionAlongAxis],
            )

            // Whether the moving block landed on the stack tower by checking if the front or end edge is between stack tower
            landedOnStack = isFrontEdgeInside || isBackEdgeInside

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
            let lengthStickingOut = 0
            if (curBlock.blockServer.type === BlockType.Fast || (isFrontEdgeInside && isBackEdgeInside)) {
                lengthStickingOut = 0
            } else if (isFrontEdgeInside) {
                lengthStickingOut = prevBlock.position[axis] - curBlock.position[axis]
            } else if (isBackEdgeInside) {
                lengthStickingOut =
                    curBlock.position[axis] + curBlock.dimension[dimensionAlongAxis] - (prevBlock.position[axis] + prevBlock.dimension[dimensionAlongAxis])
            }

            const newLength = curBlock.dimension[dimensionAlongAxis] - Math.abs(lengthStickingOut)

            // Pop the current block out, and replace with a new one that's cropped, and doesn't move
            this.blocks.pop()
            this.stage.remove(curBlock.mesh)

            if (landedOnStack) {
                // The position of the replacement block
                const positionReplacement = {
                    ...curBlock.position,
                    [axis]: isBackEdgeInside ? curBlock.position[axis] : curBlock.position[axis] + Math.abs(lengthStickingOut),
                }

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
            }

            // ***********************************
            // ********** Falling Block **********
            // ***********************************
            // The position of the falling block
            const positionFalling = {
                ...curBlock.position,
                [axis]:
                    curBlock.blockServer.type === BlockType.Bomb
                        ? curBlock.position[axis]
                        : isBackEdgeInside
                        ? curBlock.position[axis] + newLength
                        : curBlock.position[axis] - Math.abs(lengthStickingOut),
            }

            const fallingBlock = new FallingBlock(
                curBlock.blockServer,
                {
                    dimension: {
                        ...curBlock.dimension,
                        [dimensionAlongAxis]:
                            curBlock.blockServer.type === BlockType.Bomb ? curBlock.dimension[dimensionAlongAxis] : Math.abs(lengthStickingOut),
                    },
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
        }

        // **************************
        // ********** Misc **********
        // **************************

        // If its a bomb and it got stacked, blow off some and deduct points
        if (curBlock && landedOnStack && curBlock.blockServer.type === BlockType.Bomb) {
            this.blowOffTopNBlocks(3)
        }

        // Score will count from [0, 0, 1, 2 ...etc]
        this.score = Math.max(this.blocks.length - 1, 0)

        const topBlock = this.blocks[this.blocks.length - 1]
        // Send place block update to server
        if (curBlock && prevBlock) {
            this.onPlaceBlock.current({
                id: curBlock.blockServer.id,
                score: this.score,
                is_failed: !landedOnStack,
                dimension: topBlock.dimension,
            })
        }

        // Update camera y position
        if (curBlock?.blockServer.type !== BlockType.Bomb || (landedOnStack && curBlock?.blockServer.type === BlockType.Bomb)) {
            this.stage.setCamera(
                topBlock?.mesh.position.x || 0,
                this.blocks.length * blockConfig.initHeight + cameraConfig.offsetY,
                topBlock?.mesh.position.z || 0,
            )
        }
    }

    blowOffTopNBlocks(amount: number) {
        const spliceAmount = Math.min(amount + 1, this.blocks.length - 1)

        this.blocks.splice(-spliceAmount).forEach((block) => {
            this.stage.remove(block.mesh)
        })
    }
}
