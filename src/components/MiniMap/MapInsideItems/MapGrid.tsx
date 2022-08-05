import { Box, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"
import { Crosshair } from "../../../assets"
import { intToLetter } from "../../../helpers"
import { LineSelect } from "./LineSelect"

export const MapGrid = React.memo(function MapGrid({
    mapWidth,
    mapHeight,
    gridHeight,
    mapElement,
    onClick,
    mapScale,
    isLocationSelection,
    isLineSelection,
}: {
    mapWidth: number
    mapHeight: number
    gridHeight: number
    mapElement: React.MutableRefObject<HTMLDivElement | undefined>
    onClick: React.MouseEventHandler<HTMLDivElement>
    mapScale: number
    isLocationSelection: boolean
    isLineSelection: boolean
}) {
    const grid = useMemo(() => {
        return (
            <Stack sx={{ width: "100%", height: "100%", pointerEvents: "none" }}>
                {new Array(10).fill(0).map((_, i) => (
                    <Stack key={i} direction="row" sx={{ position: "relative", flex: 1 }}>
                        {new Array(10).fill(0).map((_, j) => (
                            <Box key={j} sx={{ flex: 1, position: "relative", border: "#FFFFFF30 1px solid", ":hover p": { opacity: 1 } }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: "absolute",
                                        fontSize: gridHeight / 1.6,
                                        top: 0,
                                        left: "10%",
                                        textTransform: "uppercase",
                                        fontWeight: "fontWeightBold",
                                        opacity: 0.2,
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
    }, [gridHeight])

    return (
        <Box
            ref={mapElement}
            onClick={onClick}
            sx={{
                position: "absolute",
                width: `${mapWidth}px`,
                height: `${mapHeight}px`,
                cursor: isLocationSelection || isLineSelection ? `url(${Crosshair}) 14.5 14.5, auto` : "move",
            }}
        >
            {isLineSelection && <LineSelect mapScale={mapScale} />}
            {grid}
        </Box>
    )
})
