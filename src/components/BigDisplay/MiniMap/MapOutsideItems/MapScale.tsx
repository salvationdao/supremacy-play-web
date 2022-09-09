import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { useMiniMap } from "../../../../containers"
import { GAME_CLIENT_TILE_SIZE } from "../../../../types"

export const MapScale = React.memo(function MapScale({ mapScale }: { mapScale: number }) {
    const { gridWidth } = useMiniMap()

    // Line
    const width = gridWidth * mapScale
    const height = 2

    return (
        <Stack
            direction="row"
            spacing="5px"
            alignItems="baseline"
            sx={{
                position: "absolute",
                bottom: "1.4rem",
                left: "1.6rem",
                pointerEvents: "none",
                filter: "drop-shadow(0 3px 3px #00000050)",
                opacity: 0.8,
            }}
        >
            <Typography variant="body2" sx={{ fontWeight: "fontWeightBold" }}>
                {Math.round(GAME_CLIENT_TILE_SIZE / 100)}m
            </Typography>

            <Box sx={{ position: "relative" }}>
                {/* Left border */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: `${2 * height}px`,
                        width: `${height}px`,
                        backgroundColor: "#FFFFFF",
                    }}
                />

                {/* Right border */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        height: `${2 * height}px`,
                        width: `${height}px`,
                        backgroundColor: "#FFFFFF",
                    }}
                />

                <Box
                    sx={{
                        height: `${height}px`,
                        width: `${width}px`,
                        backgroundColor: "#FFFFFF",
                    }}
                />
            </Box>
        </Stack>
    )
})
