import { Box, SxProps, Theme } from "@mui/system"
import { ReactNode, useCallback, useEffect, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { useDimension } from "../../../containers"
import { clamp } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { Position } from "../../../types"

const PADDING = 10

interface MovingBoxProps {
    sx?: SxProps<Theme>
    color: string
    onMovingStopped?: (data: Position) => void
    initialPosX?: number
    initialPosY?: number
    curWidth: number
    curHeight: number
    minPosX?: number
    minPosY?: number
    maxPosX?: number
    maxPosY?: number
    handle?: ReactNode
}

export const MovingBox = (props: MovingBoxProps) => {
    const { onMovingStopped, initialPosX, initialPosY, curWidth, curHeight, minPosX = 0, maxPosX = 9999, minPosY = 0, maxPosY = 9999 } = props
    const {
        gameUIDimensions: { width, height },
    } = useDimension()

    const [moving, toggleMoving] = useToggle()
    const [curPosX, setCurPosX] = useState<number>(initialPosX || minPosX)
    const [curPosY, setCurPosY] = useState<number>(initialPosY || minPosY)

    const clampPosition = useCallback(
        (data: Position) => {
            if (!data) return
            return {
                x: clamp(Math.max(PADDING, minPosX), data.x, width - curWidth - PADDING),
                y: clamp(Math.max(PADDING, minPosY), data.y, height - curHeight - PADDING),
            }
        },
        [curHeight, curWidth, height, minPosX, minPosY, width],
    )

    // When dragging stops, just set the position and save to local storage
    // The bounds in the Draggable component already limits it's range of motion
    const onDrag = useCallback(
        (e: DraggableEvent | undefined, data: Position) => {
            const clampedData = clampPosition(data)
            if (!clampedData) return
            setCurPosX(clampedData.x)
            setCurPosY(clampedData.y)
            toggleMoving(true)
        },
        [clampPosition, toggleMoving],
    )

    const onDragStop = useCallback(
        (pos?: Position) => {
            const x = pos?.x || curPosX
            const y = pos?.y || curPosY
            if (x <= 0 || y <= 0) return
            onMovingStopped &&
                onMovingStopped({
                    x: x,
                    y: y,
                })
            toggleMoving(false)
        },
        [curPosX, curPosY, onMovingStopped, toggleMoving],
    )

    // When user resizes the window and the position is outside, then we need to fix it
    useEffect(() => {
        if (!width || !height) return
        const pos = clampPosition({ x: curPosX, y: curPosY })
        if (!pos) return
        onDrag(undefined, pos)
        onDragStop(pos)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, curWidth, curHeight])

    return (
        <MovingBoxInner
            {...props}
            moving={moving}
            onDrag={onDrag}
            onDragStop={onDragStop}
            curPosX={curPosX}
            curPosY={curPosY}
            maxPosX={Math.min(maxPosX, width - curWidth - PADDING)}
            maxPosY={Math.min(maxPosY, height - curHeight - PADDING)}
        />
    )
}

interface InnerProps extends MovingBoxProps {
    moving: boolean
    curPosX: number
    curPosY: number
    maxPosX: number
    maxPosY: number
    onDrag: (e: DraggableEvent, data: DraggableData) => void
    onDragStop: () => void
}

const MovingBoxInner = ({
    moving,
    curWidth,
    curHeight,
    color,
    onDrag,
    onDragStop,
    curPosX,
    curPosY,
    minPosX = 0,
    maxPosX,
    minPosY = 0,
    maxPosY,
    sx,
    handle,
}: InnerProps) => {
    return (
        <Box sx={{ position: "relative", width: curWidth, height: curHeight, pointerEvents: "none" }}>
            <Draggable
                allowAnyClick
                handle=".handle"
                position={{
                    x: curPosX,
                    y: curPosY,
                }}
                onDrag={onDrag}
                onStop={() => onDragStop()}
                bounds={{
                    top: minPosY || PADDING,
                    bottom: maxPosY,
                    left: minPosX || PADDING,
                    right: maxPosX,
                }}
            >
                <Box sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 99 }}>
                    {moving && (
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

                    {handle}
                </Box>
            </Draggable>
        </Box>
    )
}
