import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgAbility, SvgHistory, SvgHistoryClock, SvgRobot } from "../assets"
import {
    BattleEndScreen,
    BattleHistory,
    Controls,
    EarlyAccessWarning,
    LiveVotingChart,
    MiniMap,
    Notifications,
    Stream,
    VotingSystem,
    WarMachineStats,
} from "../components"
import { TutorialModal } from "../components/HowToPlay/Tutorial/TutorialModal"
import { QuickDeploy } from "../components/QuickDeploy/QuickDeploy"
import { QuickPlayerAbilities } from "../components/QuickPlayerAbilities/QuickPlayerAbilities"
import { useAuth, useDimension, useMobile, useSupremacy } from "../containers"
import { siteZIndex } from "../theme/theme"
import { FeatureName } from "../types"

export const BattleArenaPage = () => {
    const { userID } = useAuth()
    const [understand, setUnderstand] = useState(true)

    useEffect(() => {
        if (!userID) return
        setUnderstand(localStorage.getItem(`understand-${userID}`) === "true")
    }, [userID])

    if (!understand && userID) {
        return (
            <EarlyAccessWarning
                onAcknowledged={() => {
                    localStorage.setItem(`understand-${userID}`, "true")
                    setUnderstand(true)
                }}
            />
        )
    }

    return <BattleArenaPageInner />
}

const BattleArenaPageInner = () => {
    const { userID, userHasFeature } = useAuth()
    const { isMobile, setAdditionalTabs, setIsNavOpen, allowCloseNav } = useMobile()
    const { isQuickDeployOpen, toggleIsQuickDeployOpen, isQuickPlayerAbilitiesOpen, toggleIsQuickPlayerAbilitiesOpen } = useSupremacy()
    const { recalculateDimensions } = useDimension()

    // When its mobile, we have tabs
    useEffect(() => {
        recalculateDimensions()

        if (!isMobile) return
        allowCloseNav.current = false

        const tabs = [
            {
                id: "battle-arena",
                hash: "#battle-arena",
                icon: <SvgAbility size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "BATTLE ARENA",
                Component: () => (
                    <Stack sx={{ height: "100%" }}>
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
                                    <Notifications />
                                    <WarMachineStats />
                                    <MiniMap />
                                    <VotingSystem />
                                    <LiveVotingChart />
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                ),
            },
        ]

        if (userID) {
            tabs.push({
                id: "quick-deploy",
                hash: "#quick-deploy",
                icon: <SvgRobot size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "QUICK DEPLOY",
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
            })
        }

        if (userHasFeature(FeatureName.playerAbility)) {
            tabs.push({
                id: "buy-abilities",
                hash: "#buy-abilities",
                icon: <SvgAbility size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "BUY ABILITIES",
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
    }, [allowCloseNav, isMobile, recalculateDimensions, setAdditionalTabs, setIsNavOpen, userHasFeature, userID])

    return (
        <>
            <Stack sx={{ height: "100%", zIndex: siteZIndex.RoutePage }}>
                <Box id={isMobile ? "" : "game-ui-container"} sx={{ position: "relative", flex: 1 }}>
                    <Stream />

                    {!isMobile && (
                        <>
                            <Notifications />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <LiveVotingChart />
                            <BattleHistory />
                            {isQuickDeployOpen && <QuickDeploy open={isQuickDeployOpen} onClose={() => toggleIsQuickDeployOpen(false)} />}

                            {isQuickPlayerAbilitiesOpen && (
                                <QuickPlayerAbilities open={isQuickPlayerAbilitiesOpen} onClose={() => toggleIsQuickPlayerAbilitiesOpen(false)} />
                            )}

                            <VotingSystem />
                            <MiniMap />
                        </>
                    )}

                    {userID && <TutorialModal />}
                </Box>

                <Controls />
            </Stack>
        </>
    )
}
