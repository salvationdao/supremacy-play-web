import TWEEN from "@tweenjs/tween.js"
import * as THREE from "three"
import { clamp } from "three/src/math/MathUtils"
import { getRandomFloat, hexToRGB } from "../../../../../helpers"
import { colors } from "../../../../../theme/theme"
import {
    baseFrameRate,
    blockConfig,
    chanceRandomBlockSizeOccur,
    chanceSpecialFastBlinking,
    randomBlockSizeFactorMax,
    randomBlockSizeFactorMin,
    randomBlockSpeedFactorMax,
    randomBlockSpeedFactorMin,
    skins,
} from "./config"
import { cover } from "./utils"

export interface Dimension {
    width: number
    height: number
    depth: number
}
interface Position {
    x: number
    y: number
    z: number
}

enum Axis {
    x = "x",
    y = "y",
    z = "z",
}

enum AxisDimension {
    width = "width",
    height = "height",
    depth = "depth",
}

export interface PrevBlock {
    dimension: Dimension
    position: Position
    direction: number
    axis: Axis
    topTexture: THREE.Texture
    frontTexture: THREE.Texture
    rightTexture: THREE.Texture
}

export class Block {
    MOVE_AMOUNT: number
    direction: number
    speed: number
    dimension: Dimension
    position: Position
    axis: Axis
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[]>
    topTexture: THREE.Texture
    frontTexture: THREE.Texture
    rightTexture: THREE.Texture
    materials: THREE.MeshBasicMaterial[]

    // Special (smaller size)
    private randomizeSizeFactor = 1

    constructor(prevBlock?: PrevBlock, shouldReplace = false, isFalling = false) {
        this.randomizeSizeFactor = getRandomFloat(0, 1) < chanceRandomBlockSizeOccur ? getRandomFloat(randomBlockSizeFactorMin, randomBlockSizeFactorMax) : 1

        // This is how far away to spawn from the center of the stacks (spawn loc)
        this.MOVE_AMOUNT = 20
        let axis = null

        // Set the dimension and position from the target block, or defaults.
        let height, width, depth
        let x, y, z

        if (prevBlock) {
            width = prevBlock.dimension.width * this.randomizeSizeFactor
            height = prevBlock.dimension.height * this.randomizeSizeFactor
            depth = prevBlock.dimension.depth * this.randomizeSizeFactor

            x = prevBlock.position.x
            z = prevBlock.position.z

            if (shouldReplace === true) {
                y = prevBlock.position.y
                axis = prevBlock.axis
            } else {
                y = prevBlock.position.y + prevBlock.dimension.height
            }
        } else {
            width = blockConfig.initWidth
            height = blockConfig.initHeight
            depth = blockConfig.initDepth

            x = 0
            y = height
            z = 0
        }

        this.dimension = { width, height, depth }
        this.position = { x, y, z }

        // Set axis (x, y, or z)
        if (axis === null) {
            axis = Math.random() > 0.5 ? Axis.x : Axis.z
        }
        this.axis = axis

        // If there was a previous block AND we aren't replacing it, it will spawn MOVE_AMOUNT from center
        if (prevBlock && !shouldReplace) {
            this.position[axis] = (Math.random() > 0.5 ? 1 : -1) * this.MOVE_AMOUNT
        }

        // Set direction
        let speed = blockConfig.initSpeed + blockConfig.acceleration
        speed = Math.min(speed, blockConfig.maxSpeed) // Bound to a max speed
        this.speed = -speed
        this.direction = this.speed

        // Create block
        const geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth)
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2))

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
export class NormalBlock extends Block {
    private randomizeSpeedFactor: number

    // Special (fast blinking block)
    isSpecialFastBlock = false
    private isBlinked = false
    private blinkFreq = 300 // milliseconds
    private prevBlinkTime = 0
    private time = 0

    constructor(prevBlock: PrevBlock, shouldReplace = false) {
        super(prevBlock, shouldReplace)

        this.randomizeSpeedFactor = this.isSpecialFastBlock ? 2.2 : getRandomFloat(randomBlockSpeedFactorMin, randomBlockSpeedFactorMax)

        // A small chance that the block is a special fast one
        this.isSpecialFastBlock = getRandomFloat(0, 1) < chanceSpecialFastBlinking
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
        this.position[this.axis] += this.direction * (1 + boost) * (elapsedTime * (baseFrameRate / 1000)) * this.randomizeSpeedFactor
        this.mesh.position[this.axis] = this.position[this.axis]

        if (this.isSpecialFastBlock) {
            this.handleSpecialFastBlock(elapsedTime)
        }
    }

    // Make the block blink
    handleSpecialFastBlock(elapsedTime: number) {
        this.time += elapsedTime

        if (this.time - this.prevBlinkTime > this.blinkFreq) {
            const finalColor = this.isBlinked ? hexToRGB("#FFFFFF") : hexToRGB(colors.orange)

            this.materials.forEach((mat) => {
                new TWEEN.Tween({ r: mat.color.r, g: mat.color.g, b: mat.color.b })
                    .to({ r: finalColor.r / 255, g: finalColor.g / 255, b: finalColor.b / 255 }, this.blinkFreq * 0.9)
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

    constructor(prevBlock: PrevBlock, distance: number) {
        super(prevBlock, true, true)
        this.distance = distance
        this.speed *= 1.8
        this.direction = prevBlock.direction
    }

    tick() {
        this.position.y -= Math.abs(this.speed)
        this.mesh.rotation[this.axis === Axis.x ? Axis.z : Axis.x] +=
            (this.axis === Axis.x ? -1 : 1) * (this.direction / 6) * (-this.distance / Math.abs(this.distance))
        this.mesh.position.y = this.position.y
    }
}
