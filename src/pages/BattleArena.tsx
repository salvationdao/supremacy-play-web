import { Box, Stack, Typography } from "@mui/material"
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
import { colors, fonts, siteZIndex } from "../theme/theme"
import { SupBackground } from "../assets"
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
                    {state === WebSocket.OPEN && user && haveSups ? (
                        <>
                            <VotingSystem />
                            <MiniMap />
                            <Notifications />
                            <LiveVotingChart />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <BattleHistory />
                        </>
                    ) : (
                        <NoGameUIScreen />
                    )}
                </Box>

                <Controls />
            </Stack>

            {state === WebSocket.OPEN && user && haveSups === false && noSupsModalOpen && <NoSupsModal onClose={() => toggleNoSupsModalOpen(false)} />}
            {user && !noSupsModalOpen && <TutorialModal />}
        </>
    )
}

// Shows a generic poster and checks wallet for sups, and toggle have sups
const NoGameUIScreen = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: `center url(${SupBackground})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: siteZIndex.RoutePage,
            }}
        >
            <Stack
                sx={{
                    position: "relative",
                    alignItems: "center",
                    textAlign: "center",
                    WebkitTextStrokeColor: "black",
                    textShadow: "1px 3px black",
                    zIndex: 2,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: fonts.nostromoHeavy,
                        WebkitTextStrokeWidth: "2px",
                        "@media (max-width:1440px)": {
                            fontSize: "5vw",
                        },
                        "@media (max-width:800px)": {
                            fontSize: "6vmin",
                        },
                    }}
                >
                    Battle Arena
                </Typography>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: fonts.nostromoBlack,
                        WebkitTextStrokeWidth: "1px",
                        "@media (max-width:1440px)": {
                            fontSize: "4vw",
                        },
                        "@media (max-width:800px)": {
                            fontSize: "5vmin",
                        },
                    }}
                >
                    Powered by <span style={{ color: colors.yellow, fontFamily: "inherit" }}>$SUPS</span>
                </Typography>
            </Stack>

            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(5,12,18,0.4)",
                    zIndex: 1,
                }}
            />
        </Box>
    )
}
