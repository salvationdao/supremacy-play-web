import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { calculateCoverDimensions, HEXToVBColor } from "../../../../helpers"
import { Dimension, Map, Position } from "../../../../types"

export class PixiMiniMapPixi {
    app: PIXI.Application
    viewport: Viewport
    mapSprite: PIXI.Sprite | undefined
    isDragging = false

    private border: PIXI.Graphics | undefined
    private mapMousePosition: React.MutableRefObject<Position | undefined>

    constructor(mapRef: HTMLDivElement, mapMousePosition: React.MutableRefObject<Position | undefined>, dimension: Dimension) {
        this.mapMousePosition = mapMousePosition

        // Create pixi app
        this.app = new PIXI.Application({
            width: dimension.width,
            height: dimension.height,
            backgroundAlpha: 0,
        })

        // Append pixi canvas to the DOM
        this.app.stage.sortableChildren = true
        this.app.view.id = "minimap-pixi-canvas"
        mapRef.appendChild(this.app.view)

        // Create pixi viewport
        this.viewport = new Viewport({
            screenWidth: dimension.width,
            screenHeight: dimension.height,
            worldWidth: dimension.width,
            worldHeight: dimension.height,
            interaction: this.app.renderer.plugins.interaction,
        })

        // Configure pixi viewport
        this.viewport
            .drag()
            .pinch()
            .wheel({ percent: 0.1, smooth: 1 })
            .decelerate({ friction: 0.9 })
            .clamp({
                direction: "all",
                underflow: "center",
            })
            .on("drag-start", () => {
                this.isDragging = true
            })
            .on("drag-end", () => {
                this.isDragging = false
            })

        this.viewport.sortableChildren = true
        // Add pixi viewport to stage
        this.app.stage.addChild(this.viewport)
    }

    destroy() {
        this.viewport.destroy()
        this.app.destroy(true, true)
    }

    onParentSizeChange(containerDimensions: Dimension) {
        setTimeout(() => {
            // When parent container size changes, resize the renderer and viewport dimension
            this.app.renderer.resize(containerDimensions.width, containerDimensions.height)
            this.viewport.resize(containerDimensions.width, containerDimensions.height)

            // Clamp the zooming
            const maxWidth = this.app.renderer.width > this.app.renderer.height ? 10 * this.viewport.worldWidth : this.viewport.worldWidth
            const maxHeight = this.app.renderer.width < this.app.renderer.height ? 10 * this.viewport.worldHeight : this.viewport.worldHeight
            this.viewport.clampZoom({
                minWidth: 50,
                minHeight: 50,
                maxWidth,
                maxHeight,
            })

            // Fit to cover
            if (containerDimensions.width > containerDimensions.height) {
                this.viewport.fitWidth()
            } else {
                this.viewport.fitHeight()
            }
            this.viewport.moveCorner(0, 0)
        }, 0)
    }

    onMapChanged(map: Map) {
        if (map?.Image_Url) {
            const mapTexture = PIXI.Texture.from(map.Image_Url)

            // If map sprite isn't setup, then set it up
            if (!this.mapSprite) {
                this.mapSprite = PIXI.Sprite.from(mapTexture)
                this.mapSprite.x = 0
                this.mapSprite.y = 0
                this.mapSprite.zIndex = -10
                this.mapSprite.interactive = true
                this.viewport.addChild(this.mapSprite)
            }

            // Calculate the fit to cover dimension
            const coverDimension = calculateCoverDimensions(
                { width: map.Width, height: map.Height },
                {
                    width: this.app.renderer.width,
                    height: this.app.renderer.height,
                },
            )

            // Update pixi viewport world dimension
            this.viewport.resize(this.app.renderer.width, this.app.renderer.height, coverDimension.width, coverDimension.height)

            // Update the map's dimension and texture
            this.mapSprite.width = coverDimension.width
            this.mapSprite.height = coverDimension.height
            this.mapSprite.texture = mapTexture

            // Draw a line around the pixi viewport for easy debug
            if (!this.border) {
                this.border = this.viewport.addChild(new PIXI.Graphics())
                this.border.lineStyle(2, HEXToVBColor("#000000"), 0.1).drawRect(0, 0, this.viewport.worldWidth, this.viewport.worldHeight)
            }

            this.border.width = this.viewport.worldWidth
            this.border.height = this.viewport.worldHeight

            // Save the mouse position into ref
            this.mapSprite.removeListener("pointermove")
            this.mapSprite.on("pointermove", (event) => {
                this.mapMousePosition.current = this?.viewport.toLocal(event.data.global)
            })
        }
    }
}
