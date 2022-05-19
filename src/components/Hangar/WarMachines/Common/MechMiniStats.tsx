import { Stack } from "@mui/material"
import { ClipThing } from "../../.."
import { MechBasic, MechDetails } from "../../../../types"

export const MechMiniStats = ({ mech, mechDetails }: { mech: MechBasic; mechDetails?: MechDetails }) => {
    return (
        <ClipThing clipSize="10px" opacity={0.1} backgroundColor="#FFFFFF" sx={{ height: "100%", flexShrink: 0 }}>
            <Stack sx={{ height: "100%", width: "9rem" }}>CONTENT</Stack>
        </ClipThing>
    )
}
