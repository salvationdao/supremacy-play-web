import { Box, Tab, Tabs } from "@mui/material"
import { useMemo } from "react"
import { DrawerPanels } from ".."
import { SvgChat, SvgRobot } from "../../assets"
import { useGameServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

const DRAWER_BAR_WIDTH = 3 // rem
const BUTTON_WIDTH = 17 //rem

export const DrawerButtons = ({
    activePanel,
    togglePanel,
}: {
    activePanel: DrawerPanels
    togglePanel: (newPanel: DrawerPanels, value?: boolean | undefined) => void
}) => {
    const { user } = useGameServerAuth()
    const primaryColor = useMemo(() => (user && user.faction ? user.faction.theme.primary : colors.darkerNeonBlue), [user])
    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
                backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -93) : colors.darkNavyBlue,
                zIndex: 9999,
                ".MuiTabs-flexContainer": {
                    "& > :not(:last-child)": {
                        mb: ".2rem",
                    },
                },
                ".MuiTabs-indicator": {
                    display: "none",
                },
                ".MuiSvgIcon-root": {
                    fill: "#FFFFFF !important",
                },
            }}
        >
            <Tabs value={activePanel} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ height: "100%" }}>
                <TabButton
                    label="WAR ROOM"
                    value={DrawerPanels.LiveChat}
                    icon={<SvgChat size="1rem" sx={{ pt: ".3rem" }} />}
                    onClick={() => togglePanel(DrawerPanels.LiveChat)}
                    isActive={activePanel === DrawerPanels.LiveChat}
                    primaryColor={primaryColor}
                />
                <TabButton
                    label="ACTIVE PLAYERS"
                    value={DrawerPanels.PlayerList}
                    icon={
                        <Box sx={{ pb: ".2rem" }}>
                            <Box sx={{ width: ".8rem", height: ".8rem", borderRadius: "50%", backgroundColor: primaryColor }} />
                        </Box>
                    }
                    onClick={() => togglePanel(DrawerPanels.PlayerList)}
                    isActive={activePanel === DrawerPanels.PlayerList}
                    primaryColor={primaryColor}
                />
                <TabButton
                    label="WAR MACHINES"
                    value={DrawerPanels.Assets}
                    icon={<SvgRobot size="1.3rem" />}
                    onClick={() => togglePanel(DrawerPanels.Assets)}
                    isActive={activePanel === DrawerPanels.Assets}
                    primaryColor={primaryColor}
                />
            </Tabs>
        </Box>
    )
}

const TabButton = ({
    label,
    value,
    icon,
    isActive,
    primaryColor,
    onClick,
}: {
    label: string
    value: string
    icon?: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    isActive?: boolean
    primaryColor: string
    onClick: () => void
}) => {
    return (
        <Box
            sx={{
                position: "relative",
                height: `${BUTTON_WIDTH}rem`,
                width: `${DRAWER_BAR_WIDTH}rem`,
            }}
        >
            <Tab
                label={label}
                value={value}
                icon={icon}
                iconPosition="end"
                onClick={onClick}
                sx={{
                    p: 0,
                    pt: ".2rem",
                    position: "absolute",
                    whiteSpace: "nowrap",
                    fontFamily: "Nostromo Regular Bold",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    backgroundColor: isActive ? primaryColor : `${primaryColor}50`,
                    opacity: isActive ? 0.9 : 0.6,
                    transform: `translate(${-BUTTON_WIDTH / 2 + DRAWER_BAR_WIDTH / 2}rem, ${BUTTON_WIDTH / 2 - DRAWER_BAR_WIDTH / 2}rem) rotate(-90deg)`,
                    ":hover": {
                        opacity: 1,
                    },
                    "&, .MuiTouchRipple-root": {
                        width: `${BUTTON_WIDTH}rem`,
                        height: `${DRAWER_BAR_WIDTH}rem`,
                        minHeight: `${DRAWER_BAR_WIDTH}rem`,
                    },
                }}
            />
        </Box>
    )
}
