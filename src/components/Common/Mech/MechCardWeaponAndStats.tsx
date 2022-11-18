import { Stack } from "@mui/material"
import React from "react"
import { colors } from "../../../theme/theme"
import { NewMechStruct } from "../../../types"
import { NiceBoxThing } from "../Nice/NiceBoxThing"

export const MechCardWeaponAndStats = React.memo(function MechCardWeaponAndStats({
    mech,
    isSelected,
    toggleSelected,
}: {
    mech: NewMechStruct
    isSelected?: boolean
    toggleSelected?: (mech: NewMechStruct) => void
}) {
    return (
        <NiceBoxThing
            border={{
                color: isSelected ? `${colors.neonBlue}80` : "#FFFFFF20",
                thickness: isSelected ? "lean" : "very-lean",
            }}
            background={{ colors: ["#FFFFFF", "#FFFFFF"], opacity: 0.06 }}
            sx={{ p: "1rem 1.5rem" }}
        >
            <Stack direction="row"></Stack>
        </NiceBoxThing>
    )
})
