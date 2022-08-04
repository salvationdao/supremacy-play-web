import * as THREE from "three"
import { getRandomColor } from "../../../../../helpers"
import { blockConfig, skins } from "./config"

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

export class Block {
    MOVE_AMOUNT: number
    direction: number
    speed: number
    dimension: Dimension
    position: Position
    color: THREE.Color
    colorOffset: number
    axis: string | null
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[]>
    topTexture: THREE.Texture
    leftTexture: THREE.Texture
    bottomTexture: THREE.Texture

    constructor(
        lastBlock?: {
            dimension: Dimension
            position: Position
            color: THREE.Color
            axis: string | null
            topTexture: THREE.Texture
            leftTexture: THREE.Texture
            bottomTexture: THREE.Texture
        },
        shouldReplace = false,
        isFalling = false,
    ) {
        this.MOVE_AMOUNT = 12

        this.speed = 0
        this.direction = 0
        this.dimension = { width: 0, height: 0, depth: 0 }
        this.position = { x: 0, y: 0, z: 0 }
        let color = null
        let axis = null

        // set the dimensions from the target block, or defaults.
        let height, width, depth
        let x, y, z

        if (lastBlock) {
            width = lastBlock.dimension.width
            height = lastBlock.dimension.height
            depth = lastBlock.dimension.depth

            x = lastBlock.position.x
            z = lastBlock.position.z

            if (shouldReplace === true) {
                y = lastBlock.position.y

                color = lastBlock.color.getHex()
                axis = lastBlock.axis
            } else {
                y = lastBlock.position.y + blockConfig.initHeight
            }
        } else {
            width = blockConfig.initWidth
            height = blockConfig.initHeight
            depth = blockConfig.initDepth

            x = 0
            y = height
            z = 0
        }

        this.dimension.width = width
        this.dimension.height = height
        this.dimension.depth = depth

        this.position.x = x
        this.position.y = y
        this.position.z = z

        if (axis === null) {
            const random = Math.random()
            axis = random < 0.5 ? "x" : "z"
        }
        this.axis = axis

        if (lastBlock && !shouldReplace) {
            this.position[axis as keyof typeof this.position] = (Math.random() > 0.5 ? 1 : -1) * this.MOVE_AMOUNT
        }

        this.colorOffset = Math.round(Math.random() * 100)

        // set color
        this.color = new THREE.Color(color || getRandomColor()) //new THREE.Color(color || Math.random() * 0xffffff )

        // set direction
        let speed = blockConfig.initSpeed + blockConfig.acceleration
        speed = Math.min(speed, blockConfig.maxSpeed)
        this.speed = -speed
        this.direction = this.speed

        // create block
        const geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth)
        geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2))

        // handle skin
        if (lastBlock && shouldReplace) {
            this.topTexture = lastBlock.topTexture
            this.leftTexture = lastBlock.leftTexture
            this.bottomTexture = lastBlock.bottomTexture

            if (!isFalling) {
                this.cover(this.topTexture, this.dimension.width / this.dimension.depth)
                this.cover(this.leftTexture, this.dimension.width / this.dimension.height)
                this.cover(this.bottomTexture, this.dimension.depth / this.dimension.height)
            }
        } else {
            // loading the texture from image
            const skin = this.getRandomSkin()
            const textureLoader = new THREE.TextureLoader()
            this.topTexture = textureLoader.load(skin.top, () => this.cover(this.topTexture, this.dimension.width / this.dimension.depth))
            this.leftTexture = textureLoader.load(skin.left, () => this.cover(this.leftTexture, this.dimension.width / this.dimension.height))
            this.bottomTexture = textureLoader.load(skin.bottom, () => this.cover(this.bottomTexture, this.dimension.depth / this.dimension.height))
        }

        // define materials from texture
        const topMaterial = new THREE.MeshBasicMaterial({ map: this.topTexture })
        const leftMaterial = new THREE.MeshBasicMaterial({ map: this.leftTexture })
        const bottomMaterial = new THREE.MeshBasicMaterial({ map: this.bottomTexture })

        const materials = [
            bottomMaterial, // bottom
            bottomMaterial, // bottom opposite
            topMaterial, // top
            topMaterial, // top opposite
            leftMaterial, // left
            leftMaterial, // left opposite
        ]

        this.mesh = new THREE.Mesh(geometry, materials)
        this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    }

    getRandomSkin() {
        return skins[Math.floor(Math.random() * skins.length)]
    }

    cover(texture: THREE.Texture, aspect: number) {
        if (!texture.image) return null

        texture.matrixAutoUpdate = false
        const imageAspect = texture.image.width / texture.image.height

        if (aspect < imageAspect) {
            texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5)
        } else {
            texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5)
        }
    }

    getAxis() {
        let dimensionAlongAxis = null
        switch (this.axis) {
            case "x":
                dimensionAlongAxis = "width"
                break
            case "z":
                dimensionAlongAxis = "depth"
                break
        }
        return {
            axis: this.axis,
            dimensionAlongAxis,
        }
    }
}

export class NormalBlock extends Block {
    constructor(
        lastBlock: {
            dimension: Dimension
            position: Position
            color: THREE.Color
            axis: string | null
            topTexture: THREE.Texture
            leftTexture: THREE.Texture
            bottomTexture: THREE.Texture
        },
        shouldReplace = false,
    ) {
        super(lastBlock, shouldReplace)
    }

    reverseDirection() {
        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed)
    }

    tick(speed = 0) {
        const value = this.position[this.axis as keyof typeof this.position]
        if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT) {
            this.reverseDirection()
        }

        this.position[this.axis as keyof typeof this.position] += this.direction + this.direction * speed
        this.mesh.position[this.axis as keyof typeof this.position] = this.position[this.axis as keyof typeof this.position]
    }
}

export class FallingBlock extends Block {
    constructor(lastBlock: {
        dimension: Dimension
        position: Position
        color: THREE.Color
        axis: string | null
        topTexture: THREE.Texture
        leftTexture: THREE.Texture
        bottomTexture: THREE.Texture
    }) {
        super(lastBlock, true, true)
        this.speed *= 2
        this.direction = this.speed
    }

    tick() {
        this.position.y -= Math.abs(this.direction)
        this.mesh.rotation.z += this.direction / 6
        this.mesh.position.y = this.position.y
    }
}
