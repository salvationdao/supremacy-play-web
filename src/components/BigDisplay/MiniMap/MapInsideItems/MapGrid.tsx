import { Box } from "@mui/material"
import React from "react"
import { Crosshair } from "../../../../assets"
import { LineSelect } from "./LineSelect"

export const MapGrid = React.memo(function MapGrid({
    mapWidth,
    mapHeight,
    onClick,
    mapScale,
    setMapElement,
    isLocationSelection,
    isLineSelection,
}: {
    mapWidth: number
    mapHeight: number
    gridHeight: number
    gridWidth: number
    onClick: React.MouseEventHandler<HTMLDivElement>
    mapScale: number
    setMapElement: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>
    isLocationSelection: boolean
    isLineSelection: boolean
}) {
    return (
        <Box
            ref={setMapElement}
            onClick={onClick}
            sx={{
                position: "absolute",
                width: `${mapWidth}px`,
                height: `${mapHeight}px`,
                cursor: isLocationSelection || isLineSelection ? `url(${Crosshair}) 14.5 14.5, auto` : "move",
            }}
        >
            {isLineSelection && <LineSelect mapScale={mapScale} />}
        </Box>
    )
})
