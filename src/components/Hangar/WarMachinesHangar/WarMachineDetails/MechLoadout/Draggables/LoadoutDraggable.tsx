import { Box } from "@mui/material"
import { useMemo, useRef } from "react"
import Draggable from "react-draggable"
import { AssetItemType, MechSkin, PowerCore, Utility, Weapon } from "../../../../../../types"

export type CustomDragEvent = (clientRect: DOMRect) => void
export type CustomDragEventWithType = (clientRect: DOMRect, type: AssetItemType) => void
export type DragStartEvent = () => void
export type DragStartEventWithType = (type: AssetItemType) => void
export type DragStopEvent = (clientRect: DOMRect) => void
export type DragStopEventWithType = (clientRect: DOMRect, type: AssetItemType, item: Weapon | PowerCore | Utility | MechSkin) => void

interface LoadoutDraggableProps {
    renderDraggable: (ref: React.RefObject<HTMLDivElement>) => JSX.Element
    drag?: DragProps
}

interface DragProps {
    onDrag: CustomDragEvent
    onDragStart: DragStartEvent
    onDragStop: DragStopEvent
}

export const LoadoutDraggable = ({ renderDraggable, drag }: LoadoutDraggableProps) => {
    const draggableRef = useRef<HTMLDivElement>(null)

    const content = useMemo(() => {
        if (drag) {
            const { onDrag, onDragStart, onDragStop } = drag
            return (
                <Draggable
                    position={{ x: 0, y: 0 }}
                    onDrag={() => {
                        if (!draggableRef.current) return
                        onDrag(draggableRef.current.getBoundingClientRect())
                    }}
                    onStart={() => {
                        if (!draggableRef.current) return
                        onDragStart()
                    }}
                    onStop={() => {
                        if (!draggableRef.current) return
                        onDragStop(draggableRef.current.getBoundingClientRect())
                    }}
                >
                    {renderDraggable(draggableRef)}
                </Draggable>
            )
        }
        return renderDraggable(draggableRef)
    }, [drag, renderDraggable])

    return (
        <Box
            sx={{
                "&:hover": {
                    transition: "transform .1s ease-out",
                    transform: "scale(1.1)",
                    cursor: drag ? "grab" : "pointer",
                },
                "&:active": {
                    transition: "transform .1s ease-in",
                    transform: "scale(1.0)",
                    cursor: drag ? "grabbing" : "pointer",
                },
            }}
        >
            {content}
        </Box>
    )
}
