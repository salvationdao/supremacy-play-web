import { Box, Stack } from "@mui/material"
import { useEffect, useState } from "react"
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
import { Trailer } from "../components/Stream/Trailer"
import { DimensionProvider, GameProvider, OverlayTogglesProvider, StreamProvider, useAuth, useSupremacy } from "../containers"
import { MiniMapProvider } from "../containers/minimap"
import { siteZIndex } from "../theme/theme"

export const BattleArenaPage = () => {
    return <BattleArenaPageInner />
}

const BattleArenaPageInner = () => {
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

    return (
        <StreamProvider>
            <GameProvider>
                <DimensionProvider>
                    <OverlayTogglesProvider>
                        <MiniMapProvider>
                            <Contents />
                        </MiniMapProvider>
                    </OverlayTogglesProvider>
                </DimensionProvider>
            </GameProvider>
        </StreamProvider>
    )
}

const Contents = () => {
    const { userID } = useAuth()
    const { isServerUp, isQuickDeployOpen, toggleIsQuickDeployOpen, isQuickPlayerAbilitiesOpen, toggleIsQuickPlayerAbilitiesOpen } = useSupremacy()
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")

    return (
        <>
            <Stack sx={{ height: "100%", zIndex: siteZIndex.RoutePage }}>
                <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
                    {!watchedTrailer ? <Trailer watchedTrailer={watchedTrailer} setWatchedTrailer={setWatchedTrailer} /> : <Stream />}

                    {isServerUp && watchedTrailer && (
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

                            {userID && <TutorialModal />}
                        </>
                    )}
                </Box>

                <Controls />
            </Stack>
        </>
    )
}
