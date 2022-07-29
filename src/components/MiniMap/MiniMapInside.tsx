import { Box, Stack } from "@mui/material"
import { useCallback, useMemo, useRef } from "react"
import { MapMechs, SelectionIcon } from ".."
import { Crosshair } from "../../assets"
import { useGame, useMiniMap } from "../../containers"
import { Dimension, LocationSelectType } from "../../types"
import { Blackouts } from "./MapInsideItems/Blackouts"
import { CountdownSubmit } from "./MapInsideItems/CountdownSubmit"
import { DisabledCells } from "./MapInsideItems/DisabledCells"
import { LineSelect } from "./MapInsideItems/LineSelect"
import { MechCommandIcons } from "./MapInsideItems/MapIcon/MechCommandIcons"
import { RangeIndicator } from "./MapInsideItems/RangeIndicator"
import { useMiniMapGestures } from "./useMiniMapGestures"
import { BattleZone } from "./MapInsideItems/BattleZone"

interface MiniMapInsideProps {
    containerDimensions: Dimension
}

export const MiniMapInside = ({ containerDimensions }: MiniMapInsideProps) => {
    const { map } = useGame()
    const { mapElement, gridWidth, gridHeight, isTargeting, selection, setSelection, playerAbility, winner, setHighlightedMechParticipantID } = useMiniMap()

    const mapRef = useRef<HTMLDivElement>(null)
    const gestureRef = useRef<HTMLDivElement>(null)
    const { mapScale, dragX, dragY } = useMiniMapGestures({ gestureRef, containerDimensions })

    // Click inside the map, converts to a selection
    const onMapClick = useCallback(
        (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
            if (mapElement && mapElement.current) {
                const rect = mapElement.current.getBoundingClientRect()
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
    const isLocationSelection = useMemo(
        () =>
            isTargeting &&
            (winner?.game_ability.location_select_type === LocationSelectType.LOCATION_SELECT ||
                playerAbility?.ability.location_select_type === LocationSelectType.LOCATION_SELECT ||
                playerAbility?.ability.location_select_type === LocationSelectType.MECH_COMMAND),
        [isTargeting, winner?.game_ability.location_select_type, playerAbility?.ability.location_select_type],
    )

    const isLineSelection = useMemo(
        () =>
            isTargeting &&
            (playerAbility?.ability.location_select_type === LocationSelectType.LINE_SELECT ||
                winner?.game_ability.location_select_type === LocationSelectType.LINE_SELECT),
        [isTargeting, playerAbility?.ability.location_select_type, winner?.game_ability.location_select_type],
    )

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
                    <RangeIndicator parentRef={mapRef} mapScale={mapScale} />

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
                        <Box
                            ref={mapElement}
                            onClick={isLocationSelection ? onMapClick : () => setHighlightedMechParticipantID(undefined)}
                            sx={{
                                position: "absolute",
                                width: `${map.width}px`,
                                height: `${map.height}px`,
                                backgroundImage: `url(${map.image_url})`,
                                cursor: isLocationSelection || isLineSelection ? `url(${Crosshair}) 14.5 14.5, auto` : "move",
                                borderSpacing: 0,
                            }}
                        >
                            {isLineSelection && <LineSelect mapScale={mapScale} />}
                        </Box>

                        {/* Shade disabled cells */}
                        <DisabledCells />

                        {/* Blackouts */}
                        <Blackouts />
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
        mapElement,
        mapScale,
        onMapClick,
        selection?.startCoords,
        setHighlightedMechParticipantID,
    ])
}
