// Use this so design the particle effects
// https://pixijs.io/pixi-particles-editor/#

export const ringCloudParticlesConfig = {
    alpha: {
        start: 0.8,
        end: 0.3,
    },
    scale: {
        start: 0.25,
        end: 0.05,
        minimumScaleMultiplier: 1,
    },
    color: {
        start: "#000000",
        end: "#000000",
    },
    speed: {
        start: 5,
        end: 10,
        minimumSpeedMultiplier: 0.5,
    },
    acceleration: {
        x: 0,
        y: 0,
    },
    maxSpeed: 0,
    startRotation: {
        min: 0,
        max: 360,
    },
    noRotation: false,
    rotationSpeed: {
        min: 0,
        max: 0,
    },
    lifetime: {
        min: 0.001,
        max: 3,
    },
    blendMode: "normal",
    frequency: 0.001,
    emitterLifetime: -1,
    maxParticles: 500,
    pos: {
        x: 0,
        y: 0,
    },
    addAtBack: false,
    spawnType: "ring",
    spawnCircle: {
        x: 0,
        y: 0,
        r: 120,
        minR: 120,
    },
}

export const pulseParticlesConfig = {
    alpha: {
        start: 0.9,
        end: 0.1,
    },
    scale: {
        start: 1,
        end: 0.3,
        minimumScaleMultiplier: 1,
    },
    color: {
        start: "#1858a1",
        end: "#5d9ce3",
    },
    speed: {
        start: 200,
        end: 200,
        minimumSpeedMultiplier: 1,
    },
    acceleration: {
        x: 0,
        y: 0,
    },
    maxSpeed: 0,
    startRotation: {
        min: 0,
        max: 0,
    },
    noRotation: false,
    rotationSpeed: {
        min: 0,
        max: 0,
    },
    lifetime: {
        min: 0.8,
        max: 0.8,
    },
    blendMode: "normal",
    frequency: 0.3,
    emitterLifetime: -1,
    maxParticles: 1000,
    pos: {
        x: 0,
        y: 0,
    },
    addAtBack: false,
    spawnType: "burst",
    particlesPerWave: 18,
    particleSpacing: 20,
    angleStart: 0,
}

export const explosionParticlesConfig = {
    alpha: {
        start: 0.8,
        end: 0.4,
    },
    scale: {
        start: 0.3,
        end: 0.09,
        minimumScaleMultiplier: 1,
    },
    color: {
        start: "#fb1010",
        end: "#f5b830",
    },
    speed: {
        start: 200,
        end: 100,
        minimumSpeedMultiplier: 1,
    },
    acceleration: {
        x: 0,
        y: 0,
    },
    maxSpeed: 0,
    startRotation: {
        min: 0,
        max: 360,
    },
    noRotation: false,
    rotationSpeed: {
        min: 0,
        max: 0,
    },
    lifetime: {
        min: 0.2,
        max: 0.2,
    },
    blendMode: "normal",
    frequency: 0.005,
    emitterLifetime: 0.45,
    maxParticles: 1000,
    pos: {
        x: 0,
        y: 0,
    },
    addAtBack: false,
    spawnType: "circle",
    spawnCircle: {
        x: 0,
        y: 0,
        r: 10,
    },
}
