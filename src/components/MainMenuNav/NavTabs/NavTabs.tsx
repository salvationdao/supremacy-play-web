import { Stack, Tab, Tabs, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { RouteGroupID, RouteGroups } from "../../../routes"
import { fonts } from "../../../theme/theme"
import { KeyboardKey } from "../../Common/KeyboardKey"
import { NiceButton } from "../../Common/Nice/NiceButton"

const HEIGHT = 3.8 // rems

export const NavTabs = () => {
    const theme = useTheme()
    const [activeTab, setActiveTab] = useState<RouteGroupID>(RouteGroupID.BattleArena)

    const prevTab = useCallback(() => {
        const curIndex = RouteGroups.findIndex((routeGroup) => routeGroup.id === activeTab)
        const newIndex = curIndex - 1 < 0 ? RouteGroups.length - 1 : curIndex - 1
        setActiveTab(RouteGroups[newIndex].id)
    }, [activeTab])

    const nextTab = useCallback(() => {
        const curIndex = RouteGroups.findIndex((routeGroup) => routeGroup.id === activeTab)
        const newIndex = (curIndex + 1) % RouteGroups.length
        setActiveTab(RouteGroups[newIndex].id)
    }, [activeTab])

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
                value={activeTab}
                variant="fullWidth"
                sx={{
                    flex: 1,
                    height: `${HEIGHT}rem`,
                    background: "#FFFFFF20",
                    boxShadow: 1,
                    zIndex: 9,
                    minHeight: 0,
                    ".MuiButtonBase-root": {
                        height: `${HEIGHT}rem`,
                        pt: `${HEIGHT / 2}rem`,
                        minHeight: 0,
                        zIndex: 2,
                    },
                    ".MuiTabs-indicator": {
                        height: "100%",
                        background: `linear-gradient(${theme.factionTheme.primary} 26%, ${theme.factionTheme.primary}95)`,
                        zIndex: 1,
                    },
                }}
                onChange={(_event, newValue) => {
                    setActiveTab(newValue)
                }}
            >
                {RouteGroups.map((routeGroup) => {
                    return (
                        <Tab
                            key={routeGroup.id}
                            value={routeGroup.id}
                            label={<Typography sx={{ fontFamily: fonts.nostromoBlack }}>{routeGroup.label}</Typography>}
                        />
                    )
                })}
            </Tabs>

            <ArrowButton keyboardKey="E" onClick={nextTab} isRight />
        </Stack>
    )
}

const ArrowButton = ({ keyboardKey, onClick, isLeft, isRight }: { keyboardKey: string; onClick: () => void; isLeft?: boolean; isRight?: boolean }) => {
    return (
        <NiceButton sx={{ height: `${HEIGHT}rem`, border: "none" }} onClick={onClick} background={{ color: ["#FFFFFF20"] }}>
            <Stack direction="row" alignItems="center" spacing=".4rem">
                {isLeft && <Typography>◄</Typography>}
                <KeyboardKey variant="body2" label={keyboardKey} />
                {isRight && <Typography>►</Typography>}
            </Stack>
        </NiceButton>
    )
}
