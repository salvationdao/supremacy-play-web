import { Box } from "@mui/material"
import * as PIXI from "pixi.js"
import React, { useEffect, useState } from "react"
import { PlayerAbilityPNG } from "../../../assets"
import { Dimension } from "../../../types"

// export const miniMapPixiApp = new PIXI.Application({
//     backgroundColor: 0x0c0c1a,
//     resolution: window.devicePixelRatio || 1,
// })

interface MiniMapPixiProps {
    containerDimensions: Dimension
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

const propsAreEqual = (prevProps: MiniMapPixiProps, nextProps: MiniMapPixiProps) => {
    return (
        prevProps.containerDimensions.width === nextProps.containerDimensions.width &&
        prevProps.containerDimensions.height === nextProps.containerDimensions.height
    )
}

export const MiniMapPixi = React.memo(function MiniMapPixi({ containerDimensions, poppedOutContainerRef }: MiniMapPixiProps) {
    const [miniMapPixiApp, setMiniMapPixiApp] = useState<PIXI.Application>()
    const [ref, setRef] = useState<HTMLDivElement | null>(null)

    // Setup the pixi app
    useEffect(() => {
        if (!ref) return

        const pixiApp = new PIXI.Application({
            backgroundColor: 0x0c0c1a,
            resolution: window.devicePixelRatio || 1,
        })

        ref.appendChild(pixiApp.view)

        const texture = PIXI.Texture.from(PlayerAbilityPNG)
        const bunny = new PIXI.Sprite(texture)

        // Setup the position of the bunny
        bunny.x = pixiApp.renderer.width / 2
        bunny.y = pixiApp.renderer.height / 2
        bunny.width = 100
        bunny.height = 100

        // Rotate around the center
        bunny.anchor.x = 0.5
        bunny.anchor.y = 0.5

        // Add the bunny to the scene we are building.
        pixiApp.stage.addChild(bunny)

        // Listen for frame updates
        pixiApp.ticker.add(() => {
            // each frame we spin the bunny around a bit
            bunny.rotation += 0.01
        })

        setMiniMapPixiApp(pixiApp)
    }, [ref])

    // Resize the pixi container based if parent container changed
    useEffect(() => {
        if (miniMapPixiApp) {
            miniMapPixiApp.renderer.resize(containerDimensions.width, containerDimensions.height)
        }
    }, [miniMapPixiApp, containerDimensions.width, containerDimensions.height])

    return (
        <Box
            ref={setRef}
            sx={{
                position: "relative",
                width: containerDimensions.width,
                height: containerDimensions.height,
                overflow: "hidden",
            }}
        />
    )
}, propsAreEqual)
