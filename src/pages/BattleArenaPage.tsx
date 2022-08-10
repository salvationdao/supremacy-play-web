import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import { SvgAbility, SvgHistory, SvgHistoryClock, SvgRobot } from "../assets"
import { BattleEndScreen, BattleHistory, Controls, EarlyAccessWarning, MiniMap, Notifications, Stream, VotingSystem, WarMachineStats } from "../components"
import { QuickDeploy } from "../components/QuickDeploy/QuickDeploy"
import { QuickPlayerAbilities } from "../components/QuickPlayerAbilities/QuickPlayerAbilities"
import { BATTLE_ARENA_OPEN } from "../constants"
import { useAuth, useDimension, useMobile, useSupremacy } from "../containers"
import { siteZIndex } from "../theme/theme"
import { FeatureName } from "../types"
import { EnlistPage } from "./EnlistPage"

export const BattleArenaPage = () => {
    const { userID } = useAuth()
    const [understand, setUnderstand] = useState(true)

    useEffect(() => {
        if (!userID) return
        setUnderstand(localStorage.getItem(`understand1-${userID}`) === "true")
    }, [userID])

    if (!understand && userID) {
        return (
            <EarlyAccessWarning
                onAcknowledged={() => {
                    localStorage.setItem(`understand1-${userID}`, "true")
                    setUnderstand(true)
                }}
            />
        )
    }

    if (!BATTLE_ARENA_OPEN) {
        return <Redirect to="/fleet#live_chat" />
    }

    return <BattleArenaPageInner />
}

const BattleArenaPageInner = () => {
    const { userID, factionID, userHasFeature } = useAuth()
    const { isMobile, isMobileHorizontal, setAdditionalTabs, setIsNavOpen, allowCloseNav } = useMobile()
    const { isQuickDeployOpen, toggleIsQuickDeployOpen, isQuickPlayerAbilitiesOpen, toggleIsQuickPlayerAbilitiesOpen } = useSupremacy()
    const { triggerReset } = useDimension()

    // When its mobile, we have tabs
    useEffect(() => {
        triggerReset()

        if (!isMobile) return
        allowCloseNav.current = false

        const tabs = [
            {
                id: "battle-arena",
                hash: "#battle-arena",
                icon: <SvgAbility size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "BATTLE ARENA",
                requireAuth: false,
                Component: () => (
                    <Stack sx={{ height: "100%" }}>
                        {/* <Notifications /> */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                ml: ".4rem",
                                mr: ".8rem",
                                pr: ".1rem",
                                mt: ".6rem",
                                mb: "2rem",
                                direction: "ltr",
                                scrollbarWidth: "none",
                                "::-webkit-scrollbar": {
                                    width: ".4rem",
                                },
                                "::-webkit-scrollbar-track": {
                                    background: "#FFFFFF15",
                                    borderRadius: 3,
                                },
                                "::-webkit-scrollbar-thumb": {
                                    background: (theme) => theme.factionTheme.primary,
                                    borderRadius: 3,
                                },
                            }}
                        >
                            <Box sx={{ direction: "ltr", height: 0 }}>
                                <Stack spacing="1.5rem" sx={{ position: "relative", p: ".8rem 1rem" }}>
                                    <VotingSystem />
                                    <MiniMap />
                                    <WarMachineStats />
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                ),
            },
            {
                id: "quick-deploy",
                hash: "#quick-deploy",
                icon: <SvgRobot size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "QUICK DEPLOY",
                requireAuth: true,
                Component: () => (
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <QuickDeploy
                            open
                            onClose={() => {
                                return
                            }}
                        />
                    </Stack>
                ),
            },
        ]

        if (userHasFeature(FeatureName.playerAbility)) {
            tabs.push({
                id: "buy-abilities",
                hash: "#buy-abilities",
                icon: <SvgAbility size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "BUY ABILITIES",
                requireAuth: true,
                Component: () => (
                    <Stack sx={{ position: "relative", height: "100%" }}>
                        <QuickPlayerAbilities
                            open
                            onClose={() => {
                                return
                            }}
                        />
                    </Stack>
                ),
            })
        }

        tabs.push({
            id: "prev-battle",
            hash: "#prev-battle",
            icon: <SvgHistoryClock size="1.2rem" sx={{ pt: ".1rem" }} />,
            label: "PREVIOUS BATTLE",
            requireAuth: false,
            Component: () => (
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <BattleEndScreen />
                </Stack>
            ),
        })

        tabs.push({
            id: "history",
            hash: "#history",
            icon: <SvgHistory size="1.2rem" sx={{ pt: ".1rem" }} />,
            label: "HISTORY",
            requireAuth: false,
            Component: () => (
                <Stack sx={{ position: "relative", height: "100%" }}>
                    <BattleHistory />
                </Stack>
            ),
        })

        setAdditionalTabs(tabs)
        setIsNavOpen(true)

        // Remove tabs on unmount
        return () => {
            allowCloseNav.current = true
            setAdditionalTabs([])
            setIsNavOpen(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowCloseNav, isMobile, triggerReset, setAdditionalTabs, setIsNavOpen])

    if (userID && !factionID) {
        return <EnlistPage />
    }

    return (
        <Stack
            sx={{
                position: isMobileHorizontal ? "fixed" : "relative",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: isMobileHorizontal ? siteZIndex.Bar + 10 : siteZIndex.RoutePage,
            }}
        >
            <Box id={isMobile ? "" : "game-ui-container"} sx={{ position: "relative", flex: 1 }}>
                <Stream />

                {!isMobile && (
                    <>
                        <WarMachineStats />

                        <BattleEndScreen />

                        <BattleHistory />

                        {isQuickDeployOpen && <QuickDeploy open={isQuickDeployOpen} onClose={() => toggleIsQuickDeployOpen(false)} />}

                        {isQuickPlayerAbilitiesOpen && (
                            <QuickPlayerAbilities open={isQuickPlayerAbilitiesOpen} onClose={() => toggleIsQuickPlayerAbilitiesOpen(false)} />
                        )}

                        <VotingSystem />

                        <MiniMap />
                    </>
                )}

                <Notifications />
            </Box>

            <Controls />
        </Stack>
    )
}
