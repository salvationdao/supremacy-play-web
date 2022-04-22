import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { TourProvider } from "@reactour/tour"
import {
    BattleEndScreen,
    BattleHistory,
    Controls,
    EarlyAccessWarning,
    LiveVotingChart,
    MiniMap,
    Notifications,
    Stream,
    tourStyles,
    tutorialNextBtn,
    tutorialPrevButton,
    VotingSystem,
    WaitingPage,
    WarMachineStats,
} from "../components"
import { Music } from "../components/Music/Music"
import { GameProvider, StreamProvider, useGameServerAuth, useGameServerWebsocket, DimensionProvider, OverlayTogglesProvider } from "../containers"
import { useToggle } from "../hooks"

const BattleArenaPageInner = () => {
    const { state } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const [haveSups, toggleHaveSups] = useToggle(true)

    return (
        <>
            <Stack sx={{ height: "100%" }}>
                <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
                    <Stream haveSups={haveSups} toggleHaveSups={toggleHaveSups} />

                    {user && haveSups && state === WebSocket.OPEN ? (
                        <>
                            <EarlyAccessWarning />
                            <VotingSystem />
                            <MiniMap />
                            <Notifications />
                            <LiveVotingChart />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <BattleHistory />
                        </>
                    ) : (
                        <WaitingPage />
                    )}
                </Box>

                <Controls />
            </Stack>

            <Music />
        </>
    )
}
export const BattleArenaPage = () => {
    const tourProviderProps = useMemo(
        () => ({
            children: <BattleArenaPageInner />,
            steps: [],
            styles: tourStyles,
            nextButton: tutorialNextBtn,
            prevButton: tutorialPrevButton,
            showBadge: false,
            disableKeyboardNavigation: true,
            disableDotsNavigation: true,
            afterOpen: () => {
                if (!localStorage.getItem("visited")) {
                    localStorage.setItem("visited", "1")
                }
            },
        }),
        [],
    )

    return (
        <StreamProvider>
            <GameProvider>
                <TourProvider {...tourProviderProps}>
                    <DimensionProvider>
                        <OverlayTogglesProvider>
                            <BattleArenaPageInner />
                        </OverlayTogglesProvider>
                    </DimensionProvider>
                </TourProvider>
            </GameProvider>
        </StreamProvider>
    )
}
