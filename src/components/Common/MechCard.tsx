import { Checkbox } from "@mui/material"
import React from "react"
import { LobbyMech } from "../../types"
import { NiceBoxThing } from "./Nice/NiceBoxThing"

interface MechCardProps {
    mech: LobbyMech
    isGridView: boolean
    isSelected?: boolean
}

export const MechCard = React.memo(function MechCard({ mech, isGridView, isSelected }: MechCardProps) {
    const { name, label } = mech

    return (
        <NiceBoxThing border={{ color: "#FFFFFF60" }}>
            <Checkbox />
        </NiceBoxThing>
    )
})
