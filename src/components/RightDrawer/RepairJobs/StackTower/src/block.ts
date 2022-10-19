import TWEEN from "@tweenjs/tween.js"
import * as THREE from "three"
import { clamp } from "three/src/math/MathUtils"
import { hexToRGB } from "../../../../../helpers"
import { colors } from "../../../../../theme/theme"
import { baseFrameRate, blockConfig, skins } from "./config"
import { BlockDimension, BlockServer, BlockType, Position, Axis, AxisDimension, PrevBlockBrief } from "./types"
import { cover } from "./utils"

export class Block {
    blockServer: BlockServer
    MOVE_AMOUNT: number
    direction: number
    speed: number
    dimension: BlockDimension
    position: Position
    axis: Axis
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[]>
    topTexture: THREE.Texture
    frontTexture: THREE.Texture
    rightTexture: THREE.Texture
    materials: THREE.MeshBasicMaterial[]

    constructor(blockServer: BlockServer, prevBlock?: PrevBlockBrief, shouldReplace = false, isFalling = false) {
        this.blockServer = blockServer

        // This is how far away to spawn from the center of the stacks (spawn loc)
        this.MOVE_AMOUNT = 20

        // **************************
        // ********** Axis **********
        // **************************
        this.axis = shouldReplace && prevBlock ? prevBlock.axis : Math.random() > 0.5 ? Axis.x : Axis.z

        // *******************************
        // ********** Dimension **********
        // *******************************
        // Only use prev dimension if we are replacing
        this.dimension = {
            width: shouldReplace && prevBlock ? prevBlock.dimension.width : blockServer.dimension.width,
            height: shouldReplace && prevBlock ? prevBlock.dimension.height : 2,
            depth: shouldReplace && prevBlock ? prevBlock.dimension.depth : blockServer.dimension.depth,
        }

        // ******************************
        // ********** Position **********
        // ******************************
        this.position = {
            x: prevBlock ? prevBlock.position.x : 0,
            z: prevBlock ? prevBlock.position.z : 0,
            y: shouldReplace && prevBlock ? prevBlock.position.y : prevBlock ? prevBlock.position.y + prevBlock.dimension.height : this.dimension.height,
        }

        // If there was a previous block AND we aren't replacing it, it will spawn MOVE_AMOUNT from center
        if (prevBlock && !shouldReplace) this.position[this.axis] = (Math.random() > 0.5 ? 1 : -1) * this.MOVE_AMOUNT

        // ***************************************
        // ********** Speed / Direction **********
        // ***************************************
        let speed = blockConfig.initSpeed + blockConfig.acceleration
        speed = Math.min(speed, blockConfig.maxSpeed) // Bound to a max speed
        this.speed = -speed
        this.direction = this.speed

        // **********************************
        // ********** Create Block **********
        // **********************************
        const geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth)
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2))

        // ************************************
        // ********** Skin / Texture **********
        // ************************************
        // Handle skin texture (custom theme)
        if (prevBlock && shouldReplace) {
            // If we are replacing previous block, it will have same dimension, so no need to run cover()
            this.topTexture = prevBlock.topTexture
            this.frontTexture = prevBlock.frontTexture
            this.rightTexture = prevBlock.rightTexture

            // If we are replacing and it's the small falling block, then need to run cover()
            if (!isFalling) {
                cover(this.topTexture, this.dimension.width / this.dimension.depth)
                cover(this.frontTexture, this.dimension.width / this.dimension.height)
                cover(this.rightTexture, this.dimension.depth / this.dimension.height)
            }
        } else {
            // Loading the texture from image
            const skin = this.getRandomSkin()
            const textureLoader = new THREE.TextureLoader()
            this.topTexture = textureLoader.load(skin.top, () => cover(this.topTexture, this.dimension.width / this.dimension.depth))
            this.frontTexture = textureLoader.load(skin.front, () => cover(this.frontTexture, this.dimension.width / this.dimension.height))
            this.rightTexture = textureLoader.load(skin.right, () => cover(this.rightTexture, this.dimension.depth / this.dimension.height))
        }

        // Define materials from texture
        const topMaterial = new THREE.MeshBasicMaterial({ map: this.topTexture })
        const frontMaterial = new THREE.MeshBasicMaterial({ map: this.frontTexture })
        const rightMaterial = new THREE.MeshBasicMaterial({ map: this.rightTexture })

        this.materials = [
            rightMaterial, // Right
            rightMaterial, // Right opposite
            topMaterial, // Top
            topMaterial, // Top opposite
            frontMaterial, // Front
            frontMaterial, // Front opposite
        ]

        this.mesh = new THREE.Mesh(geometry, this.materials)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    }

    getRandomSkin() {
        return skins[Math.floor(Math.random() * skins.length)]
    }

    getAxis() {
        let dimensionAlongAxis = AxisDimension.depth
        switch (this.axis) {
            case Axis.x:
                dimensionAlongAxis = AxisDimension.width
                break
            case Axis.z:
                dimensionAlongAxis = AxisDimension.depth
                break
        }
        return {
            axis: this.axis,
            dimensionAlongAxis,
        }
    }
}

