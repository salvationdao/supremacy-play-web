import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { RepairAgent } from "../../../../types/jobs"
import { ProgressBar } from "../../../Common/ProgressBar"
import { Game, GamePattern, GameState } from "./src/game"

export const StackTower = React.memo(function StackTower({
    primaryColor,
    disableGame,
    repairAgent,
    agentRepairUpdate,
    completeAgentRepair,
}: {
    primaryColor: string
    disableGame: boolean
    repairAgent?: RepairAgent
    agentRepairUpdate: (repairAgentID: string, gamePattern: GamePattern) => Promise<boolean>
    completeAgentRepair: (repairAgentID: string) => Promise<boolean>
}) {
    // Game data
    const [gameState, setGameState] = useState<GameState>(GameState.Loading)
    const [score, setScore] = useState(0)
    const [cumulativeScore, setCumulativeScore] = useState(0)

    // As the player plays the mini game, this will be the game updates
    const oneNewGamePattern = useCallback(
        async (gamePattern: GamePattern) => {
            setScore(gamePattern?.score)

            if (repairAgent?.id) {
                const resp = await agentRepairUpdate(repairAgent.id, gamePattern)
                if (resp) {
                    setCumulativeScore((prev) => {
                        const newCumScore = prev + 1
                        if (repairAgent?.id && newCumScore === repairAgent?.required_stacks) {
                            completeAgentRepair(repairAgent.id)
                            setCumulativeScore(0)
                        }
                        return newCumScore
                    })
                }
            }
        },
        [agentRepairUpdate, completeAgentRepair, repairAgent?.id, repairAgent?.required_stacks],
    )

    return (
        <Box
            sx={{
                height: "100%",
                p: "1.8rem 3rem",
                border: `${primaryColor}70 2px solid`,
                backgroundColor: `${primaryColor}30`,
                boxShadow: 2,
                borderRadius: 1.3,
            }}
        >
            <Stack
                spacing="1rem"
                sx={{
                    height: "100%",
                    transition: "all .1s",
                    filter: disableGame ? "blur(4px)" : "unset",
                    opacity: disableGame ? 0.15 : 1,
                    pointerEvents: disableGame ? "none" : "all",
                }}
            >
                <Stack spacing=".7rem" sx={{ pb: ".4rem" }}>
                    <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { color: colors.neonBlue } }}>
                        YOU NEED A TOTAL OF <span>{repairAgent?.required_stacks || "XXX"}</span> STACKS TO REPAIR A SINGLE BLOCK!
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing="1rem">
                        <Stack sx={{ flex: 1 }}>
                            <ProgressBar
                                color={colors.green}
                                backgroundColor={colors.red}
                                orientation="horizontal"
                                thickness="12px"
                                percent={(100 * cumulativeScore) / (repairAgent?.required_stacks || 100)}
                            />
                        </Stack>

                        <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                            {cumulativeScore}/{repairAgent?.required_stacks || "XXX"}
                        </Typography>
                    </Stack>
                </Stack>

                <Box sx={{ position: "relative", flex: 1, border: "#FFFFFF20 1px solid" }}>
                    <TowerStackInner score={score} gameState={gameState} setGameState={setGameState} oneNewGamePattern={oneNewGamePattern} />
                </Box>

                <Typography sx={{ color: colors.lightGrey }}>
                    <i>
                        <strong>NOTE:</strong> Your submission will be rejected if there are too many failed attempts.
                    </i>
                </Typography>
            </Stack>
        </Box>
    )
})

const TowerStackInner = ({
    score,
    gameState,
    setGameState,
    oneNewGamePattern,
}: {
    score: number
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    oneNewGamePattern: (gamePattern: GamePattern) => void
}) => {
    const theme = useTheme()

    return useMemo(() => {
        return (
            <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", userSelect: "none" }}>
                <StaticGame backgroundColor={theme.factionTheme.background} setGameState={setGameState} oneNewGamePattern={oneNewGamePattern} />

                {/* Score */}
                <Stack
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        top: "20%",
                        left: 0,
                        right: 0,
                        transition: "all .4s ease",
                        transform:
                            gameState === GameState.Playing || gameState === GameState.Resetting
                                ? "translateY(50px) scale(1)"
                                : gameState === GameState.Ended
                                ? "translateY(-20px) scale(1.5)"
                                : "translateY(-200px) scale(1)",
                        opacity: gameState === GameState.Playing || gameState === GameState.Resetting || gameState === GameState.Ended ? 1 : 0,
                        pointerEvents: "none",
                    }}
                >
                    <Box sx={{ p: ".2rem 1.2rem", backgroundColor: "#000000CD" }}>
                        <Typography
                            variant="h2"
                            sx={{
                                textAlign: "center",
                                color: gameState === GameState.Ended ? colors.orange : "#FFFFFF",
                                fontFamily: fonts.shareTech,
                                fontWeight: "fontWeightBold",
                            }}
                        >
                            {score}
                        </Typography>
                    </Box>
                </Stack>

                {/* Game ready instructions */}
                <Stack
                    spacing=".4rem"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        top: "30%",
                        left: 0,
                        right: 0,
                        transition: "all .2s ease",
                        transform: gameState === GameState.Ready ? "translateY(0)" : "translateY(-50px)",
                        opacity: gameState === GameState.Ready ? 1 : 0,
                        pointerEvents: "none",
                    }}
                >
                    <Box sx={{ p: ".6rem 1rem", backgroundColor: "#000000CD" }}>
                        <Typography
                            variant="h5"
                            sx={{
                                lineHeight: 1.7,
                                textAlign: "center",
                                fontFamily: fonts.nostromoBlack,
                                span: { color: colors.orange },
                            }}
                        >
                            <span>Click</span> or <span>Spacebar</span>
                            <br />
                            to start repairing
                        </Typography>
                    </Box>
                </Stack>

                {/* Game over text */}
                <Stack
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        top: "32%",
                        left: 0,
                        right: 0,
                        transition: "all .2s ease",
                        transform: gameState === GameState.Ended ? "translateY(0)" : "translateY(-50px)",
                        opacity: gameState === GameState.Ended ? 1 : 0,
                        pointerEvents: "none",
                    }}
                >
                    <Stack spacing=".4rem" sx={{ p: ".6rem 1rem", backgroundColor: "#000000CD" }}>
                        <Typography variant="h3" sx={{ textAlign: "center", fontFamily: fonts.nostromoHeavy }}>
                            Game Over
                        </Typography>
                        <Typography variant="h6" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack, span: { color: colors.orange } }}>
                            You did great citizen
                            <br />
                            <span>Click</span> to continue
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        )
    }, [gameState, oneNewGamePattern, score, setGameState, theme.factionTheme.background])
}

const StaticGame = React.memo(function StaticGame({
    backgroundColor,
    setGameState,
    oneNewGamePattern,
}: {
    backgroundColor: string
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    oneNewGamePattern: (gamePattern: GamePattern) => void
}) {
    // Initialize game
    useEffect(() => {
        const game = new Game(backgroundColor, setGameState, oneNewGamePattern)
        setTimeout(() => {
            game.start()
        }, 100)

        return () => game.cleanup()
    }, [backgroundColor, oneNewGamePattern, setGameState])

    // Game container, must keep the id
    return (
        <Box
            id="game"
            tabIndex={0}
            sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor,
            }}
        />
    )
})
