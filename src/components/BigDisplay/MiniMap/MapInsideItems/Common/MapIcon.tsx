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
    zIndex?: number
    noBackgroundColour?: boolean
}

// Renders an item on the minimap with correct position etc. just pass in the props you need.
export const MapIcon = ({
    primaryColor,
    backgroundImageUrl,
    insideRender,
    onClick,
    position,
    sx,
    iconSx,
    sizeGrid,
    locationInPixels,
    zIndex,
    noBackgroundColour,
}: MapIconProps) => {
    const { gridWidth, gridHeight } = useMiniMap()

    const sizeX = useMemo(() => gridWidth * sizeGrid, [sizeGrid, gridWidth])
    const sizeY = useMemo(() => gridHeight * sizeGrid, [sizeGrid, gridHeight])

    const imageBackgroundColour = !!backgroundImageUrl && noBackgroundColour !== true

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
                        ? `translate(${position.x - sizeX / 2}px, ${position.y - sizeY / 2}px)`
                        : `translate(${position.x * gridWidth - sizeX / 2}px, ${position.y * gridHeight - sizeY / 2}px)`,
                    backgroundColor: imageBackgroundColour ? (insideRender ? "#030409" : primaryColor) : "unset",
                    border: imageBackgroundColour ? `5px solid ${primaryColor}` : "unset",
                    borderRadius: imageBackgroundColour ? 1 : "unset",
                    boxShadow: imageBackgroundColour ? 2 : "unset",
                    zIndex: zIndex || 100,
                    pointerEvents: onClick ? "all" : "none",
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
                            ...iconSx,
                        }}
                    />
                )}

                {insideRender}
            </Stack>
        )
    }, [
        onClick,
        sizeX,
        sizeY,
        locationInPixels,
        position.x,
        position.y,
        gridWidth,
        gridHeight,
        insideRender,
        primaryColor,
        zIndex,
        sx,
        backgroundImageUrl,
        imageBackgroundColour,
        iconSx,
    ])
}
