import { Box, Button, Stack, Tab, Tabs } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { SvgNext } from "../../assets"
import { shadeColor } from "../../helpers"
import { ROUTES_ARRAY } from "../../routes"
import { colors } from "../../theme/theme"
import { User } from "../../types"

const DRAWER_BAR_WIDTH = 3 // rem
const BUTTON_WIDTH = 17 //rem

export const DrawerButtons = ({
    primaryColor,
    secondaryColor,
    user,
    openLeftDrawer,
}: {
    primaryColor: string
    secondaryColor: string
    user?: User
    openLeftDrawer: () => void
}) => {
    const location = useLocation()
    const history = useHistory()

    return (
        <Stack
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
                            primaryColor={primaryColor}
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
                        backgroundColor: primaryColor,
                    },
                }}
            >
                <SvgNext size="1.6rem" fill={secondaryColor} />
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
                    fontFamily: "Nostromo Regular Bold",
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    backgroundColor: enable ? (isActive ? primaryColor : `${primaryColor}50`) : `${primaryColor}20`,
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
