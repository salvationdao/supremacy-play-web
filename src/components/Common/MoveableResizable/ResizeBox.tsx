import { Box, SxProps, Theme } from "@mui/system"
import { ReactNode, SyntheticEvent, useCallback, useEffect, useState } from "react"
import { Resizable, ResizeCallbackData, ResizeHandle } from "react-resizable"
import { useDimension } from "../../../containers"
import { clamp } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { Dimension } from "../../../types"

const PADDING = 10

interface ResizeBoxProps {
    sx?: SxProps<Theme>
    color: string
    onResizeStopped?: (data: Dimension) => void
    initialWidth?: number
    initialHeight?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    resizeHandles?: ResizeHandle[]
    handle?: ReactNode
}

export const ResizeBox = (props: ResizeBoxProps) => {
    const { onResizeStopped, initialWidth, initialHeight, minWidth = 0, maxWidth = 9999, minHeight = 0, maxHeight = 9999 } = props
    const {
        gameUIDimensions: { width, height },
    } = useDimension()

    const [resizing, toggleResizing] = useToggle()
    const [curWidth, setCurWidth] = useState<number>(initialWidth || minWidth)
    const [curHeight, setCurHeight] = useState<number>(initialHeight || minHeight)

    const onResize = useCallback(
        (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
            if (!data) return
            const newWidth = clamp(minWidth, data.size.width, width - 2 * PADDING)
            const newHeight = clamp(minHeight, data.size.height, height - 2 * PADDING)
            setCurWidth(newWidth)
            setCurHeight(newHeight)
        },
        [height, minHeight, minWidth, width],
    )

    const onResizeStart = useCallback(() => toggleResizing(true), [toggleResizing])

    const onResizeStop = useCallback(() => {
        if (curWidth <= 0 || curHeight <= 0) return
        onResizeStopped &&
            onResizeStopped({
                width: curWidth,
                height: curHeight,
            })
        toggleResizing(false)
    }, [curWidth, curHeight, onResizeStopped, toggleResizing])

    // When user resizes the window and the dimensions are smaller than the min, then we need to limit it
    useEffect(() => {
        onResizeStop()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height])

    return (
        <ResizeBoxInner
            {...props}
            resizing={resizing}
            curWidth={curWidth}
            curHeight={curHeight}
            onResize={onResize}
            onResizeStart={onResizeStart}
            onResizeStop={onResizeStop}
            maxWidth={Math.min(maxWidth, width - 2 * PADDING)}
            maxHeight={Math.min(maxHeight, height - 2 * PADDING)}
        />
    )
}

interface InnerProps extends ResizeBoxProps {
    resizing: boolean
    curWidth: number
    curHeight: number
    maxWidth: number
    maxHeight: number
    onResize: (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => void
    onResizeStart: () => void
    onResizeStop: () => void
}

const ResizeBoxInner = ({
    resizing,
    curWidth,
    curHeight,
    color,
    onResize,
    onResizeStart,
    onResizeStop,
    minWidth = 0,
    maxWidth,
    minHeight = 0,
    maxHeight,
    resizeHandles,
    handle,
    sx,
}: InnerProps) => {
    return (
        <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 99, pointerEvents: "none" }}>
            {resizing && (
                <Box
                    sx={{
                        position: "absolute",
                        width: curWidth,
                        height: curHeight,
                        border: `${color} 2px dashed`,
                        borderRadius: 0.5,
                        zIndex: 9,
                        ...sx,
                    }}
                />
            )}

            <Resizable
                width={curWidth}
                height={curHeight}
                onResize={onResize}
                onResizeStart={onResizeStart}
                onResizeStop={onResizeStop}
                minConstraints={[minWidth, minHeight]}
                maxConstraints={[maxWidth, maxHeight]}
                resizeHandles={resizeHandles}
                handle={handle}
            >
                <></>
            </Resizable>
        </Box>
    )
}
