import { Box } from "@mui/material"
import * as PIXI from "pixi.js"
import React, { useEffect } from "react"
import { PlayerAbilityPNG } from "../../../assets"
import { useMiniMapPixi } from "../../../containers/minimapPixi"
import { Dimension } from "../../../types"

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
    const { miniMapPixiApp, setMiniMapPixiRef, setContainerDimensions } = useMiniMapPixi()

    useEffect(() => {
        setContainerDimensions(containerDimensions)
    }, [containerDimensions, setContainerDimensions])

    useEffect(() => {
        if (!miniMapPixiApp) return

        const bunny = PIXI.Sprite.from(PlayerAbilityPNG)

        bunny.x = miniMapPixiApp.renderer.width / 2
        bunny.y = miniMapPixiApp.renderer.height / 2
        bunny.zIndex = 1
        bunny.width = 100
        bunny.height = 100
        bunny.anchor.x = 0.5
        bunny.anchor.y = 0.5

        miniMapPixiApp.stage.addChild(bunny)

        miniMapPixiApp.ticker.add(() => {
            bunny.rotation += 0.01
        })
    }, [miniMapPixiApp])

    return (
        <Box
            ref={setMiniMapPixiRef}
            sx={{
                position: "relative",
                width: containerDimensions.width,
                height: containerDimensions.height,
                overflow: "hidden",
            }}
        />
    )
}, propsAreEqual)
