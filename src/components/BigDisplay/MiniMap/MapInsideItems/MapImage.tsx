import { Box } from "@mui/material"
import React from "react"
import { Map } from "../../../../types"

export const MapImage = React.memo(function MapImage({ map }: { map: Map }) {
    return (
        <Box
            sx={{
                position: "absolute",
                width: `${map.Width}px`,
                height: `${map.Height}px`,
                backgroundImage: `url(${map.Image_Url})`,
                borderSpacing: 0,
            }}
        />
    )
})
