import { FallingBlock, NormalBlock } from "./block"
import { Stage } from "./stage"

export class Game {
    STATES: { LOADING: string; PLAYING: string; READY: string; ENDED: string; RESETTING: string }
    stage: Stage
    state: string
    blocks: NormalBlock[]
    fallingBlocks: FallingBlock[]
    mainContainer: HTMLElement | null
    scoreContainer: HTMLElement | null
    startButton: HTMLElement | null
    instructions: HTMLElement | null

    constructor() {
        this.STATES = {
            LOADING: "loading",
            PLAYING: "playing",
            READY: "ready",
            ENDED: "ended",
            RESETTING: "resetting",
        }

        this.blocks = []
        this.fallingBlocks = []
        this.state = this.STATES.LOADING

        this.stage = new Stage()

        this.mainContainer = document.getElementById("container")
        this.scoreContainer = document.getElementById("score")
        this.startButton = document.getElementById("start-button")
        this.instructions = document.getElementById("instructions")
        if (this.scoreContainer) this.scoreContainer.innerHTML = "0"

        this.addBlock()
        this.tick()

        for (const key in this.STATES) {
            if (this.mainContainer) this.mainContainer.classList.remove(this.STATES[key as keyof typeof this.STATES])
        }
        this.setState(this.STATES.READY)

        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 32) {
                // Space
                this.handleEvent()
            }
        })

        document.addEventListener("click", () => {
            this.handleEvent()
        })

        document.addEventListener("touchend", () => {
            this.handleEvent()
        })
    }

    handleEvent() {
        switch (this.state) {
            case this.STATES.READY:
                this.setState(this.STATES.PLAYING)
                this.addBlock()
                break
            case this.STATES.PLAYING:
                this.addBlock()
                break
            case this.STATES.ENDED:
                this.blocks.forEach((block) => {
                    this.stage.remove(block.mesh)
                })
                this.blocks = []
                if (this.scoreContainer) this.scoreContainer.innerHTML = "0"
                this.addBlock()
                this.setState(this.STATES.READY)
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

            if (newLength <= 0) {
                this.stage.remove(lastBlock.mesh)
                this.setState(this.STATES.ENDED)
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

        if (this.scoreContainer) this.scoreContainer.innerHTML = String(this.blocks.length - 1)

        const newBlock = new NormalBlock(lastBlock)
        this.stage.add(newBlock.mesh)
        this.blocks.push(newBlock)

        this.stage.setCamera(this.blocks.length * 2)
    }

    setState(state: string) {
        const oldState = this.state
        if (this.mainContainer) this.mainContainer.classList.remove(this.state)
        this.state = state
        if (this.mainContainer) this.mainContainer.classList.add(this.state)
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
