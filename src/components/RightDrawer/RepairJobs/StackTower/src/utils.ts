import * as THREE from "three"

export const isWebGLAvailable = () => {
    try {
        const canvas = document.createElement("canvas")
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
    } catch (e) {
        return false
    }
}

export const isWebGL2Available = () => {
    try {
        const canvas = document.createElement("canvas")
        return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"))
    } catch (e) {
        return false
    }
}

export const cover = (texture: THREE.Texture, aspect: number) => {
    if (!texture.image) return null

    texture.matrixAutoUpdate = false
    const imageAspect = texture.image.width / texture.image.height

    if (aspect < imageAspect) {
        texture.matrix.setUvTransform(0, 0, aspect / imageAspect, 1, 0, 0.5, 0.5)
    } else {
        texture.matrix.setUvTransform(0, 0, 1, imageAspect / aspect, 0, 0.5, 0.5)
    }
}
