import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { TourProvider } from "@reactour/tour"
import {
    BattleEndScreen,
    BattleHistory,
    Controls,
    LiveVotingChart,
    MiniMap,
    NoSupsModal,
    Notifications,
    Stream,
    tourStyles,
    tutorialNextBtn,
    tutorialPrevButton,
    VotingSystem,
    WarMachineStats,
} from "../components"
import { GameProvider, StreamProvider, useGameServerAuth, useGameServerWebsocket, DimensionProvider, OverlayTogglesProvider, useWallet } from "../containers"
import { useToggle } from "../hooks"
import { colors } from "../theme/theme"
import { SupBackground } from "../assets"
import { TutorialModal } from "../components/Tutorial/TutorialModal"

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

const BattleArenaPageInner = () => {
    const { state } = useGameServerWebsocket()
    const { user } = useGameServerAuth()
    const [haveSups, toggleHaveSups] = useToggle(true)

    return (
        <>
            <Stack sx={{ height: "100%" }}>
                <Box id="game-ui-container" sx={{ position: "relative", flex: 1 }}>
                    {state === WebSocket.OPEN && user && haveSups ? (
                        <>
                            <Stream />
                            <VotingSystem />
                            <MiniMap />
                            <Notifications />
                            <LiveVotingChart />
                            <WarMachineStats />
                            <BattleEndScreen />
                            <BattleHistory />
                        </>
                    ) : (
                        <NoGameUIScreen haveSups={haveSups} toggleHaveSups={toggleHaveSups} />
                    )}
                </Box>

                <Controls />
            </Stack>

            <NoSupsModal haveSups={haveSups} />
            <TutorialModal />
        </>
    )
}

// Shows a generic poster and checks wallet for sups, and toggle have sups
const NoGameUIScreen = ({ haveSups, toggleHaveSups }: { haveSups: boolean; toggleHaveSups: (value?: boolean) => void }) => {
    const { onWorldSups } = useWallet()
    const firstIteration = useRef(true)

    useEffect(() => {
        if (!onWorldSups) return

        const supsAboveZero = onWorldSups ? onWorldSups.isGreaterThan(0) : false

        if (supsAboveZero && !haveSups) return toggleHaveSups(true)
        if (!supsAboveZero && haveSups) return toggleHaveSups(false)
        if (firstIteration.current) {
            toggleHaveSups(supsAboveZero)
            firstIteration.current = false
        }
    }, [onWorldSups, haveSups])

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
                zIndex: 0,
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
                        fontFamily: "Nostromo Regular Heavy",
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
                        fontFamily: "Nostromo Regular Black",
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
