import { Map } from "../../types"
import { styled } from "@mui/system"
import { MapSelection } from ".."
import { Dispatch, SetStateAction } from "react"
import { Crosshair } from "../../assets"
import { SpringValue } from "react-spring"

const MapGrid = styled("table", {
    shouldForwardProp: (prop) => prop !== "map",
})<{ map: Map }>(({ map }) => ({
    position: "absolute",
    zIndex: 4,
    width: `${map.width}px`,
    height: `${map.height}px`,
    borderSpacing: 0,
}))

export const Grid = ({
    map,
    targeting,
    gridWidth,
    gridHeight,
    setSelection,
    mapElement,
    scale,
}: {
    map?: Map
    targeting?: boolean
    gridWidth: number
    gridHeight: number
    isDragging: React.MutableRefObject<boolean>
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    mapElement: React.MutableRefObject<any>
    scale: SpringValue<number>
    offset: number
}) => {
    if (!map || !targeting) {
        return null
    }

    const handleSelection = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
        if (mapElement) {
            const rect = mapElement.current.getBoundingClientRect()
            // Mouse position
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            setSelection({
                x: x / (gridWidth * scale.get()),
                y: y / (gridHeight * scale.get()),
            })
        }
    }

    return (
        <MapGrid
            map={map}
            ref={mapElement}
            onClick={handleSelection}
            sx={{ cursor: `url(${Crosshair}) 10 10, auto` }}
        ></MapGrid>
    )
}
