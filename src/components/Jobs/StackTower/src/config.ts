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
        intensity: 0.5,
        position: [0, 499, 0],
        color: 0xffffff,
    },
]
