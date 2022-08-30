import { Box, Stack, SxProps } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useMiniMap } from "../../../../../containers"

interface MapIconProps {
    position: { x: number; y: number }
    sizeGrid: number
    primaryColor: string
    insideRender?: ReactNode
    backgroundImageUrl?: string
    sx?: SxProps
    iconSx?: SxProps
    onClick?: () => void
    locationInPixels?: boolean
}

// Renders an item on the minimap with correct position etc. just pass in the props you need.
export const MapIcon = ({ primaryColor, backgroundImageUrl, insideRender, onClick, position, sx, iconSx, sizeGrid, locationInPixels }: MapIconProps) => {
    const { gridWidth, gridHeight } = useMiniMap()

    const sizeX = useMemo(() => gridWidth * sizeGrid, [sizeGrid, gridWidth])
    const sizeY = useMemo(() => gridHeight * sizeGrid, [sizeGrid, gridHeight])

    return useMemo(() => {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                onClick={onClick}
                sx={{
                    position: "absolute",
                    height: `${sizeX}px`,
                    width: `${sizeY}px`,
                    cursor: "pointer",
                    transform: locationInPixels
                        ? `translate(${position.x}px, ${position.y}px)`
                        : `translate(${position.x * gridWidth - sizeX / 2}px, ${position.y * gridHeight - sizeY / 2}px)`,
                    zIndex: 100,
                    ...sx,
                }}
            >
                {backgroundImageUrl && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            zIndex: 2,
                            backgroundImage: `url(${backgroundImageUrl})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            border: `5px solid ${primaryColor}`,
                            borderRadius: 1,
                            boxShadow: 2,
                            backgroundColor: insideRender ? "#030409" : primaryColor,
                            ...iconSx,
                        }}
                    />
                )}

                {insideRender}
            </Stack>
        )
    }, [onClick, sizeX, sizeY, position.x, position.y, gridWidth, gridHeight, sx, backgroundImageUrl, primaryColor, insideRender, iconSx, locationInPixels])
}
