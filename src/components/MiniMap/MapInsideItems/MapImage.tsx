import { Box } from "@mui/material"
import React from "react"
import { Map } from "../../../types"

export const MapImage = React.memo(function MapImage({ map }: { map: Map }) {
    return (
        <Box
            sx={{
                position: "absolute",
                width: `${map.width}px`,
                height: `${map.height}px`,
                backgroundImage: `url(${map.image_url})`,
                borderSpacing: 0,
            }}
        />
    )
})
