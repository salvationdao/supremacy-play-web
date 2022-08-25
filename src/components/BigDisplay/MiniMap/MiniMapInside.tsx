import { Box, Stack } from "@mui/material"
import { useCallback, useMemo, useRef } from "react"
import { MapMechs, SelectionIcon } from "../.."
import { useGame, useMiniMap } from "../../../containers"
import { Dimension, LocationSelectType } from "../../../types"
import { BattleZone } from "./MapInsideItems/BattleZone"
import { Blackouts } from "./MapInsideItems/Blackouts"
import { CountdownSubmit } from "./MapInsideItems/CountdownSubmit"
import { MapGrid } from "./MapInsideItems/MapGrid"
import { MechCommandIcons } from "./MapInsideItems/MechCommandIcons"
import { MapImage } from "./MapInsideItems/MapImage"
import { RangeIndicator } from "./MapInsideItems/RangeIndicator"
import { useMiniMapGestures } from "./useMiniMapGestures"
import { MiniMapAbilitiesDisplay } from "./MapInsideItems/AbilityDisplay"

interface MiniMapInsideProps {
    containerDimensions: Dimension
}

export const MiniMapInside = ({ containerDimensions }: MiniMapInsideProps) => {
    const { map } = useGame()
    const { mapElement, setMapElement, gridWidth, gridHeight, isTargeting, selection, setSelection, playerAbility, winner, setHighlightedMechParticipantID } =
        useMiniMap()

    const mapRef = useRef<HTMLDivElement>(null)
    const gestureRef = useRef<HTMLDivElement>(null)
    const { mapScale, dragX, dragY } = useMiniMapGestures({ gestureRef, containerDimensions })

    // Click inside the map, converts to a selection
    const onMapClick = useCallback(
        (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
            if (mapElement) {
                const rect = mapElement.getBoundingClientRect()
                // Mouse position
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                setSelection({
                    startCoords: {
                        x: x / (gridWidth * mapScale),
                        y: y / (gridHeight * mapScale),
                    },
                })
            }
        },
        [mapElement, gridWidth, gridHeight, mapScale, setSelection],
    )

    // i.e. is battle ability or player ability of type LOCATION_SELECT
    const isLocationSelection = useMemo(() => {
        const abilityType = winner?.game_ability.location_select_type || playerAbility?.ability.location_select_type
        return isTargeting && (abilityType === LocationSelectType.LocationSelect || abilityType === LocationSelectType.MechCommand)
    }, [isTargeting, winner?.game_ability.location_select_type, playerAbility?.ability.location_select_type])

    const isLineSelection = useMemo(() => {
        const abilityType = winner?.game_ability.location_select_type || playerAbility?.ability.location_select_type
        return isTargeting && abilityType === LocationSelectType.LineSelect
    }, [isTargeting, playerAbility?.ability.location_select_type, winner?.game_ability.location_select_type])

    return useMemo(() => {
        if (!map) return null

        return (
            <>
                <Stack
                    ref={mapRef}
                    sx={{
                        position: "relative",
                        width: containerDimensions.width,
                        height: containerDimensions.height,
                        overflow: "hidden",
                    }}
                >
                    {/* Range indicator */}
                    <RangeIndicator parentRef={mapRef} map={map} mapScale={mapScale} />

                    <Box
                        ref={gestureRef}
                        sx={{
                            touchAction: "none",
                            transformOrigin: "0% 0%",
                            transform: `translate(${dragX}px, ${dragY}px) scale(${mapScale})`,
                        }}
                    >
                        <BattleZone map={map} />

                        {/* Render the user selection icon on the map */}
                        <SelectionIcon key={selection?.startCoords && `column-${selection.startCoords.y}-row-${selection.startCoords.x}`} />

                        {/* Render the mech command icons on the map */}
                        <MechCommandIcons />

                        {/* Rendering war machines on the map */}
                        <MapMechs />

                        {/* Map Image */}
                        <MapImage map={map} />

                        {/* Map grid, with map clicking */}
                        <MapGrid
                            mapWidth={map.width}
                            mapHeight={map.height}
                            gridHeight={gridHeight}
                            gridWidth={gridWidth}
                            onClick={isLocationSelection ? onMapClick : () => setHighlightedMechParticipantID(undefined)}
                            mapScale={mapScale}
                            setMapElement={setMapElement}
                            isLocationSelection={isLocationSelection}
                            isLineSelection={isLineSelection}
                        />

                        {/* Blackouts */}
                        <Blackouts />

                        <MiniMapAbilitiesDisplay />
                    </Box>
                </Stack>

                <CountdownSubmit />
            </>
        )
    }, [
        containerDimensions.height,
        containerDimensions.width,
        dragX,
        dragY,
        isLineSelection,
        isLocationSelection,
        map,
        mapScale,
        onMapClick,
        selection?.startCoords,
        setHighlightedMechParticipantID,
        gridHeight,
        gridWidth,
        setMapElement,
    ])
}
