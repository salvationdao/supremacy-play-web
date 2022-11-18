import React from "react"
import { NewMechStruct } from "../../../types"

export const MechCardWeaponAndStats = React.memo(function MechCardWeaponAndStats({
    mech,
    isSelected,
    toggleSelected,
}: {
    mech: NewMechStruct
    isSelected?: boolean
    toggleSelected?: (mech: NewMechStruct) => void
}) {
    return null
})
