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

export const skins: Skin[] = [
    {
        top: Stack1aJPG,
        front: Stack1bJPG,
        right: Stack1cJPG,
    },
    {
        top: Stack2aJPG,
        front: Stack2bJPG,
        right: Stack2cJPG,
    },
    {
        top: Stack3aJPG,
        front: Stack3bJPG,
        right: Stack3cJPG,
    },
    {
        top: Stack4aJPG,
        front: Stack4bJPG,
        right: Stack4cJPG,
    },
    {
        top: Stack5aJPG,
        front: Stack5bJPG,
        right: Stack5cJPG,
    },
    {
        top: Stack6aJPG,
        front: Stack6bJPG,
        right: Stack6cJPG,
    },
    {
        top: Stack7aJPG,
        front: Stack7bJPG,
        right: Stack7cJPG,
    },
    {
        top: Stack8aJPG,
        front: Stack8bJPG,
        right: Stack8cJPG,
    },
    {
        top: Stack9aJPG,
        front: Stack9bJPG,
        right: Stack9cJPG,
    },
    {
        top: Stack10aJPG,
        front: Stack10bJPG,
        right: Stack10cJPG,
    },
]

export const baseFrameRate = 144

export const blockConfig = {
    initHeight: 2, // initial height of the box (y axis)
    initSpeed: 0.08, // initial moving speed
    acceleration: 0.005, // the acceleration, the box should move faster and faster
    maxSpeed: 3, // the upper bound of the box's speed
    blinkFrequency: 180, // milliseconds
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
    front: string
    right: string
}
