import { Box, Stack, Tab, Tabs } from "@mui/material"
import { useAuth } from "../../containers"
import { useTheme } from "../../containers/theme"
import { RIGHT_DRAWER_ARRAY } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"

const BUTTON_WIDTH = 17 //rem
const DRAWER_BAR_WIDTH = 3 // rem

export const DrawerButtons = ({
    drawerActiveTabID,
    setDrawerActiveTabID,
}: {
    drawerActiveTabID: string
    setDrawerActiveTabID: React.Dispatch<React.SetStateAction<string>>
}) => {
    const theme = useTheme()
    const { userID } = useAuth()

    return (
        <Box
            sx={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
                background: (theme) => `linear-gradient(to right, #FFFFFF06 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.Drawer,
                ".MuiTabs-flexContainer": {
                    "& > :not(:last-child)": {
                        mb: ".2rem",
                    },
                },
                ".MuiTabs-indicator": {
                    display: "none",
                },
                ".MuiSvgIcon-root": {
                    fill: `${colors.neonBlue} !important`,
                    width: "3rem",
                    height: "3rem",
                },
            }}
        >
            <Tabs value={0} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {RIGHT_DRAWER_ARRAY.map((r) => {
                    if (r.requireAuth && !userID) return null
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={true}
                            icon={r.icon}
                            onClick={() => {
                                setDrawerActiveTabID((prev) => {
                                    if (r.id === prev) {
                                        return ""
                                    }
                                    return r.id
                                })
                            }}
                            isActive={r.id === drawerActiveTabID}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                        />
                    )
                })}
            </Tabs>
        </Box>
    )
}

export const TabButton = ({
    label,
    enable,
    isComingSoon,
    icon,
    isActive,
    primaryColor,
    secondaryColor,
    onClick,
    comingSoonLabel,
}: {
    label: string
    enable?: boolean
    isComingSoon?: boolean
    icon?: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    isActive?: boolean
    primaryColor: string
    secondaryColor: string
    onClick: () => void
    comingSoonLabel?: string
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
                label={
                    !isComingSoon ? (
                        label
                    ) : (
                        <Stack>
                            {label}
                            <br />
                            <span style={{ color: colors.neonBlue }}>({comingSoonLabel || "COMING SOON"})</span>
                        </Stack>
                    )
                }
                icon={icon}
                iconPosition="end"
                onClick={onClick}
                disabled={!enable}
                sx={{
                    p: 0,
                    pt: ".2rem",
                    position: "absolute",
                    whiteSpace: "nowrap",
                    fontFamily: fonts.nostromoBold,
                    fontSize: "1.2rem",
                    lineHeight: 1,
                    color: isActive ? secondaryColor : "#FFFFFF",
                    backgroundColor: enable ? (isActive ? `${primaryColor}CC` : `${primaryColor}25`) : `${primaryColor}20`,
                    opacity: isActive ? 1 : 0.6,
                    transform: `translate(${-BUTTON_WIDTH / 2 + DRAWER_BAR_WIDTH / 2}rem, ${BUTTON_WIDTH / 2 - DRAWER_BAR_WIDTH / 2}rem) rotate(-90deg)`,
                    ":hover": {
                        opacity: 1,
                    },
                    "&, .MuiTouchRipple-root": {
                        width: `${BUTTON_WIDTH}rem`,
                        height: `${DRAWER_BAR_WIDTH}rem`,
                        minHeight: `${DRAWER_BAR_WIDTH}rem`,
                    },
                    "& svg": {
                        fill: isActive ? `${secondaryColor} !important` : "#FFFFFF",
                    },
                }}
            />
        </Box>
    )
}
