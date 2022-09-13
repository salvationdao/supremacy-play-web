import * as PIXI from "pixi.js"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { pixiPanZoom } from "../helpers/pixiPanZoom"
import { useGame } from "./game"

export const MiniMapPixiContainer = createContainer(() => {
    const { map } = useGame()

    const [miniMapPixiApp, setMiniMapPixiApp] = useState<PIXI.Application>()
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)

    // Setup the pixi app
    useEffect(() => {
        if (!miniMapPixiRef) return

        const pixiApp = new PIXI.Application({
            backgroundColor: 0x0c0c1a,
            resolution: window.devicePixelRatio || 1,
        })

        pixiApp.stage.sortableChildren = true
        pixiPanZoom(pixiApp.view, pixiApp.stage)
        miniMapPixiRef.appendChild(pixiApp.view)
        setMiniMapPixiApp(pixiApp)
    }, [miniMapPixiRef])

    useEffect(() => {
        if (map?.Image_Url && miniMapPixiApp) {
            const mapImageSprite = PIXI.Sprite.from(map.Image_Url)
            mapImageSprite.position.set(0, 0)
            mapImageSprite.zIndex = -10
            mapImageSprite.width = map.Width
            mapImageSprite.height = map.Height
            miniMapPixiApp.stage.addChild(mapImageSprite)
        }
    }, [map, miniMapPixiApp])

    return { miniMapPixiApp, miniMapPixiRef, setMiniMapPixiRef }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
