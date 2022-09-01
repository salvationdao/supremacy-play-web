import { Box, Stack } from "@mui/material"
import { useCallback, useMemo, useRef } from "react"
import { Crosshair } from "../../../assets"
import { useTraining } from "../../../containers"
import { convertCellsToGameLocation } from "../../../helpers"
import { BattleAbilityStages, Dimension, LocationSelectType } from "../../../types"
import { MechAbilityStages, PlayerAbilityStages } from "../../../types/training"
import { useMiniMapGesturesBT } from "../useMiniMapGesturesBT"
import { MechCommandIconsBT } from "./MapIcon/MechCommandIconsBT"
import { SelectionIconBT } from "./MapIcon/SelectionIconBT"
import { CountdownSubmitBT } from "./MapInsideItems/CountdownSubmitBT"
import { DisabledCellsBT } from "./MapInsideItems/DisabledCellsBT"
import { LineSelectBT } from "./MapInsideItems/LineSelectBT"
import { MapMechsBT } from "./MapInsideItems/MapMechs/MapMechsBT"
import { EMP_X, EMP_Y, RangeIndicatorBT } from "./MapInsideItems/RangeIndicatorBT"

interface MiniMapInsideProps {
    containerDimensions: Dimension
}

export const MiniMapInsideBT = ({ containerDimensions }: MiniMapInsideProps) => {
    const { map, setPlayerAbility, mapElement, gridWidth, gridHeight, isTargeting, selection, setTrainingStage, playerAbility, winner, trainingStage } =
        useTraining()
    const mapRef = useRef<HTMLDivElement>(null)
    const gestureRef = useRef<HTMLDivElement>(null)
    const { mapScale, dragX, dragY } = useMiniMapGesturesBT({ gestureRef, containerDimensions })

    // Click inside the map, converts to a selection
    const onMapClick = useCallback(
        (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
            if (mapElement && mapElement.current && map) {
                const rect = mapElement.current.getBoundingClientRect()
                // Mouse position
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const empRange = Math.abs(x - EMP_X) <= 15 && Math.abs(y - EMP_Y) <= 15
                if (trainingStage === PlayerAbilityStages.LocationActionPA && empRange) {
                    setTrainingStage(PlayerAbilityStages.ShowAbilityPA)
                    setPlayerAbility(undefined)
                }
                console.log(convertCellsToGameLocation(x / (gridWidth * mapScale), y / (gridHeight * mapScale), map?.Pixel_Left, map?.Pixel_Top))
                console.log(x / (gridWidth * mapScale), y / (gridHeight * mapScale))
            }
        },
        [mapElement, map, trainingStage, gridWidth, mapScale, gridHeight, setTrainingStage, setPlayerAbility],
    )

    // i.e. is battle ability or player ability of type LOCATION_SELECT
    const isLocationSelection = useMemo(
        () =>
            isTargeting &&
            (winner?.game_ability.location_select_type === LocationSelectType.LocationSelect ||
                playerAbility?.ability.location_select_type === LocationSelectType.LocationSelect ||
                playerAbility?.ability.location_select_type === LocationSelectType.MechCommand),
        [isTargeting, winner?.game_ability.location_select_type, playerAbility?.ability.location_select_type],
    )

    const isLineSelection = useMemo(
        () =>
            isTargeting &&
            (playerAbility?.ability.location_select_type === LocationSelectType.LineSelect ||
                winner?.game_ability.location_select_type === LocationSelectType.LineSelect),
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
                    {trainingStage === PlayerAbilityStages.LocationActionPA && <RangeIndicatorBT map={map} parentRef={mapRef} mapScale={mapScale} />}

                    <Box
                        ref={gestureRef}
                        sx={{
                            touchAction: "none",
                            transformOrigin: "0% 0%",
                            transform: `translate(${dragX}px, ${dragY}px) scale(${mapScale})`,
                        }}
                    >
                        {/* Render the user selection icon on the map */}
                        <SelectionIconBT key={selection?.startCoords && `column-${selection.startCoords.y}-row-${selection.startCoords.x}`} />

                        {/* Render the mech command icons on the map */}
                        <MechCommandIconsBT />

                        {/* Rendering war machines on the map */}
                        <MapMechsBT />

                        {/* Map Image */}
                        <Box
                            ref={mapElement}
                            onClick={onMapClick}
                            sx={{
                                position: "absolute",
                                width: `${map.Width}px`,
                                height: `${map.Height}px`,
                                backgroundImage: `url(${map.Image_Url})`,
                                cursor:
                                    (isLocationSelection || isLineSelection) &&
                                    (trainingStage === BattleAbilityStages.LocationActionBA ||
                                        trainingStage === MechAbilityStages.MoveMA ||
                                        trainingStage === PlayerAbilityStages.LocationActionPA)
                                        ? `url(${Crosshair}) 14.5 14.5, auto`
                                        : "unset",
                                borderSpacing: 0,
                            }}
                        >
                            {trainingStage === BattleAbilityStages.LocationActionBA && <LineSelectBT mapScale={mapScale} />}
                        </Box>

                        {/* Shade disabled cells */}
                        <DisabledCellsBT />
                    </Box>
                </Stack>

                <CountdownSubmitBT />
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
        trainingStage,
    ])
}
