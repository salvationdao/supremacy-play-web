import { Box, Stack } from "@mui/material"
import { useCallback, useMemo, useRef } from "react"
import { MapWarMachines, SelectionIcon } from ".."
import { Crosshair } from "../../assets"
import { useAuth, useGame, useMiniMap, useSupremacy } from "../../containers"
import { CellCoords, Dimension, LocationSelectType, PlayerAbility } from "../../types"
import { CountdownSubmit } from "./MapInsideItems/CountdownSubmit"
import { LineSelect } from "./MapInsideItems/LineSelect"
import { MechCommandLocations } from "./MapInsideItems/MechCommandLocations"
import { useMiniMapGestures } from "./useMiniMapGestures"

export interface MapSelection {
    // start coords (used for LINE_SELECT and LOCATION_SELECT abilities)
    startCoords?: CellCoords
    // end coords (only used for LINE_SELECT abilities)
    endCoords?: CellCoords
    // mech hash (only used for MECH_SELECT abilities)
    mechHash?: string
}

interface MiniMapInsideProps {
    enlarged: boolean
    containerDimensions: Dimension
}

export const MiniMapInside = (props: MiniMapInsideProps) => {
    const { mapElement, gridWidth, gridHeight, isTargeting, selection, setSelection, highlightedMechHash, setHighlightedMechHash, playerAbility } = useMiniMap()

    return useMemo(
        () => (
            <MiniMapInsideInner
                {...props}
                mapElement={mapElement}
                gridWidth={gridWidth}
                gridHeight={gridHeight}
                isTargeting={isTargeting}
                selection={selection}
                setSelection={setSelection}
                highlightedMechHash={highlightedMechHash}
                setHighlightedMechHash={setHighlightedMechHash}
                playerAbility={playerAbility}
            />
        ),
        [gridHeight, gridWidth, highlightedMechHash, isTargeting, mapElement, playerAbility, props, selection, setHighlightedMechHash, setSelection],
    )
}

interface MiniMapInsideInnerProps extends MiniMapInsideProps {
    mapElement: React.MutableRefObject<HTMLDivElement | undefined>
    gridWidth: number
    gridHeight: number
    isTargeting: boolean
    selection?: MapSelection
    setSelection: React.Dispatch<React.SetStateAction<MapSelection | undefined>>
    highlightedMechHash?: string
    setHighlightedMechHash: React.Dispatch<React.SetStateAction<string | undefined>>
    playerAbility?: PlayerAbility
}

const MiniMapInsideInner = ({
    containerDimensions,
    enlarged,
    mapElement,
    gridWidth,
    gridHeight,
    isTargeting,
    selection,
    setSelection,
    highlightedMechHash,
    setHighlightedMechHash,
    playerAbility,
}: MiniMapInsideInnerProps) => {
    const { userID, factionID } = useAuth()
    const { getFaction } = useSupremacy()
    const { map, warMachines } = useGame()

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAa")

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
            (playerAbility?.ability.location_select_type === LocationSelectType.LOCATION_SELECT ||
                playerAbility?.ability.location_select_type === LocationSelectType.MECH_COMMAND),
        [isTargeting, playerAbility?.ability.location_select_type],
    )

    const isLineSelection = useMemo(
        () => isTargeting && playerAbility?.ability.location_select_type === LocationSelectType.LINE_SELECT,
        [isTargeting, playerAbility?.ability.location_select_type],
    )

    if (!map) return null

    return (
        <>
            <Stack
                sx={{
                    position: "relative",
                    width: containerDimensions.width,
                    height: containerDimensions.height,
                    overflow: "hidden",
                }}
            >
                <Box
                    ref={gestureRef}
                    sx={{
                        touchAction: "none",
                        transformOrigin: "0% 0%",
                        transform: `translate(${dragX}px, ${dragY}px) scale(${mapScale})`,
                    }}
                >
                    {/* Render the user selection icon on the map */}
                    <SelectionIcon key={selection?.startCoords && `column-${selection.startCoords.y}-row-${selection.startCoords.x}`} />

                    {/* Render the mech command icons on the map */}
                    <MechCommandLocations gridWidth={gridWidth} gridHeight={gridHeight} getFaction={getFaction} />

                    {/* Rendering war machines on the map */}
                    <MapWarMachines
                        gridWidth={gridWidth}
                        gridHeight={gridHeight}
                        userID={userID}
                        factionID={factionID}
                        map={map}
                        warMachines={warMachines}
                        getFaction={getFaction}
                        enlarged={enlarged}
                        targeting={isTargeting}
                        setSelection={setSelection}
                        highlightedMechHash={highlightedMechHash}
                        setHighlightedMechHash={setHighlightedMechHash}
                        playerAbility={playerAbility}
                    />

                    {/* Map Image */}
                    <Box
                        ref={mapElement}
                        onClick={isLocationSelection ? onMapClick : undefined}
                        sx={{
                            position: "absolute",
                            width: `${map.width}px`,
                            height: `${map.height}px`,
                            backgroundImage: `url(${map.image_url})`,
                            cursor: isLocationSelection || isLineSelection ? `url(${Crosshair}) 10 10, auto` : "move",
                            borderSpacing: 0,
                        }}
                    >
                        {isLineSelection && <LineSelect mapScale={mapScale} />}
                    </Box>
                </Box>
            </Stack>

            <CountdownSubmit />
        </>
    )
}
