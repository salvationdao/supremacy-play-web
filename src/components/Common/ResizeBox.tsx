import { Box, SxProps, Theme } from "@mui/system"
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Resizable, ResizeCallbackData, ResizeHandle } from "react-resizable"
import { useToggle } from "../../hooks"
import { Dimension } from "../../types"

interface ResizeBoxProps {
    sx?: SxProps<Theme>
    color: string
    onResizeStop?: (data: Dimension) => void
    initialDimensions?: [number, number]
    minConstraints?: [number, number]
    maxConstraints?: [number, number]
    resizeHandles?: ResizeHandle[]
    handle?: React.ReactNode
    adjustment?: number
}

export const ResizeBox = ({
    sx,
    color,
    onResizeStop,
    initialDimensions,
    minConstraints,
    maxConstraints,
    resizeHandles,
    handle,
    adjustment,
}: ResizeBoxProps) => {
    const [resizing, toggleResizing] = useToggle()
    const [resizingDimensions, setResizingDimensions] = useState<Dimension>({
        width: initialDimensions ? initialDimensions[0] : minConstraints ? minConstraints[0] : 0,
        height: initialDimensions ? initialDimensions[1] : minConstraints ? minConstraints[1] : 0,
    })

    const onResize = useMemo(
        () => (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
            if (!data) return
            setResizingDimensions({
                width: data.size.width,
                height: data.size.height,
            })
        },
        [],
    )

    // When user resizes the window and the dimensions are smaller than the min, then we need to limit it
    useEffect(() => {
        minConstraints &&
            onResizeStop &&
            onResizeStop({
                width: minConstraints[0] * (adjustment || 1),
                height: minConstraints[1] * (adjustment || 1),
            })
    }, [adjustment])

    const onResizeStart = useCallback(() => toggleResizing(true), [])

    const onResizeStop2 = useCallback(() => {
        if (!resizingDimensions || resizingDimensions.width <= 0 || resizingDimensions.height <= 0) return
        onResizeStop &&
            onResizeStop({
                width: resizingDimensions.width * (adjustment || 1),
                height: resizingDimensions.height * (adjustment || 1),
            })
        toggleResizing(false)
    }, [resizingDimensions])

    return (
        <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 99, pointerEvents: "none" }}>
            {resizing && (
                <Box
                    sx={{
                        position: "absolute",
                        width: resizingDimensions?.width * (adjustment || 1),
                        height: resizingDimensions?.height * (adjustment || 1),
                        border: `${color} 2px dashed`,
                        borderRadius: 0.5,
                        zIndex: 9,
                        ...sx,
                    }}
                />
            )}

            <Resizable
                height={resizingDimensions.height}
                width={resizingDimensions.width}
                onResize={onResize}
                onResizeStart={onResizeStart}
                onResizeStop={onResizeStop2}
                minConstraints={minConstraints}
                maxConstraints={maxConstraints}
                resizeHandles={resizeHandles}
                handle={handle}
            >
                <></>
            </Resizable>
        </Box>
    )
}
