import { Map } from "../../types"
import { styled } from "@mui/system"
import { MapSelection } from ".."
import { Dispatch, SetStateAction, useEffect, useState } from "react"

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
    cursor: disabled ? "auto" : "pointer",
    border: disabled ? "unset" : `1px solid #FFFFFF40`,
    backgroundColor: disabled ? "#00000090" : "unset",
    "&:hover": {
        backgroundColor: disabled ? "#00000090" : "#FFFFFF45",
    },
}))

export const Grid = ({
    map,
    targeting,
    gridWidth,
    gridHeight,
    isDragging,
    setSelection,
    prevSelection,
}: {
    map?: Map
    targeting?: boolean
    gridWidth: number
    gridHeight: number
    isDragging: React.MutableRefObject<boolean>
    setSelection: Dispatch<SetStateAction<MapSelection | undefined>>
    prevSelection: React.MutableRefObject<MapSelection | undefined>
}) => {
    const [disableClick, setDisableClick] = useState(true)

    // Wait a bit before allow user to select a cell because user
    // could be spamming in the vote panel and accidentally choose a cell
    useEffect(() => {
        if (targeting) {
            setDisableClick(true)
            setTimeout(() => {
                setDisableClick(false)
            }, 15000)
        }
    }, [targeting])

    if (!map || !targeting) {
        return null
    }

    return (
        <MapGrid map={map}>
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
                                    return (
                                        <GridCell
                                            key={`column-${y}-row-${x}`}
                                            disabled={disabled}
                                            width={gridWidth}
                                            height={gridHeight}
                                            onClick={
                                                disabled
                                                    ? undefined
                                                    : () => {
                                                          if (!isDragging.current) {
                                                              setSelection((prev) => {
                                                                  prevSelection.current = prev
                                                                  return { x, y }
                                                              })
                                                          }
                                                      }
                                            }
                                        />
                                    )
                                })}
                        </tr>
                    ))}
            </tbody>
        </MapGrid>
    )
}
