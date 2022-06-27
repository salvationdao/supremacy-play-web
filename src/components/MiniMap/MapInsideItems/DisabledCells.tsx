import { styled } from "@mui/system"
import { useMemo } from "react"
import { useGame, useMiniMap } from "../../../containers"

export const DisabledCells = () => {
    const { map } = useGame()
    const { gridWidth, gridHeight } = useMiniMap()

    return useMemo(() => {
        if (!map?.disabled_cells || !map?.width || !map?.height) return null

        return (
            <MapGrid width={map.width} height={map.height}>
                <tbody>
                    {Array(map?.cells_y)
                        .fill(1)
                        .map((_el, y) => (
                            <tr key={`column-${y}`}>
                                {Array(map?.cells_x)
                                    .fill(1)
                                    .map((_el, x) => {
                                        const disabled = map?.disabled_cells.indexOf(Math.max(y, 0) * map.cells_x + x) != -1
                                        return <GridCell key={`column-${y}-row-${x}`} disabled={disabled} width={gridWidth} height={gridHeight} />
                                    })}
                            </tr>
                        ))}
                </tbody>
            </MapGrid>
        )
    }, [gridHeight, gridWidth, map?.cells_x, map?.cells_y, map?.disabled_cells, map?.height, map?.width])
}

const MapGrid = styled("table", {
    shouldForwardProp: (prop) => prop !== "width" && prop !== "height",
})<{ width: number; height: number }>(({ width, height }) => ({
    position: "absolute",
    zIndex: 4,
    pointerEvents: "none",
    width: `${width}px`,
    height: `${height}px`,
    borderSpacing: 0,
}))

const GridCell = styled("td", {
    shouldForwardProp: (prop) => prop !== "disabled" && prop !== "width" && prop !== "height",
})<{ disabled?: boolean; width: number; height: number }>(({ disabled, width, height }) => ({
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: disabled ? "#00000095" : "unset",
}))
