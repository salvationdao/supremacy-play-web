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
    isDragging,
    setSelection,
    prevSelection,
    mapElement,
    scale,
    offset,
}: {
    map?: Map
    targeting?: boolean
    gridWidth: number
    gridHeight: number
    isDragging: React.MutableRefObject<boolean>
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    prevSelection: React.MutableRefObject<MapSelection | undefined>
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
        console.log(scale)
        if (mapElement) {
            const rect = mapElement.current.getBoundingClientRect()
            // Mouse position
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            setSelection({
                x: Math.floor(x / (gridWidth * scale.get())),
                y: Math.floor(y / (gridHeight * scale.get())),
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
        >
            <tbody>
                {Array(map.cells_y)
                    .fill(1)
                    .map((_el, y) => (
                        <tr key={`column-${y}`}>
                            {Array(map.cells_x)
                                .fill(1)
                                .map((_el, x) => {
                                    const disabled =
                                        disableClick ||
                                        map.disabled_cells.indexOf(Math.max(y, 0) * map.cells_x + x) != -1
                                    if (disabled) {
                                        return (
                                            <GridCell
                                                key={`column-${y}-row-${x}`}
                                                disabled={disabled}
                                                width={gridWidth}
                                                height={gridHeight}
                                            />
                                        )
                                    }
                                })}
                        </tr>
                    ))}
            </tbody>
        </MapGrid>
    )
}
