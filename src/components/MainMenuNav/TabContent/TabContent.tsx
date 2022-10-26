import { Box } from "@mui/material"
import { useMemo } from "react"
import { RouteGroupID, Routes } from "../../../routes"
import { TabContentItem } from "./TabContentItem"

export const TabContent = ({ activeTabID }: { activeTabID?: RouteGroupID }) => {
    const routes = useMemo(() => {
        return Routes.filter((route) => route.showInMainMenu?.groupID === activeTabID)
    }, [activeTabID])

    return (
        <Box
            sx={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(auto-fit, 28rem)",
                gap: "1.8rem",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {routes.map((route, index) => {
                return <TabContentItem key={route.id} route={route} index={index} totalItems={routes.length} />
            })}
        </Box>
    )
}
