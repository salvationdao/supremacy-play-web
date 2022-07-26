import { Box, IconButton, Modal, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { colors, fonts, siteZIndex } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { Game, GameState } from "./src/game"
import "./src/style.css"

export const StackTower = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const theme = useTheme()

    return (
        <Modal open={open} onClose={onClose} sx={{ zIndex: siteZIndex.Modal }}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80vw",
                    height: "80vh",
                    maxWidth: "90rem",
                    maxHeight: "100rem",
                    boxShadow: 6,
                    outline: "none",
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderColor: theme.factionTheme.primary,
                        borderThickness: ".3rem",
                    }}
                    corners={{
                        topLeft: true,
                        topRight: true,
                        bottomLeft: true,
                        bottomRight: true,
                    }}
                    sx={{ position: "relative", height: "100%", width: "100%" }}
                    backgroundColor={theme.factionTheme.background}
                >
                    <StackTowerInner />

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}

const StackTowerInner = () => {
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
                        fontFamily: fonts.nostromoHeavy,
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
                        bottom: "17%",
                        transition: "all .2s ease",
                        transform: gameState === GameState.Ready || gameState === GameState.Ended ? "translateY(0)" : "translateY(50px)",
                        opacity: gameState === GameState.Ready || gameState === GameState.Ended ? 1 : 0,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{ textAlign: "center", fontFamily: fonts.nostromoBlack, span: { color: colors.neonBlue, fontFamily: "inherit" } }}
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
