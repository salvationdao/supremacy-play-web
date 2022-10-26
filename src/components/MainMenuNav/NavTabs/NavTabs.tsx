import { Stack, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useEffect } from "react"
import { useTheme } from "../../../containers/theme"
import { RouteGroupID, RouteGroups } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { ArrowButton } from "./ArrowButton"

export const TAB_HEIGHT = 3.8 // rems

export const NavTabs = ({
    activeTabID,
    setActiveTabID,
}: {
    activeTabID?: RouteGroupID
    setActiveTabID: React.Dispatch<React.SetStateAction<RouteGroupID | undefined>>
}) => {
    const theme = useTheme()

    const prevTab = useCallback(() => {
        const curIndex = RouteGroups.findIndex((routeGroup) => routeGroup.id === activeTabID)
        const newIndex = curIndex - 1 < 0 ? RouteGroups.length - 1 : curIndex - 1
        setActiveTabID(RouteGroups[newIndex].id)
    }, [activeTabID, setActiveTabID])

    const nextTab = useCallback(() => {
        const curIndex = RouteGroups.findIndex((routeGroup) => routeGroup.id === activeTabID)
        const newIndex = (curIndex + 1) % RouteGroups.length
        setActiveTabID(RouteGroups[newIndex].id)
    }, [activeTabID, setActiveTabID])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "q") prevTab()
            if (e.key.toLowerCase() === "e") nextTab()
        }

        const cleanup = () => {
            document.removeEventListener("keydown", onKeyDown)
        }

        cleanup()
        document.addEventListener("keydown", onKeyDown)

        return cleanup
    }, [nextTab, prevTab])

    return (
        <Stack direction="row" alignItems="center" spacing=".5rem">
            <ArrowButton keyboardKey="Q" onClick={prevTab} isLeft />

            <Tabs
                value={activeTabID}
                variant="fullWidth"
                sx={{
                    flex: 1,
                    height: `${TAB_HEIGHT}rem`,
                    background: "#FFFFFF20",
                    boxShadow: 1,
                    zIndex: 9,
                    minHeight: 0,
                    ".MuiButtonBase-root": {
                        height: `${TAB_HEIGHT}rem`,
                        pt: `${TAB_HEIGHT / 2}rem`,
                        minHeight: 0,
                        py: 0,
                        zIndex: 2,
                    },
                    ".MuiTabs-indicator": {
                        height: "100%",
                        background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}95)`,
                        zIndex: 1,
                    },
                }}
                onChange={(_event, newValue) => {
                    setActiveTabID(newValue)
                }}
            >
                {RouteGroups.map((routeGroup) => {
                    return (
                        <Tab
                            key={routeGroup.id}
                            value={routeGroup.id}
                            label={
                                <Typography
                                    sx={{
                                        color: theme.factionTheme.secondary,
                                        fontFamily: fonts.nostromoBlack,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        overflowWrap: "anywhere",
                                        textOverflow: "ellipsis",
                                        WebkitLineClamp: 1, // change to max number of lines
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {routeGroup.label}
                                </Typography>
                            }
                        />
                    )
                })}
            </Tabs>

            <ArrowButton keyboardKey="E" onClick={nextTab} isRight />
        </Stack>
    )
}
