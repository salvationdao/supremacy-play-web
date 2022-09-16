import { Box } from "@mui/material"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useGame } from "../../../containers"
import { useMiniMapPixi } from "../../../containers/minimapPixi"
import { calculateCoverDimensions, HEXToVBColor } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { Dimension } from "../../../types"
import { MechAbilities } from "./OverlayItems/MechAbilities/MechAbilities"
import { MapMechs } from "./ViewportItems/MapMechs/MapMechs"

interface PixiItems {
    mapSprite?: PIXI.Sprite
    border?: PIXI.Graphics
}

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
    const { pixiMainItems, setPixiMainItems, setHighlightedMechParticipantID } = useMiniMapPixi()
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)
    const pixiItems = useRef<PixiItems>({})
    const isDragging = useRef(false)

    const setupPixi = useCallback(
        (mapRef: HTMLDivElement, dimension: Dimension) => {
            if (pixiMainItems) return

            // Create pixi app
            const app = new PIXI.Application({
                backgroundColor: HEXToVBColor(colors.darkNavyBlue),
                width: dimension.width,
                height: dimension.height,
                resolution: window.devicePixelRatio || 1,
            })

            // Append pixi canvas to the DOM
            app.stage.sortableChildren = true
            mapRef.appendChild(app.view)

            // Create pixi viewport
            const viewport = new Viewport({
                screenWidth: dimension.width,
                screenHeight: dimension.height,
                worldWidth: dimension.width,
                worldHeight: dimension.height,
                interaction: app.renderer.plugins.interaction,
            })

            // Configure pixi viewport
            viewport
                .drag()
                .pinch()
                .wheel({ percent: 0.1, smooth: 1 })
                .decelerate({ friction: 0.9 })
                .clamp({
                    direction: "all",
                    underflow: "center",
                })
                .clampZoom({
                    maxWidth: viewport.screenWidth,
                    maxHeight: viewport.screenHeight,
                    minWidth: 50,
                    minHeight: 50,
                })
                .on("drag-start", () => {
                    isDragging.current = true
                })
                .on("drag-end", () => {
                    isDragging.current = false
                })

            viewport.sortableChildren = true
            // Add pixi viewport to stage
            app.stage.addChild(viewport)

            setPixiMainItems({ app, viewport })
        },
        [pixiMainItems, setPixiMainItems],
    )

    // Setup the pixi app
    useEffect(() => {
        if (!miniMapPixiRef) return

        // Setup pixi app if not already setup
        if (!pixiMainItems) {
            setupPixi(miniMapPixiRef, containerDimensions)
            return
        }

        // When parent container size changes, resize the renderer and viewport dimension
        pixiMainItems.app.renderer.resize(containerDimensions.width, containerDimensions.height)
        pixiMainItems.viewport.resize(pixiMainItems.app.renderer.width, pixiMainItems.app.renderer.height)

        // Fit to cover
        if (pixiMainItems.app.renderer.width > pixiMainItems.app.renderer.height) {
            pixiMainItems.viewport.fitWidth()
        } else {
            pixiMainItems.viewport.fitHeight()
        }
        pixiMainItems.viewport.moveCorner(0, 0)
    }, [pixiMainItems, containerDimensions, setupPixi, miniMapPixiRef])

    // Cleanup
    useEffect(() => {
        return () => {
            pixiMainItems?.viewport.destroy({ children: true, texture: true, baseTexture: true })
            pixiMainItems?.app?.destroy(true, true)
            setPixiMainItems(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update the map sprite when map is changed
    useEffect(() => {
        if (map?.Image_Url && pixiMainItems) {
            const mapTexture = PIXI.Texture.from(map.Image_Url)

            // If map sprite isn't setup, then set it up
            if (!pixiItems.current.mapSprite) {
                pixiItems.current.mapSprite = PIXI.Sprite.from(mapTexture)
                pixiItems.current.mapSprite.x = 0
                pixiItems.current.mapSprite.y = 0
                pixiItems.current.mapSprite.zIndex = -10
                pixiItems.current.mapSprite.interactive = true
                pixiMainItems.viewport.addChild(pixiItems.current.mapSprite)
            }

            // Calculate the fit to cover dimension
            const dimension = calculateCoverDimensions(
                { width: map.Width, height: map.Height },
                {
                    width: pixiMainItems.app.renderer.width,
                    height: pixiMainItems.app.renderer.height,
                },
            )

            // Update pixi viewport world dimension
            pixiMainItems.viewport.resize(pixiMainItems.app.renderer.width, pixiMainItems.app.renderer.height, dimension.width, dimension.height)

            // Update the map's dimension and texture
            pixiItems.current.mapSprite.width = dimension.width
            pixiItems.current.mapSprite.height = dimension.height
            pixiItems.current.mapSprite.texture = mapTexture

            // Draw a line around the pixi viewport for easy debug
            if (!pixiItems.current.border) {
                pixiItems.current.border = pixiMainItems.viewport.addChild(new PIXI.Graphics())
                pixiItems.current.border
                    .lineStyle(2, HEXToVBColor("#000000"), 0.1)
                    .drawRect(0, 0, pixiMainItems.viewport.worldWidth, pixiMainItems.viewport.worldHeight)
            }
            pixiItems.current.border.width = pixiMainItems.viewport.worldWidth
            pixiItems.current.border.height = pixiMainItems.viewport.worldHeight
        }
    }, [map, pixiMainItems])

    // On map click handler to unselect a mech when click anywhere on the map
    useEffect(() => {
        if (!pixiItems.current.mapSprite) return
        pixiItems.current.mapSprite.removeListener("pointerup")
        pixiItems.current.mapSprite.on("pointerup", () => {
            if (!isDragging.current) setHighlightedMechParticipantID(undefined)
        })
    }, [setHighlightedMechParticipantID, map, pixiMainItems])

    // TODO: If we are popped out, we need to move the pixi canvas to the poppedout window

    return useMemo(
        () => (
            <Box
                ref={setMiniMapPixiRef}
                sx={{
                    position: "relative",
                    width: containerDimensions.width,
                    height: containerDimensions.height,
                    overflow: "hidden",
                }}
            >
                {/* Overlay items: items that are overlay'ed on top */}
                <MechAbilities />

                {/* Viewport items: items within the viewport, affected by zoom and panning etc. */}
                <MapMechs />
            </Box>
        ),
        [containerDimensions],
    )
}, propsAreEqual)
