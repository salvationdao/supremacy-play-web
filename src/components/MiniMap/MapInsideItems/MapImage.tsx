import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { Crosshair } from "../../../assets"
import { intToLetter } from "../../../helpers"
import { Map } from "../../../types"
import { LineSelect } from "./LineSelect"

export const MapImage = ({
    map,
    mapScale,
    mapElement,
    onClick,
    isLocationSelection,
    isLineSelection,
    gridHeight,
}: {
    map: Map
    mapScale: number
    mapElement: React.MutableRefObject<HTMLDivElement | undefined>
    onClick: React.MouseEventHandler<HTMLDivElement>
    isLocationSelection: boolean
    isLineSelection: boolean
    gridHeight: number
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
            <MapGrid gridHeight={gridHeight} />
        </Box>
    )
}

const MapGrid = React.memo(function MapGrid({ gridHeight }: { gridHeight: number }) {
    return null
    return (
        <Stack
            sx={{
                position: "relative",
                width: `100%`,
                height: `100%`,
            }}
        >
            {new Array(10).fill(0).map((_, i) => (
                <Stack key={i} direction="row" sx={{ position: "relative", flex: 1 }}>
                    {new Array(10).fill(0).map((_, j) => (
                        <Box key={j} sx={{ flex: 1, position: "relative", border: "#FFFFFF 1px solid", opacity: 0.12, ":hover": { opacity: 1 } }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    position: "absolute",
                                    fontSize: gridHeight / 1.6,
                                    top: 0,
                                    left: "10%",
                                    textTransform: "uppercase",
                                    fontWeight: "fontWeightBold",
                                }}
                            >
                                {intToLetter(j)}
                                {i + 1}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            ))}
        </Stack>
    )
})
