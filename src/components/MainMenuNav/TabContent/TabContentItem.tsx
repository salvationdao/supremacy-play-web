import { Box } from "@mui/material"
import { RouteSingle } from "../../../routes"

export const TabContentItem = ({ route, index }: { route: RouteSingle; index: number }) => {
    return <Box sx={{ width: "100%", height: "100%", backgroundColor: "#FFFFFF30" }}>{index}</Box>
}