// Runs a tick, moves back and forth
export class MovingBlock extends Block {
    // Blinking effect
    private isBlinked = false
    private prevBlinkTime = 0
    private time = 0

    constructor(blockServer: BlockServer, prevBlock?: PrevBlockBrief, shouldReplace = false) {
        super(blockServer, prevBlock, shouldReplace, false)
    }

    reverseDirection() {
        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed)
    }

    tick(boost = 0, elapsedTime: number) {
        const axisPos = this.position[this.axis]
        // If block is reaching the edge, then quickly change direction and give it a little bounce back
        // So it will never get stuck
        if (axisPos > this.MOVE_AMOUNT || axisPos < -this.MOVE_AMOUNT) {
            this.reverseDirection()
            this.position[this.axis] = clamp(-this.MOVE_AMOUNT + 2, axisPos, this.MOVE_AMOUNT - 2)
        }

        // Move the block
        const speedMultiplier = parseFloat(this.blockServer.speed_multiplier)
        this.position[this.axis] += this.direction * (1 + boost) * (elapsedTime * (baseFrameRate / 1000)) * speedMultiplier
        this.mesh.position[this.axis] = this.position[this.axis]

        if (this.blockServer.type === BlockType.Fast) {
            this.handleBlinking(elapsedTime, colors.neonBlue)
        } else if (this.blockServer.type === BlockType.Bomb) {
            this.handleBlinking(elapsedTime, colors.red)
        }
    }

    // Make the block blink
    handleBlinking(elapsedTime: number, color: string) {
        this.time += elapsedTime

        if (this.time - this.prevBlinkTime > blockConfig.blinkFrequency) {
            const finalColor = this.isBlinked ? hexToRGB("#FFFFFF") : hexToRGB(color)

            this.materials.forEach((mat) => {
                new TWEEN.Tween({ r: mat.color.r, g: mat.color.g, b: mat.color.b })
                    .to({ r: finalColor.r / 255, g: finalColor.g / 255, b: finalColor.b / 255 }, blockConfig.blinkFrequency * 0.9)
                    .onUpdate((newColor) => {
                        mat.color.setRGB(newColor.r, newColor.g, newColor.b)
                    })
                    .start()
            })

            this.isBlinked = !this.isBlinked
            this.prevBlinkTime = this.time
        }
    }
}

// Runs a tick
export class FallingBlock extends Block {
    private distance: number

    constructor(blockServer: BlockServer, prevBlock: PrevBlockBrief, distance: number) {
        super(blockServer, prevBlock, true, true)
        this.distance = distance
        this.speed *= 1.8 // Make it fall faster
        this.direction = prevBlock.direction
    }

    tick() {
        this.position.y -= Math.abs(this.speed)
        this.mesh.rotation[this.axis === Axis.x ? Axis.z : Axis.x] +=
            (this.axis === Axis.x ? -1 : 1) * (this.direction / 6) * (-this.distance / Math.abs(this.distance))
        this.mesh.position.y = this.position.y
    }
}
