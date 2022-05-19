import { Box, Stack } from "@mui/material"
import { MechBasic, MechDetails } from "../../../../types"

export const MechLoadout = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    return (
        <Stack sx={{ flexWrap: "wrap" }}>
            <LoadoutItem />
            <LoadoutItem />
            <LoadoutItem />
            <LoadoutItem />
            <LoadoutItem />
            <LoadoutItem />
            <LoadoutItem />
        </Stack>
    )
}

const LoadoutItem = () => {
    return <Box sx={{ height: "50%", width: "7.5rem", backgroundColor: "green", border: "#FF0000 1px solid" }}></Box>
}
