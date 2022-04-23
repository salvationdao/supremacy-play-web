import { Button, Drawer, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { SvgBack } from "../../assets"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT } from "../../constants"
import { useGameServerAuth } from "../../containers"
import { shadeColor } from "../../helpers"
import { useToggle } from "../../hooks"
import { ROUTES_ARRAY } from "../../routes"
import { colors } from "../../theme/theme"
import { DrawerButtons } from "./DrawerButtons"

const EXPAND_DRAWER_WIDTH = 30 //rem

export const LeftDrawer = () => {
    const { user } = useGameServerAuth()
    const location = useLocation()
    const history = useHistory()
    const [isExpanded, toggleIsExpanded] = useToggle(false)
    const primaryColor = useMemo(() => (user && user.faction ? user.faction.theme.primary : colors.darkerNeonBlue), [user])
    const secondaryColor = useMemo(() => (user && user.faction ? user.faction.theme.secondary : "#FFFFFF"), [user])

    return (
        <>
            <DrawerButtons primaryColor={primaryColor} secondaryColor={secondaryColor} user={user} openLeftDrawer={() => toggleIsExpanded(true)} />
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
                    zIndex: 9999999999,
                    "& .MuiDrawer-paper": {
                        width: `${EXPAND_DRAWER_WIDTH}rem`,
                        background: "none",
                        backgroundColor: user && user.faction ? shadeColor(user.faction.theme.primary, -93) : colors.darkNavyBlue,
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
                                    primaryColor={primaryColor}
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
                                backgroundColor: primaryColor,
                            },
                        }}
                    >
                        <SvgBack size="1.6rem" />
                        <Typography sx={{ ml: "1rem", color: secondaryColor, fontFamily: "Nostromo Regular Heavy", whiteSpace: "nowrap", lineHeight: 1 }}>
                            MINIMISE
                        </Typography>
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
    onClick,
}: {
    label: string
    enable?: boolean
    icon?: string | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
    isActive?: boolean
    primaryColor: string
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
                color: "#FFFFFF",
                backgroundColor: isActive ? primaryColor : `${primaryColor}50`,
                borderRadius: 0,
                borderBottom: `#FFFFFF20 2px solid`,
                opacity: enable ? 1 : 0.5,
                ":hover": {
                    backgroundColor: isActive ? primaryColor : `${primaryColor}50`,
                },
            }}
        >
            <Typography sx={{ fontFamily: "Nostromo Regular Heavy", whiteSpace: "nowrap", lineHeight: 1 }}>{label}</Typography>
            {!enable && (
                <Typography variant="caption" sx={{ color: colors.neonBlue, fontFamily: "Nostromo Regular Bold", whiteSpace: "nowrap", lineHeight: 1 }}>
                    &nbsp;(COMING SOON)
                </Typography>
            )}
        </Button>
    )
}
