import * as particles from "pixi-particles"

export const blackoutParticlesConfig: particles.EmitterConfig | particles.OldEmitterConfig = {
    alpha: {
        start: 0.8,
        end: 0.3,
    },
    scale: {
        start: 0.5,
        end: 0.1,
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
