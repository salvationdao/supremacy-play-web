import { Box, Stack, Typography } from "@mui/material"
import React from "react"
import { intToLetter } from "../../../helpers"

export const MapGrid = React.memo(function MapGrid({ mapWidth, mapHeight, gridHeight }: { mapWidth: number; mapHeight: number; gridHeight: number }) {
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
