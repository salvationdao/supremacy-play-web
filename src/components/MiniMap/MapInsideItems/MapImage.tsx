import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { Crosshair } from "../../../assets"
import { intToLetter } from "../../../helpers"
import { fonts } from "../../../theme/theme"
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
        <>
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
            </Box>

            <MapGrid mapWidth={map.width} mapHeight={map.height} gridHeight={gridHeight} />
        </>
    )
}

const MapGrid = React.memo(function MapGrid({ mapWidth, mapHeight, gridHeight }: { mapWidth: number; mapHeight: number; gridHeight: number }) {
    return (
        <Stack
            sx={{
                position: "absolute",
                width: `${mapWidth}px`,
                height: `${mapHeight}px`,
                pointerEvents: "none",
            }}
        >
            {new Array(10).fill(0).map((_, i) => (
                <Stack key={i} direction="row" sx={{ position: "relative", flex: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            position: "absolute",
                            fontSize: gridHeight / 2,
                            fontFamily: fonts.nostromoBlack,
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                        }}
                    >
                        {i + 1}
                    </Typography>

                    {new Array(10).fill(0).map((_, j) => (
                        <div key={j} style={{ flex: 1, position: "relative", border: "#FFFFFF40 1px solid" }}>
                            {i === 0 && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: "absolute",
                                        fontSize: gridHeight / 2,
                                        fontFamily: fonts.nostromoBlack,
                                        top: 0,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                    }}
                                >
                                    {intToLetter(j)}
                                </Typography>
                            )}
                        </div>
                    ))}
                </Stack>
            ))}
        </Stack>
    )
})
