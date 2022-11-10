import { Box } from "@mui/material"
import React from "react"
import { LobbyMech } from "../../types"

interface MechCardProps {
    mech: LobbyMech
    isGridView: boolean
}

export const MechCard = React.memo(function MechCard({ mech, isGridView }: MechCardProps) {
    return (
        <Box
            sx={{
                width: "100%",
                height: "20rem",
                background: "red",
            }}
        />
    )
})
