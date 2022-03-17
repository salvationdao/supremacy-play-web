import { Box, SxProps, Theme } from "@mui/system"
import { SyntheticEvent, useMemo, useState } from "react"
import { Resizable, ResizeCallbackData, ResizeHandle } from "react-resizable"
import { useToggle } from "../../hooks"

interface ResizeBoxProps {
    sx?: SxProps<Theme>
    color: string
    onResizeStop?: (data: { width: number; height: number }) => void
    initialDimensions?: [number, number]
    minConstraints?: [number, number]
    maxConstraints?: [number, number]
    resizeHandles?: ResizeHandle[]
    handle?: React.ReactNode
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
}: ResizeBoxProps) => {
    const [resizing, toggleResizing] = useToggle()
    const [resizingDimensions, setResizingDimensions] = useState<{ width: number; height: number }>({
        width: initialDimensions ? initialDimensions[0] : minConstraints ? minConstraints[0] : 0,
        height: initialDimensions ? initialDimensions[1] : minConstraints ? minConstraints[1] : 0,
    })

    const onResize = useMemo(
        () => (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
            if (!data) return
            setResizingDimensions({ width: data.size.width, height: data.size.height })
        },
        [],
    )

    const onResizeStart = useMemo(() => () => toggleResizing(true), [])

    const onResizeStop2 = useMemo(
        () => () => {
            if (!resizingDimensions || resizingDimensions.width <= 0 || resizingDimensions.height <= 0) return
            onResizeStop && onResizeStop(resizingDimensions)
            toggleResizing(false)
        },
        [resizingDimensions],
    )

    return (
        <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 99, pointerEvents: "none" }}>
            {resizing && (
                <Box
                    sx={{
                        position: "absolute",
                        width: resizingDimensions?.width,
                        height: resizingDimensions?.height,
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
