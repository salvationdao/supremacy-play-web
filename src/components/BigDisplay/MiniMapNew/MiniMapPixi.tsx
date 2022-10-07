import { Box } from "@mui/material"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useGame, useMiniMapPixi, useSupremacy } from "../../../containers"
import { calculateCoverDimensions, HEXToVBColor } from "../../../helpers"
import { colors } from "../../../theme/theme"
import { Dimension } from "../../../types"
import { MapScale } from "./OverlayItems/MapScale/MapScale"
import { MapTargetSelect } from "./OverlayItems/MapTargetSelect/MapTargetSelect"
import { MechAbilities } from "./OverlayItems/MechAbilities/MechAbilities"
import { BattleZone } from "./ViewportItems/BattlesZone/BattleZone"
import { Blackouts } from "./ViewportItems/Blackouts/Blackouts"
import { Grid } from "./ViewportItems/Grid/Grid"
import { MapAbilities } from "./ViewportItems/MapAbilities/MapAbilities"
import { MapMechs } from "./ViewportItems/MapMechs/MapMechs"
import { MechMoveDests } from "./ViewportItems/MechMoveDests/MechMoveDests"

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
    const { battleIdentifier } = useSupremacy()
    const { pixiMainItems, setPixiMainItems, gridSizeRef, mapMousePosition, setHighlightedMechParticipantID, selectMapPosition, anyAbility, selection } =
        useMiniMapPixi()
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)
    const pixiItems = useRef<PixiItems>({})
    const isDragging = useRef(false)
    const [isReady, setIsReady] = useState(false)

    const setupPixi = useCallback(
        (mapRef: HTMLDivElement, dimension: Dimension) => {
            if (pixiMainItems) return

            // Create pixi app
            const app = new PIXI.Application({
                backgroundColor: HEXToVBColor(colors.darkNavyBlue),
                width: dimension.width,
                height: dimension.height,
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

            // Need this timeout to allow some time for pixi and map things to set up
            setTimeout(() => {
                setIsReady(true)
            }, 500)
        },
        [pixiMainItems, setPixiMainItems],
    )

    // Set up the pixi app
    useEffect(() => {
        if (!miniMapPixiRef) return

        // Setup pixi app if not already setup
        if (!pixiMainItems) {
            setupPixi(miniMapPixiRef, containerDimensions)
            return
        }

        setTimeout(() => {
            // When parent container size changes, resize the renderer and viewport dimension
            pixiMainItems.app.renderer.resize(containerDimensions.width, containerDimensions.height)
            pixiMainItems.viewport.resize(containerDimensions.width, containerDimensions.height)

            // Fit to cover
            if (containerDimensions.width > containerDimensions.height) {
                pixiMainItems.viewport.fitWidth()
            } else {
                pixiMainItems.viewport.fitHeight()
            }
            pixiMainItems.viewport.moveCorner(0, 0)
        }, 0)
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
            pixiMainItems.viewport.clampZoom({ minWidth: 50, minHeight: 50, maxWidth: dimension.width, maxHeight: dimension.height })

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

            // Save the mouse position into ref
            pixiItems.current.mapSprite.removeListener("pointermove")
            pixiItems.current.mapSprite.on("pointermove", (event) => {
                mapMousePosition.current = pixiMainItems?.viewport.toLocal(event.data.global)
            })
        }
    }, [map, pixiMainItems, mapMousePosition])

    // On map click handler to unselect a mech when click anywhere on the map
    useEffect(() => {
        if (!pixiItems.current.mapSprite) return
        pixiItems.current.mapSprite.removeListener("pointerup")
        pixiItems.current.mapSprite.on("pointerup", (event) => {
            // If dragging, dont do map click
            if (isDragging.current) return

            // Unhighlight mech
            if (!anyAbility.current) {
                setHighlightedMechParticipantID(undefined)
            }

            const clickedPos = pixiMainItems?.viewport.toLocal(event.data.global)
            if (!clickedPos) return

            if (anyAbility.current) {
                selectMapPosition.current({
                    ...selection.current,
                    position: {
                        x: clickedPos.x / gridSizeRef.current.width,
                        y: clickedPos.y / gridSizeRef.current.height,
                    },
                })
            }
        })
    }, [setHighlightedMechParticipantID, map, pixiMainItems, anyAbility, gridSizeRef, selectMapPosition, selection])

    // TODO: If we are popped out, we need to move the pixi canvas to the popped out window

    return useMemo(() => {
        return (
            <Box
                id="minimap-pixi-container"
                ref={setMiniMapPixiRef}
                key={`mini-map-pixi-${battleIdentifier}-${map?.Name}`}
                sx={{
                    position: "relative",
                    width: containerDimensions.width,
                    height: containerDimensions.height,
                    overflow: "hidden",
                }}
            >
                {isReady && (
                    <>
                        {/* Overlay items: items that are overlaid on top */}
                        <MechAbilities />
                        <MapScale />
                        <MapTargetSelect />

                        {/* Viewport items: items inside the viewport (map), affected by zoom and panning etc. */}
                        <MapMechs />
                        <MechMoveDests />
                        <Blackouts />
                        <BattleZone />
                        <MapAbilities />
                        <Grid />
                    </>
                )}
            </Box>
        )
    }, [battleIdentifier, containerDimensions.height, containerDimensions.width, isReady, map?.Name])
}, propsAreEqual)
