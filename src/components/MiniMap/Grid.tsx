import { Map } from "../../types"
import { styled } from "@mui/system"
import { MapSelection } from ".."
import { Dispatch, SetStateAction, useEffect, useState } from "react"
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

const GridCell = styled("td", {
    shouldForwardProp: (prop) => prop !== "disabled" && prop !== "width" && prop !== "height",
})<{ disabled?: boolean; width: number; height: number }>(({ disabled, width, height }) => ({
    height: `${width}px`,
    width: `${height}px`,
    cursor: disabled ? "auto" : `url(${Crosshair}) 10 10, auto`,
    backgroundColor: disabled ? "#00000090" : "unset",
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
    const [disableClick, setDisableClick] = useState(true)

    // Wait a bit before allow user to select a cell because user
    // could be spamming in the vote panel and accidentally choose a cell
    useEffect(() => {
        if (targeting) {
            setDisableClick(true)
            setTimeout(() => {
                setDisableClick(false)
            }, 2000)
        }
    }, [targeting])

    if (!map || !targeting) {
        return null
    }

    const handleSelection = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
        console.debug(scale)
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
            onClick={(e) => {
                handleSelection(e)
            }}
            sx={{
                cursor: `url(${Crosshair}) 10 10, auto`,
            }}
        ></MapGrid>
    )
}
