import * as THREE from "three"
import { clamp } from "three/src/math/MathUtils"
import { baseFrameRate, blockConfig, skins } from "./config"
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

    constructor(prevBlock?: PrevBlock, shouldReplace = false, isFalling = false) {
        // This is how far away to spawn from the center of the stacks (spawn loc)
        this.MOVE_AMOUNT = 20
        let axis = null

        // Set the dimension and position from the target block, or defaults.
        let height, width, depth
        let x, y, z

        if (prevBlock) {
            width = prevBlock.dimension.width
            height = prevBlock.dimension.height
            depth = prevBlock.dimension.depth

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
            axis = Math.random() < 0.5 ? Axis.x : Axis.z
        }
        this.axis = axis

        // If there was a previous block AND we aren't replacing it, it will spawn MOVE_AMOUNT from center
        if (prevBlock && !shouldReplace) {
            this.position[axis] = (Math.random() < 0.5 ? 1 : -1) * this.MOVE_AMOUNT
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

        const materials = [
            rightMaterial, // Right
            rightMaterial, // Right opposite
            topMaterial, // Top
            topMaterial, // Top opposite
            frontMaterial, // Front
            frontMaterial, // Front opposite
        ]

        this.mesh = new THREE.Mesh(geometry, materials)
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
    constructor(prevBlock: PrevBlock, shouldReplace = false) {
        super(prevBlock, shouldReplace)
    }

    reverseDirection() {
        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed)
    }

    tick(speed = 0, elapsedTime: number) {
        const value = this.position[this.axis]
        if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT) {
            this.reverseDirection()
            this.position[this.axis] = clamp(-this.MOVE_AMOUNT + 1, value, this.MOVE_AMOUNT - 1)
        }
        this.position[this.axis] += this.direction * (1 + speed) * (elapsedTime * (baseFrameRate / 1000))
        this.mesh.position[this.axis] = this.position[this.axis]
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
