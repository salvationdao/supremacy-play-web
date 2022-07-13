import { Stack } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { useMiniMap } from "../../../../containers"

interface MapIconProps {
    primaryColor: string
    imageUrl?: string
    icon?: ReactNode
    onClick?: () => void
    position: { x: number; y: number }
}

export const MapIcon = ({ primaryColor, imageUrl, icon, onClick, position }: MapIconProps) => {
    const { gridWidth, gridHeight } = useMiniMap()

    const sizeX = useMemo(() => gridWidth * 1.8, [gridWidth])
    const sizeY = useMemo(() => gridHeight * 1.8, [gridHeight])

    return useMemo(() => {
        return (
            <>
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
                        backgroundImage: `url(${imageUrl})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundColor: icon ? "#030409" : primaryColor,
                        transform: `translate(${position.x * gridWidth - sizeX / 2}px, ${position.y * gridHeight - sizeY / 2}px)`,
                        zIndex: 100,
                    }}
                >
                    {icon}
                </Stack>
            </>
        )
    }, [gridHeight, gridWidth, icon, imageUrl, onClick, position.x, position.y, primaryColor, sizeX, sizeY])
}
