import { Stack } from "@mui/material"
import { useImperativeHandle } from "react"
import { CustomDragEventWithType, DragStartEventWithType, DragStopEventWithType } from "./Draggables/LoadoutDraggable"
import { MechSkinDraggablesProps } from "./Draggables/MechSkinDraggables"
import { WeaponDraggables, WeaponDraggablesProps } from "./WeaponDraggables"

export type DraggablesHandle = {
    handleMechLoadoutUpdated: () => void
}

export interface MechLoadoutDraggablesProps extends WeaponDraggablesProps, MechSkinDraggablesProps {
    draggablesRef: React.ForwardedRef<DraggablesHandle>
}

export interface DragWithTypesProps {
    onDrag: CustomDragEventWithType
    onDragStart: DragStartEventWithType
    onDragStop: DragStopEventWithType
}

export const MechLoadoutDraggables = ({
    draggablesRef,
    drag,
    excludeWeaponIDs,
    excludeMechSkinIDs,
    includeMechSkinIDs,
    mechModelID,
}: MechLoadoutDraggablesProps) => {
    useImperativeHandle(draggablesRef, () => ({
        handleMechLoadoutUpdated: () => {
            console.log("updated")
        },
    }))

    return (
        <Stack spacing="1rem">
            <WeaponDraggables drag={drag} excludeWeaponIDs={excludeWeaponIDs} />
        </Stack>
    )
}
