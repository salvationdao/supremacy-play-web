import {
    Stack1aJPG,
    Stack1bJPG,
    Stack1cJPG,
    Stack2aJPG,
    Stack2bJPG,
    Stack2cJPG,
    Stack3aJPG,
    Stack3bJPG,
    Stack3cJPG,
    Stack4aJPG,
    Stack4bJPG,
    Stack4cJPG,
    Stack5aJPG,
    Stack5bJPG,
    Stack5cJPG,
    Stack6aJPG,
    Stack6bJPG,
    Stack6cJPG,
    Stack7aJPG,
    Stack7bJPG,
    Stack7cJPG,
    Stack8aJPG,
    Stack8bJPG,
    Stack8cJPG,
    Stack9aJPG,
    Stack9bJPG,
    Stack9cJPG,
    Stack10aJPG,
    Stack10bJPG,
    Stack10cJPG,
} from "../../../../../assets"

export const blockConfig = {
    initWidth: 10, // Initial width of the box (x axis)
    initHeight: 2, // Initial height of the box (y axis)
    initDepth: 10, // Initial depth of the box (z axis)
    initSpeed: 0.08, // Initial moving speed
    acceleration: 0.005, // The acceleration, the box should move faster and faster
    maxSpeed: 3, // The upper bound of the box's speed
}

export const cameraConfig = {
    depth: 20,
    near: -100,
    far: 1000,
    position: [2, 2, 2],
    lookAt: [0, 0, 0],
    offsetY: 10,
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
        top: Stack1aJPG,
        left: Stack1bJPG,
        bottom: Stack1cJPG,
    },
    {
        top: Stack2aJPG,
        left: Stack2bJPG,
        bottom: Stack2cJPG,
    },
    {
        top: Stack3aJPG,
        left: Stack3bJPG,
        bottom: Stack3cJPG,
    },
    {
        top: Stack4aJPG,
        left: Stack4bJPG,
        bottom: Stack4cJPG,
    },
    {
        top: Stack5aJPG,
        left: Stack5bJPG,
        bottom: Stack5cJPG,
    },
    {
        top: Stack6aJPG,
        left: Stack6bJPG,
        bottom: Stack6cJPG,
    },
    {
        top: Stack7aJPG,
        left: Stack7bJPG,
        bottom: Stack7cJPG,
    },
    {
        top: Stack8aJPG,
        left: Stack8bJPG,
        bottom: Stack8cJPG,
    },
    {
        top: Stack9aJPG,
        left: Stack9bJPG,
        bottom: Stack9cJPG,
    },
    {
        top: Stack10aJPG,
        left: Stack10bJPG,
        bottom: Stack10cJPG,
    },
]
