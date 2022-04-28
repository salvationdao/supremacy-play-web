import { Box, Button, Stack, Tab, Tabs, useTheme, Theme } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { SvgNext } from "../../assets"
import { ROUTES_ARRAY } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"

const DRAWER_BAR_WIDTH = 3 // rem
const BUTTON_WIDTH = 17 //rem

export const DrawerButtons = ({ openLeftDrawer }: { openLeftDrawer: () => void }) => {
    const theme = useTheme<Theme>()
    const location = useLocation()
    const history = useHistory()

    return (
        <Stack
            sx={{
                flexShrink: 0,
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: `${DRAWER_BAR_WIDTH}rem`,
                backgroundColor: (theme) => theme.factionTheme.background,
                zIndex: siteZIndex.LeftDrawer,
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
            <Tabs value={location.pathname} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {ROUTES_ARRAY.filter((r) => r.showInLeftDrawer).map((r) => {
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={r.enable}
                            value={r.path}
                            onClick={() => history.push(r.path)}
                            isActive={location.pathname === r.path}
                            primaryColor={theme.factionTheme.primary}
                            secondaryColor={theme.factionTheme.secondary}
                        />
                    )
                })}
            </Tabs>

            <Button
                onClick={() => openLeftDrawer()}
                sx={{
                    minWidth: 0,
                    color: "#FFFFFF",
                    borderRadius: 0,
                    ":hover": {
                        backgroundColor: (theme) => theme.factionTheme.primary,
                        svg: {
                            fill: (theme) => theme.factionTheme.secondary,
                        },
                    },
                }}
            >
                <SvgNext size="1.6rem" fill="#FFFFFF" />
            </Button>
        </Stack>
    )
}

const TabButton = ({
    label,
    value,
    enable,
    icon,
    isActive,
    primaryColor,
    onClick,
}: {
    label: string
    value: string
    enable?: boolean
    icon?: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    isActive?: boolean
    primaryColor: string
    secondaryColor: string
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
                label={
                    enable ? (
                        label
                    ) : (
                        <Stack>
                            {label}
                            <br />
                            <span style={{ color: colors.neonBlue }}>(COMING SOON)</span>
                        </Stack>
                    )
                }
                value={value}
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
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    backgroundColor: enable ? (isActive ? `${primaryColor}60` : `${primaryColor}25`) : `${primaryColor}20`,
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
