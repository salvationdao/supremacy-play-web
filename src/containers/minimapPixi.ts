import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { calculateCoverDimensions } from "../helpers"
import { Dimension } from "../types"
import { useGame } from "./game"

export const MiniMapPixiContainer = createContainer(() => {
    const { map } = useGame()

    const [containerDimensions, setContainerDimensions] = useState<Dimension>({ width: 0, height: 0 })
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)
    const [isPixiSetup, setIsPixiSetup] = useState(false)
    const pixiApp = useRef<PIXI.Application>()
    const pixiViewport = useRef<Viewport>()
    const mapSprite = useRef<PIXI.Sprite>()
    const line = useRef<PIXI.Graphics>()

    const setupPixi = useCallback((mapRef: HTMLDivElement, dimension: Dimension) => {
        if (!pixiApp.current) {
            pixiApp.current = new PIXI.Application({
                backgroundColor: 0x0c0c1a,
                width: dimension.width,
                height: dimension.height,
                resolution: window.devicePixelRatio || 1,
            })

            pixiApp.current.stage.sortableChildren = true
            mapRef.appendChild(pixiApp.current.view)
        }

        if (!pixiViewport.current) {
            pixiViewport.current = new Viewport({
                screenWidth: dimension.width,
                screenHeight: dimension.height,
                worldWidth: dimension.width,
                worldHeight: dimension.height,
                interaction: pixiApp.current.renderer.plugins.interaction,
            })

            pixiViewport.current.drag().pinch().wheel({ percent: 0.1, smooth: 1 }).decelerate({ friction: 0.9 })
            // .clamp({
            //     direction: "all",
            //     underflow: "center",
            // })
            // .clampZoom({
            //     maxWidth: dimension.width,
            //     maxHeight: dimension.height,
            // })

            pixiApp.current.stage.addChild(pixiViewport.current)
        }

        setIsPixiSetup(true)
    }, [])

    // Setup the pixi app
    useEffect(() => {
        if (!miniMapPixiRef) return

        if (!pixiApp.current || !pixiViewport.current) {
            setupPixi(miniMapPixiRef, containerDimensions)
        }

        if (pixiApp.current && pixiViewport.current) {
            pixiApp.current.renderer.resize(containerDimensions.width, containerDimensions.height)
            pixiViewport.current.resize(pixiApp.current.renderer.width, pixiApp.current.renderer.height)

            if (pixiApp.current.renderer.width > pixiApp.current.renderer.height) {
                pixiViewport.current.fitWidth()
            } else {
                pixiViewport.current.fitHeight()
            }
            pixiViewport.current.moveCorner(0, 0)
        }
    }, [miniMapPixiRef, containerDimensions, setupPixi])

    // useEffect(() => () => pixiApp.current?.destroy())

    // Update the map sprite when map is changed
    useEffect(() => {
        if (map?.Image_Url && isPixiSetup && pixiApp.current && pixiViewport.current) {
            const mapTexture = PIXI.Texture.from(map.Image_Url)

            // Setup map image background sprite
            if (!mapSprite.current) {
                mapSprite.current = PIXI.Sprite.from(mapTexture)
                mapSprite.current.x = 0
                mapSprite.current.y = 0
                mapSprite.current.zIndex = -10
                pixiViewport.current.addChild(mapSprite.current)
            }

            const dimension = calculateCoverDimensions(
                { width: map.Width, height: map.Height },
                {
                    width: pixiApp.current.renderer.width,
                    height: pixiApp.current.renderer.height,
                },
            )

            pixiViewport.current.resize(pixiApp.current.renderer.width, pixiApp.current.renderer.height, dimension.width, dimension.height)

            if (!line.current) {
                line.current = pixiViewport.current.addChild(new PIXI.Graphics())
                line.current.lineStyle(5, 0xff00ff, 0.5).drawRect(0, 0, pixiViewport.current.worldWidth, pixiViewport.current.worldHeight)
            }

            line.current.width = pixiViewport.current.worldWidth
            line.current.height = pixiViewport.current.worldHeight

            mapSprite.current.width = dimension.width
            mapSprite.current.height = dimension.height
            mapSprite.current.texture = mapTexture

            // pixiViewport.current.fit()
        }
    }, [map, isPixiSetup])

    return { pixiViewport, pixiApp, miniMapPixiRef, setMiniMapPixiRef, setContainerDimensions }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
