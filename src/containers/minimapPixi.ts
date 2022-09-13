import * as PIXI from "pixi.js"
import { useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { calculateCoverDimensions } from "../helpers"
import { pixiPanZoom } from "../helpers/pixiPanZoom"
import { Dimension } from "../types"
import { useGame } from "./game"

export const MiniMapPixiContainer = createContainer(() => {
    const { map } = useGame()

    const [containerDimensions, setContainerDimensions] = useState<Dimension>({ width: 0, height: 0 })
    const [miniMapPixiApp, setMiniMapPixiApp] = useState<PIXI.Application>()
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)
    const mapSprite = useRef<PIXI.Sprite>()

    // Setup the pixi app
    useEffect(() => {
        if (!miniMapPixiRef) return

        const pixiApp = new PIXI.Application({
            backgroundColor: 0x0c0c1a,
            resolution: window.devicePixelRatio || 1,
        })

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
        pixiApp.stage.sortableChildren = true
        pixiPanZoom(pixiApp.view, pixiApp.stage)
        miniMapPixiRef.appendChild(pixiApp.view)
        setMiniMapPixiApp(pixiApp)
    }, [miniMapPixiRef])

    // Resize the pixi container based if parent container changed
    useEffect(() => {
        if (miniMapPixiApp) {
            miniMapPixiApp.renderer.resize(containerDimensions.width, containerDimensions.height)
        }
    }, [miniMapPixiApp, containerDimensions])

    // Update the map sprite
    useEffect(() => {
        if (map?.Image_Url && miniMapPixiApp) {
            const dimension = calculateCoverDimensions({ width: map.Width, height: map.Height }, containerDimensions)
            const mapTexture = PIXI.Texture.from(map.Image_Url)

            if (!mapSprite.current) {
                mapSprite.current = PIXI.Sprite.from(map.Image_Url)
                miniMapPixiApp.stage.addChild(mapSprite.current)
            }

            mapSprite.current.texture = mapTexture
            mapSprite.current.x = 0
            mapSprite.current.y = 0
            mapSprite.current.zIndex = -10
            mapSprite.current.width = dimension.width
            mapSprite.current.height = dimension.height
        }
    }, [map, miniMapPixiApp, containerDimensions])

    return { miniMapPixiApp, miniMapPixiRef, setMiniMapPixiRef, setContainerDimensions }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
