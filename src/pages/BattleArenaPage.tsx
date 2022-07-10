import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { SvgChat } from "../assets"
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
import { Trailer } from "../components/Stream/Trailer"
import { useAuth, useMobile, useSupremacy } from "../containers"
import { siteZIndex } from "../theme/theme"

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
    const { userID } = useAuth()
    const { isMobile, setAdditionalTabs } = useMobile()
    const { isServerUp, isQuickDeployOpen, toggleIsQuickDeployOpen } = useSupremacy()

    useEffect(() => {
        if (!isMobile) return
        setAdditionalTabs([
            {
                id: "battle-arena",
                hash: "#battle-arena",
                icon: <SvgChat size="1.2rem" sx={{ pt: ".1rem" }} />,
                label: "BATTLE ARENA",
                Component: () => (
                    <Box id={isMobile ? "game-ui-container" : ""} sx={{ position: "relative", height: "100%" }}>
                        <Notifications />
                        <WarMachineStats />
                        <BattleEndScreen />
                        <LiveVotingChart />
                        <BattleHistory />
                        <VotingSystem />
                        <MiniMap />
                    </Box>
                ),
            },
        ])
    }, [isMobile, setAdditionalTabs])

    return (
        <>
            <Stack sx={{ height: "100%", zIndex: siteZIndex.RoutePage }}>
                <Box id={isMobile ? "" : "game-ui-container"} sx={{ position: "relative", flex: 1 }}>
                    <Trailer />
                    <Stream />

                    {isServerUp && !isMobile && (
                        <>
                            <Notifications />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <LiveVotingChart />
                            <BattleHistory />
                            {isQuickDeployOpen && <QuickDeploy open={isQuickDeployOpen} onClose={() => toggleIsQuickDeployOpen(false)} />}
                            <VotingSystem />
                            <MiniMap />
                        </>
                    )}

                    {isServerUp && userID && <TutorialModal />}
                </Box>

                <Controls />
            </Stack>
        </>
    )
}
