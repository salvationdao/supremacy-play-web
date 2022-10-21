import { Box } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { useArena, useGame, useMiniMapPixi } from "../../../../containers"
import { Dimension } from "../../../../types"
import { MapScale } from "../OverlayItems/MapScale/MapScale"
import { MapTargetSelect } from "../OverlayItems/MapTargetSelect/MapTargetSelect"
import { MechAbilities } from "../OverlayItems/MechAbilities/MechAbilities"
import { BattleZone } from "../ViewportItems/BattlesZone/BattleZone"
import { Blackouts } from "../ViewportItems/Blackouts/Blackouts"
import { Grid } from "../ViewportItems/Grid/Grid"
import { MapAbilities } from "../ViewportItems/MapAbilities/MapAbilities"
import { MapMechs } from "../ViewportItems/MapMechs/MapMechs"
import { MechMoveDests } from "../ViewportItems/MechMoveDests/MechMoveDests"
import { PixiMiniMapPixi } from "./pixiMiniMapPixi"

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

export const MiniMapPixi = React.memo(function MiniMapPixi(props: MiniMapPixiProps) {
    const { currentArenaID } = useArena()
    return <MiniMapPixiInner key={`arena-${currentArenaID}`} {...props} />
}, propsAreEqual)

const MiniMapPixiInner = React.memo(function MiniMapPixiInner({ containerDimensions }: MiniMapPixiProps) {
    const { map } = useGame()
    const { pixiMiniMapPixi, setPixiMiniMapPixi, mapMousePosition, anyAbility, gridSizeRef, selection, selectMapPosition, setHighlightedMechParticipantID } =
        useMiniMapPixi()
    const [miniMapPixiRef, setMiniMapPixiRef] = useState<HTMLDivElement | null>(null)
    const [isReady, setIsReady] = useState(false)

    // Initial setup
    useEffect(() => {
        if (pixiMiniMapPixi || !miniMapPixiRef) return
        const pixiObj = new PixiMiniMapPixi(miniMapPixiRef, mapMousePosition, containerDimensions)

        setPixiMiniMapPixi((prev) => {
            prev?.destroy()
            return pixiObj
        })

        // Need this timeout to allow some time for pixi and map things to set up
        setTimeout(() => {
            setIsReady(true)
        }, 500)
    }, [containerDimensions, miniMapPixiRef, pixiMiniMapPixi, mapMousePosition, setPixiMiniMapPixi])

    // Cleanup
    useEffect(() => {
        return () => {
            pixiMiniMapPixi?.destroy()
            setPixiMiniMapPixi(undefined)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // When parent container dimension changes
    useEffect(() => {
        if (!pixiMiniMapPixi) return
        pixiMiniMapPixi.onParentSizeChange(containerDimensions)
    }, [containerDimensions, pixiMiniMapPixi])

    // When map is changed
    useEffect(() => {
        if (!pixiMiniMapPixi || !map) return
        pixiMiniMapPixi.onMapChanged(map)
    }, [map, pixiMiniMapPixi])

    // On map click handler
    useEffect(() => {
        if (!pixiMiniMapPixi || !pixiMiniMapPixi.mapSprite) return

        pixiMiniMapPixi.mapSprite.removeListener("pointerup")
        pixiMiniMapPixi.mapSprite.on("pointerup", (event) => {
            // If dragging, dont do map click
            if (pixiMiniMapPixi.isDragging) return

            // Unhighlight mech
            if (!anyAbility.current) {
                setHighlightedMechParticipantID(undefined)
            }

            const clickedPos = pixiMiniMapPixi.viewport.toLocal(event.data.global)
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
    }, [setHighlightedMechParticipantID, map, pixiMiniMapPixi, anyAbility, gridSizeRef, selectMapPosition, selection])

    return useMemo(() => {
        return (
            <Box
                id="minimap-pixi-container"
                ref={setMiniMapPixiRef}
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
    }, [containerDimensions.height, containerDimensions.width, isReady])
}, propsAreEqual)
