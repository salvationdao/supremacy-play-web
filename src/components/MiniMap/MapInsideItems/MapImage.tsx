import { Box, Stack } from "@mui/material"
import React from "react"
import { Crosshair } from "../../../assets"
import { Map } from "../../../types"
import { LineSelect } from "./LineSelect"

export const MapImage = ({
    map,
    mapScale,
    mapElement,
    onClick,
    isLocationSelection,
    isLineSelection,
}: {
    map: Map
    mapScale: number
    mapElement: React.MutableRefObject<HTMLDivElement | undefined>
    onClick: React.MouseEventHandler<HTMLDivElement>
    isLocationSelection: boolean
    isLineSelection: boolean
}) => {
    return (
        <Box
            ref={mapElement}
            onClick={onClick}
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
            <MapGrid />
        </Box>
    )
}

const MapGrid = React.memo(function MapGrid() {
    return (
        <Stack
            sx={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            {new Array(10).fill(0).map((_, i) => (
                <Stack key={i} direction="row" sx={{ flex: 1 }}>
                    {new Array(10).fill(0).map((_, j) => (
                        <div key={j} style={{ flex: 1, border: "#FFFFFF40 1px solid" }} />
                    ))}
                </Stack>
            ))}
        </Stack>
    )
})
