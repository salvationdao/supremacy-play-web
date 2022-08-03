import {
    Stack1aPNG,
    Stack1bPNG,
    Stack1cPNG,
    Stack2aPNG,
    Stack2bPNG,
    Stack2cPNG,
    Stack3aPNG,
    Stack3bPNG,
    Stack3cPNG,
    Stack4aPNG,
    Stack4bPNG,
    Stack4cPNG,
    Stack5aPNG,
    Stack5bPNG,
    Stack5cPNG,
    Stack6aPNG,
    Stack6bPNG,
    Stack6cPNG,
    Stack7aPNG,
    Stack7bPNG,
    Stack7cPNG,
    Stack8aPNG,
    Stack8bPNG,
    Stack8cPNG,
    Stack9aPNG,
    Stack9bPNG,
    Stack9cPNG,
    Stack10aPNG,
    Stack10bPNG,
    Stack10cPNG,
} from "../../../../../assets"

export const blockConfig = {
    initWidth: 10, // Initial width of the box (x axis)
    initHeight: 2, // Initial height of the box (y axis)
    initDepth: 10, // Initial depth of the box (z axis)
    initSpeed: 0.1, // Initial moving speed
    acceleration: 0.005, // The acceleration, the box should move faster and faster
    maxSpeed: 2, // The upper bound of the box's speed
}

export const cameraConfig = {
    depth: 20,
    near: -100,
    far: 1000,
    position: [2, 2, 2],
    lookAt: [0, 0, 0],
}

export const lightsConfig = [
    {
        type: "DirectionalLight",
        intensity: 1,
        position: [0, 499, 0],
        color: 0xffffff,
    },
]

export interface Skin {
    top: string
    left: string
    bottom: string
}

export const skins: Skin[] = [
    {
        top: Stack1aPNG,
        left: Stack1bPNG,
        bottom: Stack1cPNG,
    },
    {
        top: Stack2aPNG,
        left: Stack2bPNG,
        bottom: Stack2cPNG,
    },
    {
        top: Stack3aPNG,
        left: Stack3bPNG,
        bottom: Stack3cPNG,
    },
    {
        top: Stack4aPNG,
        left: Stack4bPNG,
        bottom: Stack4cPNG,
    },
    {
        top: Stack5aPNG,
        left: Stack5bPNG,
        bottom: Stack5cPNG,
    },
    {
        top: Stack6aPNG,
        left: Stack6bPNG,
        bottom: Stack6cPNG,
    },
    {
        top: Stack7aPNG,
        left: Stack7bPNG,
        bottom: Stack7cPNG,
    },
    {
        top: Stack8aPNG,
        left: Stack8bPNG,
        bottom: Stack8cPNG,
    },
    {
        top: Stack9aPNG,
        left: Stack9bPNG,
        bottom: Stack9cPNG,
    },
    {
        top: Stack10aPNG,
        left: Stack10bPNG,
        bottom: Stack10cPNG,
    },
]
