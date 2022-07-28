import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommandsUser } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors, fonts } from "../../../../theme/theme"
import { RepairAgent } from "../../../../types/jobs"
import { ProgressBar } from "../../../Common/ProgressBar"
import { Game, GamePattern, GameState } from "./src/game"
import { isWebGLAvailable } from "./src/utils"

const STACKS_PER_BLOCK = 3

export const StackTower = React.memo(function StackTower({ repairAgent }: { repairAgent?: RepairAgent }) {
    const theme = useTheme()
    const { send } = useGameServerCommandsUser("/user_commander")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string>()

    // Game data
    const [gameState, setGameState] = useState<GameState>(GameState.Loading)
    const [recentPattern, setRecentPattern] = useState<GamePattern>()

    const [gamePatterns, setGamePatterns] = useState<GamePattern[]>([])
    const cumulativeScore = gamePatterns.filter((p) => !p.is_failed && p.score > 0).length
    const disableGame = isSubmitting || submitError

    useEffect(() => {
        if (recentPattern) {
            setGamePatterns((prev) => {
                return [...prev, recentPattern]
            })
        }

        if (recentPattern?.score && !recentPattern?.is_failed) {
            setIsSubmitting(false)
            setSubmitError(undefined)
        }
    }, [recentPattern])

    // Send server game pattern
    useEffect(() => {
        ;(async () => {
            if (cumulativeScore !== STACKS_PER_BLOCK || !repairAgent?.id) return

            try {
                setSubmitError(undefined)
                setIsSubmitting(true)
                const resp = await send(GameServerKeys.CompleteRepairAgent, {
                    repair_agent_id: repairAgent.id,
                    game_patterns: gamePatterns,
                })

                if (!resp) return
                setGamePatterns([])
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to submit results."
                setSubmitError(message)
                console.error(err)
            } finally {
                setIsSubmitting(false)
            }
        })()
    }, [cumulativeScore, gamePatterns, repairAgent?.id, send])

    const primaryColor = theme.factionTheme.primary

    return (
        <Stack
            spacing="2rem"
            sx={{
                height: "100%",
                p: "1.8rem 3rem",
                border: `${primaryColor}70 2px solid`,
                backgroundColor: `${primaryColor}30`,
                boxShadow: 2,
                borderRadius: 1.3,
                opacity: !repairAgent ? 0.5 : 1,
            }}
        >
            <Stack spacing=".7rem">
                {submitError && (
                    <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", color: colors.red }}>
                        {submitError}
                    </Typography>
                )}

                {!submitError && isSubmitting && (
                    <Stack spacing="1.2rem" direction="row" alignItems="center">
                        <CircularProgress size="1.8rem" sx={{ color: colors.neonBlue }} />
                        <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", color: colors.neonBlue }}>
                            SUBMITTING RESULTS...
                        </Typography>
                    </Stack>
                )}

                {!submitError && !isSubmitting && (
                    <Typography variant="h5" sx={{ fontWeight: "fontWeightBold", span: { fontFamily: "inherit", color: colors.neonBlue } }}>
                        YOU NEED A TOTAL OF <span>{STACKS_PER_BLOCK}</span> STACKS TO REPAIR A SINGLE BLOCK!
                    </Typography>
                )}

                <Stack direction="row" alignItems="center" spacing="1rem">
                    <Stack sx={{ flex: 1 }}>
                        <ProgressBar
                            color={colors.green}
                            backgroundColor={colors.red}
                            orientation="horizontal"
                            thickness="12px"
                            percent={(100 * cumulativeScore) / STACKS_PER_BLOCK}
                        />
                    </Stack>

                    <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: "fontWeightBold" }}>
                        {cumulativeScore}/{STACKS_PER_BLOCK}
                    </Typography>
                </Stack>
            </Stack>

            <Box sx={{ flex: 1, opacity: disableGame ? 0.4 : 1, pointerEvents: disableGame ? "none" : "all", border: "#FFFFFF20 1px solid" }}>
                <TowerStackInner recentPattern={recentPattern} gameState={gameState} setGameState={setGameState} setRecentPattern={setRecentPattern} />
            </Box>
        </Stack>
    )
})

const TowerStackInner = ({
    recentPattern,
    setRecentPattern,
    gameState,
    setGameState,
}: {
    recentPattern?: GamePattern
    setRecentPattern: React.Dispatch<React.SetStateAction<GamePattern | undefined>>
    gameState: GameState
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
}) => {
    const theme = useTheme()

    // Initialize game
    useEffect(() => {
        if (!isWebGLAvailable()) {
            console.error("WebGL is not supported in this browser.")
        }

        new Game(theme.factionTheme.background, setGameState, setRecentPattern)
    }, [setGameState, setRecentPattern, theme.factionTheme.background])

    return useMemo(() => {
        return (
            <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
                {/* Game container, must keep the id */}
                <Box
                    id="game"
                    sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                />

                {/* Score */}
                <Typography
                    variant="h2"
                    sx={{
                        position: "absolute",
                        top: "23%",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        fontFamily: fonts.nostromoBold,
                        transition: "all .4s ease",
                        transform:
                            gameState === GameState.Playing || gameState === GameState.Resetting
                                ? "translateY(0) scale(1)"
                                : gameState === GameState.Ended
                                ? "translateY(-50px) scale(1.5)"
                                : "translateY(-200px) scale(1)",
                        opacity: gameState === GameState.Playing || gameState === GameState.Resetting || gameState === GameState.Ended ? 1 : 0,
                    }}
                >
                    {recentPattern?.score || 0}
                </Typography>

                {/* Game ready instructions */}
                <Stack
                    spacing=".4rem"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "15%",
                        transition: "all .2s ease",
                        transform: gameState === GameState.Ready || gameState === GameState.Ended ? "translateY(0)" : "translateY(50px)",
                        opacity: gameState === GameState.Ready || gameState === GameState.Ended ? 1 : 0,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            lineHeight: 1.7,
                            textAlign: "center",
                            fontFamily: fonts.nostromoBlack,
                            span: { color: colors.neonBlue, fontFamily: "inherit" },
                        }}
                    >
                        <span>Click</span> to start repairing
                    </Typography>
                </Stack>

                {/* Game over text */}
                <Stack
                    spacing=".4rem"
                    alignItems="center"
                    sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "28%",
                        transition: "all .2s ease",
                        transform: gameState === GameState.Ended ? "translateY(0)" : "translateY(-50px)",
                        opacity: gameState === GameState.Ended ? 1 : 0,
                    }}
                >
                    <Typography variant="h3" sx={{ textAlign: "center", fontFamily: fonts.nostromoHeavy }}>
                        Game Over
                    </Typography>
                    <Typography variant="h6" sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack }}>
                        You did great citizen
                    </Typography>
                </Stack>
            </Box>
        )
    }, [gameState, recentPattern?.score])
}
