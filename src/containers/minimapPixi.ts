import * as PIXI from "pixi.js"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
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
        miniMapPixiRef.appendChild(pixiApp.view)
        setMiniMapPixiApp(pixiApp)
    }, [miniMapPixiRef])

    useEffect(() => {
        if (map?.Image_Url && miniMapPixiApp) {
            // miniMapPixiApp.loader
            //     .add([
            //         {
            //             name: "mapImage",
            //             url: "https://ninjasoftware-static-media.s3.ap-southeast-2.amazonaws.com/supremacy/maps/desert_city.jpg",
            //         },
            //     ])
            //     .load(function () {
            //         const sprite = new PIXI.Sprite(miniMapPixiApp.loader.resources.mapImage.texture)

            //         sprite.scale.x = 0.4
            //         sprite.scale.y = 0.4
            //         sprite.anchor.x = 0.5
            //         sprite.anchor.y = 0.5
            //         sprite.x = 200
            //         sprite.y = 200

            //         miniMapPixiApp.stage.addChild(sprite)
            //     })

            const mapImageSprite = PIXI.Sprite.from(map.Image_Url)

            mapImageSprite.x = 0
            mapImageSprite.y = 0
            mapImageSprite.zIndex = -10
            mapImageSprite.width = miniMapPixiApp.renderer.width
            mapImageSprite.height = miniMapPixiApp.renderer.height

            miniMapPixiApp.stage.addChild(mapImageSprite)
        }
    }, [map?.Image_Url, miniMapPixiApp])

    return { miniMapPixiApp, miniMapPixiRef, setMiniMapPixiRef }
})

export const MiniMapPixiProvider = MiniMapPixiContainer.Provider
export const useMiniMapPixi = MiniMapPixiContainer.useContainer
