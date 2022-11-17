import React from "react"
import { NewMechStruct } from "../../types"
import { SortTypeLabel } from "../../types/marketplace"

const sortOptions = [
    { label: SortTypeLabel.Alphabetical, value: SortTypeLabel.Alphabetical },
    { label: SortTypeLabel.AlphabeticalReverse, value: SortTypeLabel.AlphabeticalReverse },
    { label: SortTypeLabel.RarestAsc, value: SortTypeLabel.RarestAsc },
    { label: SortTypeLabel.RarestDesc, value: SortTypeLabel.RarestDesc },
]

export const MechSelector = React.memo(function MechSelector({
    selectedMechs,
    setSelectedMechs,
    limit,
}: {
    selectedMechs: NewMechStruct[]
    setSelectedMechs: React.Dispatch<React.SetStateAction<NewMechStruct[]>>
    limit?: number
}) {
    return null
})
