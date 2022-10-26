import { Box } from "@mui/material"
import { useMemo } from "react"
import { RouteGroupID, Routes } from "../../../routes"
import { TabContentItem } from "./TabContentItem"

export const TabContent = ({ activeTabID }: { activeTabID: RouteGroupID }) => {
    const routes = useMemo(() => {
        return Routes.filter((route) => route.showInMainMenu?.groupID === activeTabID)
    }, [activeTabID])

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1.2rem",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {routes.map((route) => {
                return <TabContentItem key={route.id} route={route} />
            })}
        </Box>
    )
}
