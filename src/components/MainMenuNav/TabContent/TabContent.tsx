import { Box, Fade } from "@mui/material"
import { useMemo } from "react"
import { MainMenuExternalLinks, RouteGroupID, Routes } from "../../../routes"
import { TabContentItem } from "./TabContentItem"

export const TabContent = ({ activeTabID }: { activeTabID?: RouteGroupID }) => {
    const routes = useMemo(() => {
        return Routes.filter((route) => route.showInMainMenu?.groupID === activeTabID)
    }, [activeTabID])

    const externalLinks = useMemo(() => {
        return MainMenuExternalLinks.filter((externalLink) => externalLink.groupID === activeTabID)
    }, [activeTabID])

    return (
        <Fade key={activeTabID} in>
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
                {routes
                    .filter((route) => route.showInMainMenu && route.enable)
                    .map((route, index) => {
                        if (!route.showInMainMenu || !route.enable) return null
                        return (
                            <TabContentItem
                                key={route.id}
                                mainMenuStruct={route.showInMainMenu}
                                index={index}
                                totalItems={routes.length + externalLinks.length}
                            />
                        )
                    })}

                {externalLinks.map((externalLink, index) => {
                    return (
                        <TabContentItem
                            key={index}
                            mainMenuStruct={externalLink}
                            index={routes.length + index}
                            totalItems={routes.length + externalLinks.length}
                        />
                    )
                })}
            </Box>
        </Fade>
    )
}
