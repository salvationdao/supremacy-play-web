import { Box, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { RepairAgent } from "../../../../types/jobs"
import { ProgressBar } from "../../../Common/ProgressBar"
import { Game, GamePattern, GameState } from "./src/game"

interface StackTowerProps {
    primaryColor: string
    disableGame: boolean
    repairAgent?: RepairAgent
    setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
    setSubmitError: React.Dispatch<React.SetStateAction<string | undefined>>
    onSubmitted: () => void
}

const propsAreEqual = (prevProps: StackTowerProps, nextProps: StackTowerProps) => {
    return (
        prevProps.primaryColor === nextProps.primaryColor &&
        prevProps.disableGame === nextProps.disableGame &&
        prevProps.repairAgent?.id === nextProps.repairAgent?.id
    )
}

export const StackTower = React.memo(function StackTower({
    primaryColor,
    disableGame,
    repairAgent,
    setIsSubmitting,
    setSubmitError,
    onSubmitted,
}: StackTowerProps) {
    const { send } = useGameServerCommandsUser("/user_commander")

    // Game data
    const [gameState, setGameState] = useState<GameState>(GameState.Loading)
    const [score, setScore] = useState(0)
    const [cumulativeScore, setCumulativeScore] = useState(0)

    // Send individual updates
    const agentRepairUpdate = useCallback(
        async (repairAgentID: string, gamePattern: GamePattern) => {
            try {
                const resp = await send(GameServerKeys.RepairAgentUpdate, {
                    repair_agent_id: repairAgentID,
                    ...gamePattern,
                })

                if (!resp) return Promise.reject(false)
                return Promise.resolve(true)
            } catch (err) {
                return Promise.reject(false)
            }
        },
        [send],
    )

    // Tell server we finished and do validation
    const completeAgentRepair = useCallback(
        async (repairAgentID: string) => {
            try {
                setSubmitError(undefined)
                setIsSubmitting(true)
                const resp = await send(GameServerKeys.CompleteRepairAgent, {
                    repair_agent_id: repairAgentID,
                })

                if (!resp) return Promise.reject(false)
                onSubmitted()
                return Promise.resolve(true)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to submit results."
                setSubmitError(message)
                console.error(err)
                return Promise.reject(false)
            } finally {
                setTimeout(() => {
                    setIsSubmitting(false)
                }, 1500) // Show the loading spinner for at least sometime so it doesnt flash away
            }
        },
        [onSubmitted, send, setIsSubmitting, setSubmitError],
    )

    // As the player plays the mini game, this will be the game updates
    const oneNewGamePattern = useCallback(
        async (gamePattern: GamePattern) => {
            setScore(gamePattern?.score)

            if (repairAgent?.id) {
                try {
                    const resp = await agentRepairUpdate(repairAgent.id, gamePattern)
                    if (resp) {
                        setCumulativeScore((prev) => {
                            return prev + 1
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [agentRepairUpdate, repairAgent?.id],
    )

    // As the player complete the game
    useEffect(() => {
        if (repairAgent?.id && cumulativeScore === repairAgent?.required_stacks) {
            completeAgentRepair(repairAgent.id)
        }
    }, [repairAgent?.id, repairAgent?.required_stacks, cumulativeScore, completeAgentRepair])

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
                    <TowerStackInner
                        disableGame={disableGame}
                        score={score}
                        gameState={gameState}
                        setGameState={setGameState}
                        oneNewGamePattern={oneNewGamePattern}
                    />
                </Box>

                <Typography sx={{ color: colors.lightGrey }}>
                    <i>
                        <strong>NOTE:</strong> Your submission will be rejected if there are too many failed attempts.
                    </i>
                </Typography>
            </Stack>
        </Box>
    )
},
propsAreEqual)

interface TowerStackInnerProps {
    score: number
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    oneNewGamePattern: (gamePattern: GamePattern) => void
    disableGame: boolean
}

const propsAreEqualTowerStackInner = (prevProps: TowerStackInnerProps, nextProps: TowerStackInnerProps) => {
    return (
        prevProps.score === nextProps.score &&
        prevProps.gameState === nextProps.gameState &&
        prevProps.oneNewGamePattern === nextProps.oneNewGamePattern &&
        prevProps.disableGame === nextProps.disableGame
    )
}

const TowerStackInner = React.memo(function TowerStackInner({ score, gameState, setGameState, oneNewGamePattern, disableGame }: TowerStackInnerProps) {
    const theme = useTheme()

    return useMemo(() => {
        return (
            <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", userSelect: "none" }}>
                <StaticGame
                    disableGame={disableGame}
                    backgroundColor={theme.factionTheme.background}
                    setGameState={setGameState}
                    oneNewGamePattern={oneNewGamePattern}
                />

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
                            Stack Ended
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
    }, [disableGame, gameState, oneNewGamePattern, score, setGameState, theme.factionTheme.background])
}, propsAreEqualTowerStackInner)

interface StaticGameProps {
    backgroundColor: string
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
    oneNewGamePattern: (gamePattern: GamePattern) => void
    disableGame: boolean
}

const propsAreEqualStaticGame = (prevProps: StaticGameProps, nextProps: StaticGameProps) => {
    return (
        prevProps.backgroundColor === nextProps.backgroundColor &&
        prevProps.oneNewGamePattern === nextProps.oneNewGamePattern &&
        prevProps.disableGame === nextProps.disableGame
    )
}

const StaticGame = React.memo(function StaticGame({ backgroundColor, setGameState, oneNewGamePattern, disableGame }: StaticGameProps) {
    const gameStarted = useRef(false)

    // Initialize game
    useEffect(() => {
        if (gameStarted.current || disableGame) return

        const game = new Game(backgroundColor, setGameState, oneNewGamePattern)
        setTimeout(() => {
            game.start()
            gameStarted.current = true
        }, 100)

        return () => game.cleanup()
    }, [backgroundColor, disableGame, oneNewGamePattern, setGameState])

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
}, propsAreEqualStaticGame)
