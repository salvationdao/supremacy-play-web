import { Button, Drawer, Stack, Typography } from "@mui/material"
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
import { SvgBack } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useToggle } from "../../hooks"
import { ROUTES_ARRAY } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"
import { useTheme } from "../../containers/theme"
import { useAuth } from "../../containers"

const EXPAND_DRAWER_WIDTH = 34 //rem

export const LeftDrawer = () => {
    const { userID } = useAuth()
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const [isExpanded, toggleIsExpanded] = useToggle(false)

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))
    let activeTabID = ""
    if (match) {
        const r = ROUTES_ARRAY.find((r) => r.path === match.path)
        activeTabID = r?.matchLeftDrawerID || ""
    }

    return (
        <>
            <DrawerButtons openLeftDrawer={() => toggleIsExpanded(true)} />
            <Drawer
                transitionDuration={DRAWER_TRANSITION_DURATION}
                open={isExpanded}
                onClose={() => toggleIsExpanded(false)}
                variant="temporary"
                anchor="left"
                sx={{
                    mt: `${GAME_BAR_HEIGHT}rem`,
                    flexShrink: 0,
                    width: isExpanded ? `${EXPAND_DRAWER_WIDTH}rem` : 0,
                    transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                    zIndex: siteZIndex.LeftDrawer,
                    "& .MuiDrawer-paper": {
                        width: `${EXPAND_DRAWER_WIDTH}rem`,
                        background: "none",
                        backgroundColor: (theme) => theme.factionTheme.background,
                        position: "absolute",
                        borderLeft: 0,
                    },
                }}
            >
                <Stack sx={{ height: "100%" }}>
                    <Stack sx={{ flex: 1 }}>
                        {ROUTES_ARRAY.map((r) => {
                            if (!r.leftDrawer) return null
                            const { requireAuth, requireFaction } = r
                            const { enable, label } = r.leftDrawer
                            const disable = (requireAuth || requireFaction) && !userID
                            const navigateTo = r.path.split("/:")[0]
                            return (
                                <MenuButton
                                    key={r.id}
                                    label={label}
                                    enable={enable && !disable}
                                    isComingSoon={!enable}
                                    comingSoonLabel={r.leftDrawer.comingSoonLabel}
                                    onClick={() => history.push(`${navigateTo}${location.hash}`)}
                                    isActive={activeTabID === r.matchLeftDrawerID || location.pathname === r.path}
                                    primaryColor={theme.factionTheme.primary}
                                    secondaryColor={theme.factionTheme.secondary}
                                />
                            )
                        })}
                    </Stack>

                    <Button
                        onClick={() => toggleIsExpanded(false)}
                        sx={{
                            px: "2.3rem",
                            py: "1rem",
                            justifyContent: "flex-start",
                            color: "#FFFFFF",
                            borderRadius: 0,
                            backgroundColor: "#00000040",
                            ":hover": {
                                backgroundColor: (theme) => theme.factionTheme.primary,
                                svg: {
                                    fill: (theme) => theme.factionTheme.secondary,
                                },
                                "*": { color: (theme) => `${theme.factionTheme.secondary} !important` },
                            },
                        }}
                    >
                        <SvgBack size="1.6rem" fill="#FFFFFF" />
                        <Typography sx={{ ml: "1rem", fontFamily: fonts.nostromoHeavy, whiteSpace: "nowrap", lineHeight: 1 }}>MINIMIZE</Typography>
                    </Button>
                </Stack>
            </Drawer>
        </>
    )
}

const MenuButton = ({
    label,
    enable,
    isComingSoon,
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
        <Button
            disabled={!enable}
            onClick={onClick}
            sx={{
                px: "2.3rem",
                py: "1.9rem",
                justifyContent: "flex-start",
                color: isActive ? secondaryColor : "#FFFFFF",
                backgroundColor: isActive ? primaryColor : `${primaryColor}30`,
                borderRadius: 0,
                borderBottom: `#FFFFFF20 2px solid`,
                opacity: enable ? 1 : 0.6,
                ":hover": {
                    backgroundColor: isActive ? primaryColor : `${primaryColor}50`,
                },
            }}
        >
            <Typography sx={{ color: isActive ? secondaryColor : "#FFFFFF", fontFamily: fonts.nostromoHeavy, whiteSpace: "nowrap", lineHeight: 1 }}>
                {label}
            </Typography>

            {isComingSoon && (
                <Typography variant="caption" sx={{ color: colors.neonBlue, fontFamily: fonts.nostromoBold, whiteSpace: "nowrap", lineHeight: 1 }}>
                    &nbsp;({comingSoonLabel || "COMING SOON"})
                </Typography>
            )}
        </Button>
    )
}
