import { Box, Tab, Tabs } from "@mui/material"
import { DrawerPanels } from ".."
import { SvgChat, SvgRobot } from "../../assets"
import { RIGHT_DRAWER_BUTTON_WIDTH } from "../../constants"
import { useGameServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { colors } from "../../theme/theme"

const BUTTON_WIDTH = 17 //rem

export const DrawerButtons = ({
    activePanel,
    togglePanel,
}: {
    activePanel: DrawerPanels
    togglePanel: (newPanel: DrawerPanels, value?: boolean | undefined) => void
}) => {
    const { user } = useGameServerAuth()
    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${RIGHT_DRAWER_BUTTON_WIDTH}rem`,
                backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -93) : colors.darkNavyBlue,
                ".MuiTabs-flexContainer": {
                    "& > :not(:last-child)": {
                        mb: ".2rem",
                    },
                },
                ".MuiSvgIcon-root": {
                    fill: "#FFFFFF !important",
                },
            }}
        >
            <Tabs orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ height: "100%" }}>
                <TabButton
                    label="WAR ROOM"
                    icon={<SvgChat size="1rem" sx={{ pt: ".3rem" }} />}
                    onClick={() => togglePanel(DrawerPanels.LiveChat)}
                    isActive={activePanel === DrawerPanels.LiveChat}
                    primaryColor={user && user.faction ? user.faction.theme.primary : colors.darkerNeonBlue}
                />
                <TabButton
                    label="ACTIVE PLAYERS"
                    icon={<SvgChat size="1.1rem" sx={{ pt: ".3rem" }} />}
                    onClick={() => togglePanel(DrawerPanels.PlayerList)}
                    isActive={activePanel === DrawerPanels.PlayerList}
                    primaryColor={user && user.faction ? user.faction.theme.primary : colors.darkerNeonBlue}
                />
                <TabButton
                    label="WAR MACHINES"
                    icon={<SvgRobot size="1.3rem" />}
                    onClick={() => togglePanel(DrawerPanels.Assets)}
                    isActive={activePanel === DrawerPanels.Assets}
                    primaryColor={user && user.faction ? user.faction.theme.primary : colors.darkerNeonBlue}
                />
            </Tabs>
        </Box>
    )
}

const TabButton = ({
    label,
    icon,
    isActive,
    primaryColor,
    onClick,
}: {
    label: string
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
                width: `${RIGHT_DRAWER_BUTTON_WIDTH}rem`,
            }}
        >
            <Tab
                label={label}
                icon={icon}
                iconPosition="end"
                onClick={onClick}
                sx={{
                    p: 0,
                    pt: ".2rem",
                    position: "absolute",
                    whiteSpace: "nowrap",
                    fontFamily: "Nostromo Regular Bold",
                    fontSize: "1.2rem",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    backgroundColor: isActive ? primaryColor : `${primaryColor}50`,
                    opacity: isActive ? 0.9 : 0.6,
                    transform: `translate(${-BUTTON_WIDTH / 2 + RIGHT_DRAWER_BUTTON_WIDTH / 2}rem, ${
                        BUTTON_WIDTH / 2 - RIGHT_DRAWER_BUTTON_WIDTH / 2
                    }rem) rotate(-90deg)`,
                    ":hover": {
                        opacity: 1,
                    },
                    "&, .MuiTouchRipple-root": {
                        width: `${BUTTON_WIDTH}rem`,
                        height: `${RIGHT_DRAWER_BUTTON_WIDTH}rem`,
                        minHeight: `${RIGHT_DRAWER_BUTTON_WIDTH}rem`,
                    },
                }}
            />
        </Box>
    )
}
