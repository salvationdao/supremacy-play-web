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
    WarMachineStats
} from "../components"
import { TutorialModal } from "../components/HowToPlay/Tutorial/TutorialModal"
import { DimensionProvider, GameProvider, OverlayTogglesProvider, StreamProvider, useGameServerAuth, useGameServerWebsocket, useSupremacy } from "../containers"
import { UserConsumablesProvider } from "../containers/consumables"
import { MiniMapProvider } from "../containers/minimap"
import { useToggle } from "../hooks"
import { siteZIndex } from "../theme/theme"

export const BattleArenaPage = () => {
    return (
        <StreamProvider>
            <GameProvider>
                    <UserConsumablesProvider>
                        <DimensionProvider>
                            <OverlayTogglesProvider>
                <MiniMapProvider>
                                <BattleArenaPageInner />
                </MiniMapProvider>
                            </OverlayTogglesProvider>
                        </DimensionProvider>
                    </UserConsumablesProvider>
            </GameProvider>
        </StreamProvider>
    )
}

const BattleArenaPageInner = () => {
    const { state } = useGameServerWebsocket()
    const { userID } = useGameServerAuth()
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

            {state === WebSocket.OPEN && userID && haveSups === false && noSupsModalOpen && <NoSupsModal onClose={() => toggleNoSupsModalOpen(false)} />}
            {userID && !noSupsModalOpen && <TutorialModal />}
        </>
    )
}
