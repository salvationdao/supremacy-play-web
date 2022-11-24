import { MechSlot } from "./MechSlot"
import { Stack } from "@mui/material"
import React, { useMemo } from "react"
import { NewMechStruct } from "../../../types"

interface SelectedMechSlotsProps {
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
}

export const SelectedMechSlots = ({ selectedMechs, setSelectedMechs }: SelectedMechSlotsProps) => {
    const mechSlots = useMemo(() => {
        const list: (NewMechStruct | null)[] = [...selectedMechs]

        while (list.length < 3) {
            list.push(null)
        }

        return list
    }, [selectedMechs])

    return (
        <Stack
            direction="row"
            spacing="1rem"
            flex={1}
            sx={{
                width: "100%",
            }}
        >
            {mechSlots.map((ms, i) => (
                <MechSlot key={i} lobbyMech={ms} canLeave leftQueue={() => setSelectedMechs((prev) => prev.filter((p) => p.id !== ms?.id))} />
            ))}
        </Stack>
    )
}
