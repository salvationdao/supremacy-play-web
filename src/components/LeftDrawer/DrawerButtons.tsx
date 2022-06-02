import { Box, Button, Stack, Tab, Tabs } from "@mui/material"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
import { SvgNext } from "../../assets"
import { useAuth } from "../../containers"
import { useTheme } from "../../containers/theme"
import { ROUTES_ARRAY } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"

const DRAWER_BAR_WIDTH = 3 // rem
const BUTTON_WIDTH = 17 //rem

export const DrawerButtons = ({ openLeftDrawer }: { openLeftDrawer: () => void }) => {
    const { userID } = useAuth()
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))

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
            <Tabs value={0} orientation="vertical" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ flex: 1 }}>
                {ROUTES_ARRAY.map((r) => {
                    if (!r.showInLeftDrawer) return null
                    const disable = r.requireAuth && !userID
                    const root = r.path.split("/:")[0]
                    return (
                        <TabButton
                            key={r.id}
                            label={r.label}
                            enable={r.enable && !disable}
                            isComingSoon={!r.enable}
                            onClick={() => history.push(`${root}${location.hash}`)}
                            isActive={match?.path === r.path}
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

export const TabButton = ({
    label,
    enable,
    isComingSoon,
    icon,
    isActive,
    primaryColor,
    onClick,
}: {
    label: string
    enable?: boolean
    isComingSoon?: boolean
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
                    !isComingSoon ? (
                        label
                    ) : (
                        <Stack>
                            {label}
                            <br />
                            <span style={{ color: colors.neonBlue }}>(COMING SOON)</span>
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
                    fontSize: "1.1rem",
                    lineHeight: 1,
                    color: "#FFFFFF",
                    backgroundColor: enable ? (isActive ? `${primaryColor}80` : `${primaryColor}25`) : `${primaryColor}20`,
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
                }}
            />
        </Box>
    )
}
