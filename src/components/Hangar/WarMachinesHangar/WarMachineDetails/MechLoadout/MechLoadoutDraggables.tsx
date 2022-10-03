import { Box, Stack } from "@mui/material"
import { useRef } from "react"
import Draggable from "react-draggable"
import { colors, theme } from "../../../../../theme/theme"
import { ClipThing } from "../../../../Common/ClipThing"
import { MechLoadoutItemDraggable } from "../../Common/MechLoadoutItem"

type DragStopEvent = (clientRect: DOMRect) => void

export interface MechLoadoutDraggablesProps {
    onDragStop: DragStopEvent
}

export const MechLoadoutDraggables = ({ onDragStop }: MechLoadoutDraggablesProps) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
            }}
        >
            <MechLoadoutItemDraggable
                style={{
                    visibility: "hidden",
                }}
                label="OUTRO ANIMATION"
                primaryColor={colors.outroAnimation}
                isEmpty
            />
            <ClipThing
                clipSize="10px"
                border={{
                    borderColor: theme.factionTheme.primary,
                    borderThickness: ".3rem",
                }}
                backgroundColor={theme.factionTheme.background}
                sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            >
                <></>
            </ClipThing>
            <Stack
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "1rem",
                }}
            >
                {/*  render multiple of these */}
                <MechLoadoutDraggable onDragStop={onDragStop} />
            </Stack>
        </Box>
    )
}

interface MechLoadoutDraggableProps {
    onDragStop: DragStopEvent
}

const MechLoadoutDraggable = ({ onDragStop }: MechLoadoutDraggableProps) => {
    const draggableRef = useRef<HTMLDivElement>(null)

    return (
        <Box
            sx={{
                "&:hover": {
                    transition: "transform .1s ease-out",
                    transform: "scale(1.1)",
                    cursor: "grab",
                },
                "&:active": {
                    transition: "transform .1s ease-in",
                    transform: "scale(1.0)",
                    cursor: "grabbing",
                },
            }}
        >
            <Draggable
                position={{ x: 0, y: 0 }}
                // onStart={this.handleStart}
                // onDrag={this.handleDrag}
                onStop={() => {
                    if (!draggableRef.current) return
                    onDragStop(draggableRef.current.getBoundingClientRect())
                }}
            >
                <MechLoadoutItemDraggable ref={draggableRef} label="OUTRO ANIMATION" primaryColor={colors.outroAnimation} isEmpty />
            </Draggable>
        </Box>
    )
}
