import { Box } from "@mui/material"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useGame } from "../../../containers"
import { useMiniMapPixi } from "../../../containers/minimapPixi"
import { calculateCoverDimensions } from "../../../helpers"
import { Dimension } from "../../../types"
import { MapMechs } from "./MiniMapItems/MapMechs/MapMechs"

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

export const MiniMapPixi = React.memo(function MiniMapPixi({ containerDimensions }: MiniMapPixiProps) {
    const { map } = useGame()
    const { pixiApp, pixiViewport, isPixiSetup, setIsPixiSetup } = useMiniMapPixi()
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)
    const mapSprite = useRef<PIXI.Sprite>()
    const line = useRef<PIXI.Graphics>()

    const setupPixi = useCallback(
        (mapRef: HTMLDivElement, dimension: Dimension) => {
            if (!pixiApp.current) {
                // Create pixi app
                pixiApp.current = new PIXI.Application({
                    backgroundColor: 0x0c0c1a,
                    width: dimension.width,
                    height: dimension.height,
                    resolution: window.devicePixelRatio || 1,
                })

                // Append pixi canvas to the DOM
                pixiApp.current.stage.sortableChildren = true
                mapRef.appendChild(pixiApp.current.view)
            }

            if (!pixiViewport.current) {
                // Create pixi viewport
                pixiViewport.current = new Viewport({
                    screenWidth: dimension.width,
                    screenHeight: dimension.height,
                    worldWidth: dimension.width,
                    worldHeight: dimension.height,
                    interaction: pixiApp.current.renderer.plugins.interaction,
                })

                // Configure pixi viewport
                pixiViewport.current
                    .drag()
                    .pinch()
                    .wheel({ percent: 0.1, smooth: 1 })
                    .decelerate({ friction: 0.9 })
                    .clamp({
                        direction: "all",
                        underflow: "center",
                    })
                    .clampZoom({
                        maxWidth: pixiViewport.current.screenWidth,
                        maxHeight: pixiViewport.current.screenHeight,
                        minWidth: 50,
                        minHeight: 50,
                    })

                pixiViewport.current.sortableChildren = true
                // Add pixi viewport to stage
                pixiApp.current.stage.addChild(pixiViewport.current)
            }

            setIsPixiSetup(true)
        },
        [pixiApp, pixiViewport, setIsPixiSetup],
    )

    // Setup the pixi app
    useEffect(() => {
        if (!miniMapPixiRef) return

        // Setup pixi app if not already setup
        if (!pixiApp.current || !pixiViewport.current) {
            setupPixi(miniMapPixiRef, containerDimensions)
        }

        if (pixiApp.current && pixiViewport.current) {
            // When parent container size changes, resize the renderer and viewport dimension
            pixiApp.current.renderer.resize(containerDimensions.width, containerDimensions.height)
            pixiViewport.current.resize(pixiApp.current.renderer.width, pixiApp.current.renderer.height)

            // Fit to cover
            if (pixiApp.current.renderer.width > pixiApp.current.renderer.height) {
                pixiViewport.current.fitWidth()
            } else {
                pixiViewport.current.fitHeight()
            }
            pixiViewport.current.moveCorner(0, 0)
        }
    }, [miniMapPixiRef, containerDimensions, setupPixi, pixiApp, pixiViewport])

    useEffect(() => {
        return () => {
            setIsPixiSetup(false)
            pixiViewport.current?.destroy({ children: true, texture: true, baseTexture: true })
            pixiApp.current?.destroy(true, { children: true, texture: true, baseTexture: true })
            pixiViewport.current = undefined
            pixiApp.current = undefined
        }
    }, [pixiApp, pixiViewport, setIsPixiSetup])

    // TODO: If we are popped out, we need to move the pixi canvas to the poppedout window

    // Update the map sprite when map is changed
    useEffect(() => {
        if (map?.Image_Url && isPixiSetup && pixiApp.current && pixiViewport.current) {
            const mapTexture = PIXI.Texture.from(map.Image_Url)

            // If map sprite isn't setup, then set it up
            if (!mapSprite.current) {
                mapSprite.current = PIXI.Sprite.from(mapTexture)
                mapSprite.current.x = 0
                mapSprite.current.y = 0
                mapSprite.current.zIndex = -10
                pixiViewport.current.addChild(mapSprite.current)
            }

            // Calculate the fit to cover dimension
            const dimension = calculateCoverDimensions(
                { width: map.Width, height: map.Height },
                {
                    width: pixiApp.current.renderer.width,
                    height: pixiApp.current.renderer.height,
                },
            )

            // Update pixi viewport world dimension
            pixiViewport.current.resize(pixiApp.current.renderer.width, pixiApp.current.renderer.height, dimension.width, dimension.height)

            // Update the map's dimension and texture
            mapSprite.current.width = dimension.width
            mapSprite.current.height = dimension.height
            mapSprite.current.texture = mapTexture

            // Draw a line around the pixi viewport for easy debug
            if (!line.current) {
                line.current = pixiViewport.current.addChild(new PIXI.Graphics())
                line.current.lineStyle(2, 0x000000, 0.1).drawRect(0, 0, pixiViewport.current.worldWidth, pixiViewport.current.worldHeight)
            }
            line.current.width = pixiViewport.current.worldWidth
            line.current.height = pixiViewport.current.worldHeight
        }
    }, [isPixiSetup, map, pixiApp, pixiViewport])

    return (
        <Box
            ref={setMiniMapPixiRef}
            sx={{
                position: "relative",
                width: containerDimensions.width,
                height: containerDimensions.height,
                overflow: "hidden",
            }}
        >
            <MapMechs />
        </Box>
    )
}, propsAreEqual)
