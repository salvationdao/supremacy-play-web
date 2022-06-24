import { Box, Stack } from "@mui/material"
import { useState } from "react"
import {
    BattleEndScreen,
    BattleHistory,
    Controls,
    EarlyAccessWarning,
    LiveVotingChart,
    MiniMap,
    NoSupsModal,
    Notifications,
    Stream,
    VotingSystem,
    WarMachineStats,
} from "../components"
import { TutorialModal } from "../components/HowToPlay/Tutorial/TutorialModal"
import { QuickDeploy } from "../components/QuickDeploy/QuickDeploy"
import { Trailer } from "../components/Stream/Trailer"
import { DimensionProvider, GameProvider, OverlayTogglesProvider, StreamProvider, useAuth, useSupremacy } from "../containers"
import { MiniMapProvider } from "../containers/minimap"
import { useToggle } from "../hooks"
import { siteZIndex } from "../theme/theme"

export const BattleArenaPage = () => {
    const [understand, toggleUnderstand] = useToggle()

    if (!understand) return <EarlyAccessWarning onAcknowledged={() => toggleUnderstand(true)} />

    return (
        <StreamProvider>
            <GameProvider>
                <DimensionProvider>
                    <OverlayTogglesProvider>
                        <MiniMapProvider>
                            <BattleArenaPageInner />
                        </MiniMapProvider>
                    </OverlayTogglesProvider>
                </DimensionProvider>
            </GameProvider>
        </StreamProvider>
    )
}

const BattleArenaPageInner = () => {
    const { userID } = useAuth()
    const { isServerUp, haveSups, mechDeployModalOpen, toggleMechDeployModalOpen } = useSupremacy()
    const [noSupsModalOpen, toggleNoSupsModalOpen] = useToggle(true)
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")

    return (
        <>
            <Stack sx={{ height: "100%", zIndex: siteZIndex.RoutePage }}>
                <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
                    {!watchedTrailer ? <Trailer watchedTrailer={watchedTrailer} setWatchedTrailer={setWatchedTrailer} /> : <Stream />}

                    {isServerUp && watchedTrailer && (
                        <>
                            <MiniMap />
                            <Notifications />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <LiveVotingChart />
                            <BattleHistory />
                            <VotingSystem />

                            {mechDeployModalOpen && <QuickDeploy open={mechDeployModalOpen} onClose={() => toggleMechDeployModalOpen(false)} />}
                            {isServerUp && userID && haveSups === false && noSupsModalOpen && <NoSupsModal onClose={() => toggleNoSupsModalOpen(false)} />}
                            {userID && !noSupsModalOpen && <TutorialModal />}
                        </>
                    )}
                </Box>

                <Controls />
            </Stack>
        </>
    )
}
