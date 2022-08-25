import { Stack, SxProps } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useMiniMap } from "../../../../../containers"

interface MapIconProps {
    position: { x: number; y: number }
    sizeGrid: number
    primaryColor: string
    insideRender?: ReactNode
    backgroundImageUrl?: string
    sx?: SxProps
    onClick?: () => void
}

// Renders an item on the minimap with correct position etc. just pass in the props you need.
export const MapIcon = ({ primaryColor, backgroundImageUrl, insideRender, onClick, position, sx, sizeGrid }: MapIconProps) => {
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
                    border: `5px solid ${primaryColor}`,
                    borderRadius: 1,
                    boxShadow: 2,
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundColor: insideRender ? "#030409" : primaryColor,
                    transform: `translate(${position.x * gridWidth - sizeX / 2}px, ${position.y * gridHeight - sizeY / 2}px)`,
                    zIndex: 100,
                    ...sx,
                }}
            >
                {insideRender}
            </Stack>
        )
    }, [gridHeight, gridWidth, insideRender, backgroundImageUrl, onClick, position.x, position.y, primaryColor, sizeX, sizeY, sx])
}
