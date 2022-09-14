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
    const { isPixiSetup, pixiViewport, pixiApp, setMiniMapPixiRef, setContainerDimensions } = useMiniMapPixi()

    useEffect(() => {
        setContainerDimensions(containerDimensions)
    }, [containerDimensions, setContainerDimensions])

    useEffect(() => {
        if (!isPixiSetup || !pixiApp.current || !pixiViewport.current) return

        const bunny = PIXI.Sprite.from(PlayerAbilityPNG)

        bunny.x = 200
        bunny.y = 200
        bunny.zIndex = 1
        bunny.width = 12
        bunny.height = 12
        bunny.anchor.x = 0.5
        bunny.anchor.y = 0.5

        pixiViewport.current.addChild(bunny)

        pixiApp.current.ticker.add(() => {
            bunny.rotation += 0.01
        })
    }, [isPixiSetup, pixiApp, pixiViewport])

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
