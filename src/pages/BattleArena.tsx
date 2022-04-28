import { Box, Stack } from "@mui/material"
import {
    BattleEndScreen,
    BattleHistory,
    Controls,
    LiveVotingChart,
    MiniMap,
    NoSupsModal,
    Notifications,
    Stream,
    VotingSystem,
    WarMachineStats,
} from "../components"
import { GameProvider, StreamProvider, useGameServerAuth, useGameServerWebsocket, DimensionProvider, OverlayTogglesProvider, useSupremacy } from "../containers"
import { siteZIndex } from "../theme/theme"
import { TutorialModal } from "../components/HowToPlay/Tutorial/TutorialModal"
import { useToggle } from "../hooks"

export const BattleArenaPage = () => {
    return (
        <StreamProvider>
            <GameProvider>
                <DimensionProvider>
                    <OverlayTogglesProvider>
                        <BattleArenaPageInner />
                    </OverlayTogglesProvider>
                </DimensionProvider>
            </GameProvider>
        </StreamProvider>
    )
}

const BattleArenaPageInner = () => {
    const { state } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const { haveSups } = useSupremacy()
    const [noSupsModalOpen, toggleNoSupsModalOpen] = useToggle(true)

    return (
        <>
            <Stack sx={{ height: "100%", zIndex: siteZIndex.RoutePage }}>
                <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
                    <Stream />

                    {state === WebSocket.OPEN && (
                        <>
                            <MiniMap />
                            <Notifications />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <LiveVotingChart />
                            <BattleHistory />
                            <VotingSystem />
                        </>
                    )}
                </Box>

                <Controls />
            </Stack>

            {state === WebSocket.OPEN && user && haveSups === false && noSupsModalOpen && <NoSupsModal onClose={() => toggleNoSupsModalOpen(false)} />}
            {user && !noSupsModalOpen && <TutorialModal />}
        </>
    )
}
