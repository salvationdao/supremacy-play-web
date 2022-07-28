import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../../containers/theme"
import { colors, fonts } from "../../../../theme/theme"
import { Game, GameState } from "./src/game"

export const StackTower = () => {
    const theme = useTheme()
    const [gameState, setGameState] = useState<GameState>(GameState.Loading)
    const [score, setScore] = useState(0)

    useEffect(() => {
        if (!isWebGLAvailable()) {
            console.error("WebGL is not supported in this browser.")
        }

        new Game(theme.factionTheme.background, setGameState, setScore)
    }, [theme.factionTheme.background])

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
                    {score}
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
                        sx={{ lineHeight: 1.7, textAlign: "center", fontFamily: fonts.nostromoBlack, span: { color: colors.neonBlue, fontFamily: "inherit" } }}
                    >
                        <span>Left click</span> or <span>[spacebar]</span>
                        <br />
                        to start repairing
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
    }, [gameState, score])
}

export const isWebGLAvailable = () => {
    try {
        const canvas = document.createElement("canvas")
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
    } catch (e) {
        return false
    }
}

export const isWebGL2Available = () => {
    try {
        const canvas = document.createElement("canvas")
        return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"))
    } catch (e) {
        return false
    }
}
