import { Stack, SxProps } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { Crosshair } from "../../../../assets"
import { useTraining } from "../../../../containers"
import { MechAbilityStages } from "../../../../types/training"

interface MapIconProps {
    primaryColor: string
    imageUrl?: string
    icon?: ReactNode
    onClick?: () => void
    position: { x: number; y: number }
    sx?: SxProps
    sizeGrid?: number
}

export const MapIconBT = ({ primaryColor, imageUrl, icon, onClick, position, sx, sizeGrid }: MapIconProps) => {
    const { gridWidth, gridHeight, trainingStage } = useTraining()

    const sizeX = useMemo(() => gridWidth * (sizeGrid || 1.8), [sizeGrid, gridWidth])
    const sizeY = useMemo(() => gridHeight * (sizeGrid || 1.8), [sizeGrid, gridHeight])

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
                    cursor: trainingStage === MechAbilityStages.MoveMA ? `url(${Crosshair}) 14.5 14.5, auto` : "pointer",
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
                    ...sx,
                }}
            >
                {icon}
            </Stack>
        )
    }, [gridHeight, gridWidth, icon, imageUrl, onClick, position.x, position.y, primaryColor, sizeX, sizeY, sx, trainingStage])
}
