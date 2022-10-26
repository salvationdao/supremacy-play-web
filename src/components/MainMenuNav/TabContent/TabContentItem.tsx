import { Box, Typography } from "@mui/material"
import { RouteSingle } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { KeyboardKey } from "../../Common/KeyboardKey"

export const TabContentItem = ({ route, index }: { route: RouteSingle; index: number }) => {
    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#FFFFFF30" }}>
            <Typography sx={{ position: "absolute", top: "1.2rem", left: "1.3rem", fontFamily: fonts.nostromoBlack }}>{route.showInMainMenu?.label}</Typography>
            <KeyboardKey variant="body2" sx={{ position: "absolute", top: "1.1rem", right: "1.3rem" }} label={`${index}`} />
        </Box>
    )
}
