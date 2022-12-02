import { Box } from "@mui/material"
import { useTheme } from "../../../../../containers/theme"
import { MechDetailsWithMaps } from "../MechLoadout/MechLoadout"
import { UnityParams, UnityViewer } from "./UnityViewer"

export interface MechViewer3DProps {
    mech: MechDetailsWithMaps
    unity: UnityParams
}

export const MechViewer3D = ({ mech, unity }: MechViewer3DProps) => {
    const theme = useTheme()
    const backgroundColor = theme.factionTheme.background

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    boxShadow: `inset 0 0 40px 40px ${backgroundColor}`,
                    zIndex: 2,
                }}
            />

            <UnityViewer mech={mech} unity={unity} />
        </Box>
    )
}
