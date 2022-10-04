import { ease } from "pixi-ease"
import * as PIXI from "pixi.js"
import { pixiViewportZIndexes } from "../../../../../containers"
import { deg2rad, HEXToVBColor } from "../../../../../helpers"
import { HiveHexLocations } from "../../../../../types/hive"
import { Vector2i } from "./../../../../../types/game"

const HEX_SIZE = 40

export class PixiHiveStatus {
    root: PIXI.Container<PIXI.DisplayObject>
    private hiveStatus: React.MutableRefObject<boolean[]>
    private hexagons: PixiHexagonTile[] = []
    private animationFrame: number | undefined

    constructor(
        hiveStatus: React.MutableRefObject<boolean[]>,
        clientPositionToViewportPosition: React.MutableRefObject<
            (
                x: number,
                y: number,
            ) => {
                x: number
                y: number
            }
        >,
        mapScalingRef: React.MutableRefObject<Vector2i>,
    ) {
        this.hiveStatus = hiveStatus

        // Create container for everything
        this.root = new PIXI.Container()
        this.root.zIndex = pixiViewportZIndexes.hiveStatus
        this.root.sortableChildren = true

        for (let i = 0; i < HiveHexLocations.length; i++) {
            const hex = HiveHexLocations[i]
            const { x, y } = clientPositionToViewportPosition.current(hex.x, hex.y)
            const hexagon = new PixiHexagonTile(HEX_SIZE * mapScalingRef.current.x, x, y, hex.yaw, !!hex.half)
            this.root.addChild(hexagon.root)
            this.hexagons.push(hexagon)
        }

        this.render()
    }

    destroy() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame)
        this.root.destroy()
    }

    render() {
        const step = () => {
            for (let index = 0; index < this.hiveStatus.current.length; index++) {
                const hexTile = this.hexagons[index]
                const raised = this.hiveStatus.current[index]

                if (hexTile) {
                    ease.add(hexTile.root, { alpha: raised ? 0.9 : 0 }, { duration: 700, ease: "linear", removeExisting: true })
                }
            }

            this.animationFrame = requestAnimationFrame(step)
        }
        this.animationFrame = requestAnimationFrame(step)
    }
}

class PixiHexagonTile {
    root: PIXI.Graphics

    constructor(radius: number, x: number, y: number, yaw: number, half: boolean) {
        const height = radius * Math.sqrt(3)
        this.root = new PIXI.Graphics()
        this.root.beginFill(HEXToVBColor("#000000"))

        if (half) {
            this.root.drawPolygon([radius, 0, radius / 2, -height / 2, -radius / 2, -height / 2, -radius, 0])
            this.root.rotation = deg2rad(yaw + 90)
        } else {
            this.root.drawPolygon([-radius, 0, -radius / 2, height / 2, radius / 2, height / 2, radius, 0, radius / 2, -height / 2, -radius / 2, -height / 2])
            this.root.rotation = deg2rad(yaw)
        }

        this.root.endFill()
        this.root.alpha = 0
        this.root.x = x
        this.root.y = y
    }
}
