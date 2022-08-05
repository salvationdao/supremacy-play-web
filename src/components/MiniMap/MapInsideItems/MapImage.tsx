import { Box } from "@mui/material"
import { Crosshair } from "../../../assets"
import { Map } from "../../../types"
import { LineSelect } from "./LineSelect"

export const MapImage = ({
    map,
    mapScale,
    mapElement,
    onClick,
    isLocationSelection,
    isLineSelection,
}: {
    map: Map
    mapScale: number
    mapElement: React.MutableRefObject<HTMLDivElement | undefined>
    onClick: React.MouseEventHandler<HTMLDivElement>
    isLocationSelection: boolean
    isLineSelection: boolean
}) => {
    return (
        <Box
            ref={mapElement}
            onClick={onClick}
            sx={{
                position: "absolute",
                width: `${map.width}px`,
                height: `${map.height}px`,
                backgroundImage: `url(${map.image_url})`,
                cursor: isLocationSelection || isLineSelection ? `url(${Crosshair}) 14.5 14.5, auto` : "move",
                borderSpacing: 0,
            }}
        >
            {isLineSelection && <LineSelect mapScale={mapScale} />}
        </Box>
    )
}
