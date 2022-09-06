import { styled } from "@mui/system"
import { useMemo } from "react"
import { useTraining } from "../../../../containers"

export const DisabledCellsBT = () => {
    const { isTargeting, gridWidth, gridHeight, map } = useTraining()

    return useMemo(() => {
        if (!isTargeting || !map?.Disabled_Cells || !map?.Width || !map?.Height) return null

        return (
            <MapGrid width={map.Width} height={map.Height}>
                <tbody>
                    {Array(map?.Cells_Y)
                        .fill(1)
                        .map((_el, y) => (
                            <tr key={`column-${y}`}>
                                {Array(map?.Cells_X)
                                    .fill(1)
                                    .map((_el, x) => {
                                        const disabled = map?.Disabled_Cells.indexOf(Math.max(y, 0) * map.Cells_X + x) != -1
                                        return <GridCell key={`column-${y}-row-${x}`} disabled={disabled} width={gridWidth} height={gridHeight} />
                                    })}
                            </tr>
                        ))}
                </tbody>
            </MapGrid>
        )
    }, [gridHeight, gridWidth, isTargeting, map?.Cells_X, map?.Cells_Y, map?.Disabled_Cells, map?.Height, map?.Width])
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
