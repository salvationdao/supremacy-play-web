import { MechSlot } from "./MechSlot"
import { Stack } from "@mui/material"
import React, { useMemo } from "react"
import { MechBasicWithQueueStatus } from "../../../../types"

interface SelectedMechSlotsProps {
    selectedMechs: MechBasicWithQueueStatus[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<MechBasicWithQueueStatus[]>>
}

export const SelectedMechSlots = ({ selectedMechs, setSelectedMechs }: SelectedMechSlotsProps) => {
    const mechSlots = useMemo(() => {
        const list: (MechBasicWithQueueStatus | null)[] = [...selectedMechs]

        while (list.length < 3) {
            list.push(null)
        }

        return list
    }, [selectedMechs])

    return (
        <Stack
            direction="row"
            spacing="1rem"
            sx={{
                height: "25rem",
                width: "100%",
            }}
        >
            {mechSlots.map((ms, i) => (
                <MechSlot key={i} battleLobbyMech={ms} />
            ))}
        </Stack>
    )
}
