import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt"
import { Box, Drawer, IconButton, Stack, styled, Tab, Tabs, Theme, useTheme } from "@mui/material"
import React from "react"
import { useHistory, useLocation } from "react-router-dom"
import { DRAWER_TRANSITION_DURATION, GAME_BAR_HEIGHT, LEFT_DRAWER_WIDTH } from "../../constants"
import { shadeColor } from "../../helpers"
import { useToggle } from "../../hooks"
import { RoutePaths, TabLabels } from "../../routes"
import { colors } from "../../theme/theme"

const BUTTON_WIDTH = 20 //rem
const ICON_BUTTON_WIDTH = 5 // rem
const EXPAND_DRAWER_WIDTH = 30 //rem

const LEFT_DRAWER_TABS = [
    {
        label: TabLabels.BattleArena,
        path: RoutePaths.BattleArena,
    },
    {
        label: TabLabels.hangar,
        path: RoutePaths.hangar,
    },
    {
        label: TabLabels.Marketplace,
        path: RoutePaths.Marketplace,
    },
    {
        label: TabLabels.Contracts,
        path: RoutePaths.Contracts,
        disabled: true,
    },
]

const NUM_BUTTONS = LEFT_DRAWER_TABS.length

export const LeftDrawer: React.FC = () => {
    const theme = useTheme<Theme>()
    const location = useLocation()
    const [isExpanded, toggleIsExpanded] = useToggle(false)
    const history = useHistory()

    return (
        <>
            {isExpanded && <Box sx={{ width: `${LEFT_DRAWER_WIDTH}rem` }} />}
            <Container expand={isExpanded.toString()}>
                <Drawer
                    transitionDuration={DRAWER_TRANSITION_DURATION}
                    open={isExpanded}
                    variant="persistent"
                    anchor="left"
                    sx={{
                        zIndex: 1,
                        width: isExpanded ? `${EXPAND_DRAWER_WIDTH}rem` : 0,
                        "& .MuiDrawer-paper": {
                            background: colors.black3,
                            position: "absolute",
                            border: 0,
                        },
                    }}
                >
                    <StyledTabs value={location.pathname} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile orientation="vertical">
                        {LEFT_DRAWER_TABS.map((tab) => (
                            <TabButton
                                disabled={tab.disabled}
                                key={tab.label}
                                value={location.pathname}
                                label={
                                    tab.disabled ? (
                                        <Stack
                                            sx={{
                                                "& span": {
                                                    fontSize: "10px",
                                                    color: colors.darkNeonBlue,
                                                    letterSpacing: ".2rem",
                                                },
                                            }}
                                        >
                                            {tab.label} <span>Coming soon</span>
                                        </Stack>
                                    ) : (
                                        tab.label
                                    )
                                }
                                onClick={() => {
                                    history.push(tab.path)
                                    toggleIsExpanded()
                                }}
                                sx={{
                                    width: `${EXPAND_DRAWER_WIDTH}rem`,
                                    alignItems: "flex-start",
                                    background: location.pathname === tab.path ? shadeColor(theme.factionTheme.primary, -70) : colors.black3,
                                    color: location.pathname === tab.path ? theme.factionTheme.primary : "white",
                                    "&:hover": {
                                        background: theme.factionTheme.primary,
                                        color: "white",
                                        opacity: "unset",
                                    },
                                }}
                            />
                        ))}
                    </StyledTabs>
                </Drawer>
                {!isExpanded && (
                    <StyledTabs value={location.pathname} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                        {LEFT_DRAWER_TABS.map((tab) => (
                            <TabButton
                                disabled={tab.disabled}
                                key={tab.label}
                                value={location.pathname}
                                label={
                                    tab.disabled ? (
                                        <Stack
                                            sx={{
                                                "& span": {
                                                    fontSize: "10px",
                                                    color: colors.darkNeonBlue,
                                                    letterSpacing: ".2rem",
                                                },
                                            }}
                                        >
                                            {tab.label} <span>Coming soon</span>
                                        </Stack>
                                    ) : (
                                        tab.label
                                    )
                                }
                                onClick={() => history.push(tab.path)}
                                sx={{
                                    background: location.pathname === tab.path ? shadeColor(theme.factionTheme.primary, -70) : colors.black3,
                                    color: location.pathname === tab.path ? theme.factionTheme.primary : "white",
                                    "&:hover": {
                                        background: shadeColor(theme.factionTheme.primary, -20),
                                        color: "white",
                                        opacity: "unset",
                                    },
                                }}
                            />
                        ))}
                    </StyledTabs>
                )}
                <IconButton
                    onClick={() => toggleIsExpanded()}
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: "2rem",
                        width: isExpanded ? `${EXPAND_DRAWER_WIDTH}rem` : `${LEFT_DRAWER_WIDTH}rem`,
                        height: `${ICON_BUTTON_WIDTH}rem`,
                        borderRadius: 0,
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        zIndex: 9999,
                        background: isExpanded ? theme.factionTheme.primary : colors.black3,
                        transition: `all ${DRAWER_TRANSITION_DURATION}ms cubic-bezier(0, 0, 0.2, 1) 0ms`,
                        "&:hover": {
                            background: theme.factionTheme.primary,
                            color: "white",
                            opacity: "unset",
                        },
                        "&>span": {
                            fontFamily: "Nostromo Regular Bold",
                        },
                    }}
                >
                    <ArrowRightAltIcon fontSize="large" sx={{ color: "white", transform: `scale(1.5) ${isExpanded ? "rotate(-180deg)" : ""}` }} />
                    {isExpanded && <span>Minimise</span>}
                </IconButton>
            </Container>
        </>
    )
}

const TabButton = styled(Tab)({
    whiteSpace: "nowrap",
    fontFamily: "Nostromo Regular Bold",
    fontSize: "1.6rem",
    width: `${BUTTON_WIDTH}rem`,
    height: `${LEFT_DRAWER_WIDTH}rem`,
    color: "white",
    "&.Mui-selected": {
        color: "white",
    },
})

const StyledTabs = styled(Tabs)((props: { orientation?: string }) => {
    return {
        background: colors.black2,
        transform:
            props.orientation === "vertical"
                ? "unset"
                : `translate(-50%, calc(${NUM_BUTTONS * (BUTTON_WIDTH / 2)}rem - ${LEFT_DRAWER_WIDTH / 2}rem)) rotate(-90deg)`,
        position: props.orientation === "vertical" ? "static" : "absolute",
        left: props.orientation === "vertical" ? "unset" : "50%",
        height: props.orientation === "vertical" ? "fit-content" : `${LEFT_DRAWER_WIDTH}rem`,
        overflowX: "auto",
        width: "fit-content",
        "& .MuiTabs-flexContainer": {
            flexDirection: props.orientation === "vertical" ? "column" : "row-reverse",
            gap: ".3rem",
        },
        "& 	.MuiTabs-indicator": {
            display: "none",
        },
    }
})

const Container = styled("div")((props: { expand: string }) => {
    return {
        background: props.expand === "true" ? "transparent" : colors.black3,
        position: props.expand === "true" ? "fixed" : "relative",
        top: props.expand === "true" ? `${GAME_BAR_HEIGHT}rem` : "unset",
        left: 0,
        zIndex: 99999999,
        width: props.expand === "true" ? "fit-content" : `${LEFT_DRAWER_WIDTH}rem`,
        overflowX: "hidden",
        height: "100%",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    }
})
