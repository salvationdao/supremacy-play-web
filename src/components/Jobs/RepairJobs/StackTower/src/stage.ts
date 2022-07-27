import gsap from "gsap"
import * as THREE from "three"
import { cameraConfig, lightsConfig } from "./config"

export class Stage {
    container: HTMLElement | null
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.OrthographicCamera

    constructor(backgroundColor = "#D0CBC7") {
        // container
        this.container = document.getElementById("game")
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

        //light
        lightsConfig.forEach((lightConfig) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const LightClass = THREE[lightConfig.type as keyof typeof THREE] as any
            if (LightClass) {
                const light = new LightClass(lightConfig.color, lightConfig.intensity)
                light.position.fromArray(lightConfig.position)
                this.scene.add(light)
            }
        })

        window.addEventListener("resize", () => this.onResize())
        this.onResize()
    }

    setCamera(y: number, speed = 0.3) {
        gsap.to(this.camera.position, { duration: speed, y: y + 4, ease: "power1.easeInOut" })
        gsap.to(this.camera.lookAt, { duration: speed, y: y, ease: "power1.easeInOut" })
    }

    onResize() {
        const width = this.container?.clientWidth || 200
        const height = this.container?.clientHeight || 200
        const viewSize = 30
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
