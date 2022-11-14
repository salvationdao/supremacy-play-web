import { Stack, SxProps, Tab, Tabs, Typography } from "@mui/material"
import { useEffect } from "react"
import { useTheme } from "../../../containers/theme"
import { TruncateTextLines } from "../../../theme/styles"
import { fonts } from "../../../theme/theme"
import { ArrowButton } from "./ArrowButton"

export const TAB_HEIGHT = 3.8 // rems

export interface OneTab<T> {
    id: T
    label: string
}

export const NavTabs = <T,>({
    activeTabID,
    setActiveTabID,
    tabs,
    prevTab,
    nextTab,
    sx,
}: {
    activeTabID?: T
    setActiveTabID: React.Dispatch<React.SetStateAction<T | undefined>>
    tabs: OneTab<T>[]
    prevTab: (activeTabID: T) => void
    nextTab: (activeTabID: T) => void
    sx?: SxProps
}) => {
    const theme = useTheme()

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!activeTabID) return
            if (e.key.toLowerCase() === "q" || e.key === "ArrowLeft") prevTab(activeTabID)
            if (e.key.toLowerCase() === "e" || e.key === "ArrowRight") nextTab(activeTabID)
        }

        const cleanup = () => {
            document.removeEventListener("keydown", onKeyDown)
        }

        cleanup()
        document.addEventListener("keydown", onKeyDown)

        return cleanup
    }, [activeTabID, nextTab, prevTab])

    if (!activeTabID) {
        return null
    }

    return (
        <Stack direction="row" alignItems="center" spacing=".5rem" sx={sx}>
            <ArrowButton keyboardKey="Q" onClick={() => activeTabID && prevTab(activeTabID)} isLeft />

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
                    ".MuiTab-root": { minWidth: "21rem" },
                    ".MuiButtonBase-root": {
                        height: `${TAB_HEIGHT}rem`,
                        pt: `${TAB_HEIGHT / 2}rem`,
                        minHeight: 0,
                        py: 0,
                        zIndex: 2,
                    },
                    ".MuiTabs-indicator": {
                        height: "100%",
                        background: `linear-gradient(${theme.factionTheme.primary} 30%, ${theme.factionTheme.primary}BA)`,
                        zIndex: 1,
                        transition: "none",
                    },
                }}
                onChange={(_event, newValue) => {
                    setActiveTabID(newValue)
                }}
            >
                {tabs.map((tab, i) => {
                    return (
                        <Tab
                            key={i}
                            value={tab.id}
                            label={
                                <Typography
                                    sx={{
                                        color: tab.id === activeTabID ? theme.factionTheme.secondary : "#FFFFFF",
                                        fontFamily: fonts.nostromoBlack,
                                        ...TruncateTextLines(1),
                                    }}
                                >
                                    {tab.label}
                                </Typography>
                            }
                        />
                    )
                })}
            </Tabs>

            <ArrowButton keyboardKey="E" onClick={() => activeTabID && nextTab(activeTabID)} isRight />
        </Stack>
    )
}
