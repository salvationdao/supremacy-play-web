import { Tab, Tabs, Typography } from "@mui/material"
import { useState } from "react"
import { useTheme } from "../../../containers/theme"
import { RouteGroupID, RouteGroups } from "../../../routes"
import { fonts } from "../../../theme/theme"

export const NavTabs = () => {
    const theme = useTheme()
    const [activeTab, setActiveTab] = useState<RouteGroupID>(RouteGroupID.BattleArena)

    return (
        <Tabs
            value={activeTab}
            variant="fullWidth"
            sx={{
                height: "3.8rem",
                background: "#FFFFFF20",
                boxShadow: 1,
                zIndex: 9,
                minHeight: 0,
                ".MuiButtonBase-root": {
                    height: "3.8rem",
                    pt: "2rem",
                    minHeight: 0,
                    zIndex: 2,
                },
                ".MuiTabs-indicator": {
                    height: "100%",
                    background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}95)`,
                    zIndex: 1,
                },
            }}
            onChange={(_event, newValue) => {
                setActiveTab(newValue)
            }}
        >
            {RouteGroups.map((routeGroup) => {
                return (
                    <Tab
                        key={routeGroup.id}
                        value={routeGroup.id}
                        label={<Typography sx={{ fontFamily: fonts.nostromoBlack }}>{routeGroup.label}</Typography>}
                    />
                )
            })}
        </Tabs>
    )
}
