import { Button, Drawer, IconButton, Stack, Typography } from "@mui/material"
import { Link, useHistory, useRouteMatch } from "react-router-dom"
import { SvgBack, SvgSupremacyLogo } from "../../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../../constants"
import { useAuth, useUI } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { ROUTES_ARRAY } from "../../../routes"
import { fonts, siteZIndex } from "../../../theme/theme"

const EXPAND_DRAWER_WIDTH = 34 //rem

export const NavLinksDrawer = () => {
    const { userID } = useAuth()
    const theme = useTheme()
    const history = useHistory()
    const { isNavLinksDrawerOpen, toggleIsNavLinksDrawerOpen } = useUI()

    const match = useRouteMatch(ROUTES_ARRAY.filter((r) => r.path !== "/").map((r) => r.path))
    let activeRouteID = "home"
    if (match) {
        const r = ROUTES_ARRAY.find((r) => r.path === match.path)
        activeRouteID = r?.id || ""
    }

    return (
        <Drawer
            transitionDuration={DRAWER_TRANSITION_DURATION}
            open={isNavLinksDrawerOpen}
            onClose={() => toggleIsNavLinksDrawerOpen(false)}
            variant="temporary"
            anchor="left"
            sx={{
                flexShrink: 0,
                width: isNavLinksDrawerOpen ? `${EXPAND_DRAWER_WIDTH}rem` : 0,
                transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1)`,
                zIndex: siteZIndex.Drawer,
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
                    <Stack spacing="1rem" direction="row" alignItems="center" sx={{ px: "1.5rem", height: `${GAME_BAR_HEIGHT}rem` }}>
                        <IconButton size="small" onClick={() => toggleIsNavLinksDrawerOpen(false)}>
                            <SvgBack size="2rem" />
                        </IconButton>

                        <Link to="/">
                            <SvgSupremacyLogo width="15rem" />
                        </Link>
                    </Stack>

                    {ROUTES_ARRAY.map((r) => {
                        if (!r.enable || !r.navLink) return null
                        const { requireAuth, requireFaction } = r
                        const { enable, label } = r.navLink
                        const disable = (requireAuth || requireFaction) && !userID
                        const navigateTo = r.path.split("/:")[0]
                        return (
                            <MenuButton
                                key={r.id}
                                label={label}
                                enable={enable && !disable}
                                onClick={() => {
                                    history.push(`${navigateTo}`)
                                    toggleIsNavLinksDrawerOpen(false)
                                }}
                                isActive={activeRouteID === r.matchNavLinkID || location.pathname === r.path}
                                primaryColor={theme.factionTheme.primary}
                                secondaryColor={theme.factionTheme.secondary}
                            />
                        )
                    })}
                </Stack>

                <Button
                    onClick={() => toggleIsNavLinksDrawerOpen(false)}
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
    )
}

const MenuButton = ({
    label,
    enable,
    isActive,
    primaryColor,
    secondaryColor,
    onClick,
}: {
    label: string
    enable?: boolean
    icon?: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    isActive?: boolean
    primaryColor: string
    secondaryColor: string
    onClick: () => void
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
        </Button>
    )
}
