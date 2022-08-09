import gsap from "gsap"
import * as THREE from "three"
import { StackTowerBackgroundJPG } from "../../../../../assets"
import { cameraConfig, lightsConfig } from "./config"
import { cover } from "./utils"

const BACKGROUND_DEPTH = 100
const BACKGROUND_WIDTH = 40
const BACKGROUND_HEIGHT = 218.15

export class Stage {
    container: HTMLElement | null
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.OrthographicCamera

    constructor(container: HTMLElement | null, backgroundColor = "#D0CBC7") {
        // container
        this.container = container
        const width = this.container?.clientWidth || 200
        const height = this.container?.clientHeight || 200

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
        })

        this.renderer.setSize(width, height)
        this.renderer.setClearColor(backgroundColor, 1)
        this.container && this.container.appendChild(this.renderer.domElement)

        // scene
        this.scene = new THREE.Scene()

        // camera
        const aspect = width / height
        const depth = cameraConfig.depth
        this.camera = new THREE.OrthographicCamera(-depth * aspect, depth * aspect, depth, -depth, cameraConfig.near, cameraConfig.far)
        this.camera.position.fromArray(cameraConfig.position)
        this.camera.lookAt(new THREE.Vector3().fromArray(cameraConfig.lookAt))

        // light
        lightsConfig.forEach((lightConfig) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const LightClass = THREE[lightConfig.type as keyof typeof THREE] as any
            if (LightClass) {
                const light = new LightClass(lightConfig.color, lightConfig.intensity)
                light.position.fromArray(lightConfig.position)
                this.scene.add(light)
            }
        })

        // tiling background image
        const textureLoader = new THREE.TextureLoader()
        const backgroundTexture = textureLoader.load(StackTowerBackgroundJPG, () => {
            cover(backgroundTexture, BACKGROUND_WIDTH / BACKGROUND_HEIGHT)
            const backgroundMaterial = new THREE.SpriteMaterial({ map: backgroundTexture })
            const backgroundSprite = new THREE.Sprite(backgroundMaterial)
            backgroundSprite.scale.set(BACKGROUND_WIDTH, BACKGROUND_HEIGHT, 1)
            backgroundSprite.position.set(-BACKGROUND_DEPTH, BACKGROUND_HEIGHT / 2 - BACKGROUND_DEPTH + 10, -BACKGROUND_DEPTH)
            this.add(backgroundSprite)
        })

        // set listener
        window.addEventListener("resize", () => this.onResize())
        this.onResize()
    }

    setCamera(y: number, speed = 0.3) {
        const height = this.container?.clientHeight || 200
        let yOffset = 3

        if (height < 350) {
            yOffset -= 10
        } else if (height < 450) {
            yOffset -= 8
        } else if (height < 550) {
            yOffset -= 5
        } else if (height < 612) {
            yOffset -= 3
        }
        gsap.to(this.camera.position, { duration: speed, y: y + yOffset, ease: "power1.easeInOut" })
        gsap.to(this.camera.lookAt, { duration: speed, y: y, ease: "power1.easeInOut" })
    }

    onResize() {
        const width = this.container?.clientWidth || 200
        const height = this.container?.clientHeight || 200
        const viewSize = 30
        console.log({ height })
        this.renderer.setSize(width, height)
        this.camera.left = width / -viewSize
        this.camera.right = width / viewSize
        this.camera.top = height / viewSize
        this.camera.bottom = height / -viewSize
        this.camera.updateProjectionMatrix()
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    add(elem: THREE.Object3D<THREE.Event>) {
        this.scene.add(elem)
    }

    remove(elem: THREE.Object3D<THREE.Event>) {
        this.scene.remove(elem)
    }
}
