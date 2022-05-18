import { Button, Drawer, Stack, Typography } from "@mui/material"
import { useHistory, useLocation } from "react-router-dom"
import { SvgBack } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useToggle } from "../../hooks"
import { ROUTES_ARRAY } from "../../routes"
import { colors, fonts, siteZIndex } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"
import { useTheme } from "../../containers/theme"

const EXPAND_DRAWER_WIDTH = 30 //rem

export const LeftDrawer = () => {
    const theme = useTheme()
    const location = useLocation()
    const history = useHistory()
    const [isExpanded, toggleIsExpanded] = useToggle(false)

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
                        {ROUTES_ARRAY.filter((r) => r.showInLeftDrawer).map((r) => {
                            return (
                                <MenuButton
                                    key={r.id}
                                    label={r.label}
                                    enable={r.enable}
                                    onClick={() => history.push(r.path)}
                                    isActive={location.pathname === r.path}
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
                        <Typography sx={{ ml: "1rem", fontFamily: fonts.nostromoHeavy, whiteSpace: "nowrap", lineHeight: 1 }}>MINIMISE</Typography>
                    </Button>
                </Stack>
            </Drawer>
        </>
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
            {!enable && (
                <Typography variant="caption" sx={{ color: colors.neonBlue, fontFamily: fonts.nostromoBold, whiteSpace: "nowrap", lineHeight: 1 }}>
                    &nbsp;(COMING SOON)
                </Typography>
            )}
        </Button>
    )
}
