import { Box, IconButton, Modal } from "@mui/material"
import { useEffect, useMemo } from "react"
import { SvgClose } from "../../../assets"
import { useTheme } from "../../../containers/theme"
import { siteZIndex } from "../../../theme/theme"
import { ClipThing } from "../../Common/ClipThing"
import { Game } from "./src/game"
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
                    maxWidth: "120rem",
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
                    <StackTowerStatic />

                    <IconButton size="small" onClick={onClose} sx={{ position: "absolute", top: ".5rem", right: ".5rem" }}>
                        <SvgClose size="2.6rem" sx={{ opacity: 0.1, ":hover": { opacity: 0.6 } }} />
                    </IconButton>
                </ClipThing>
            </Box>
        </Modal>
    )
}

const StackTowerStatic = () => {
    useEffect(() => {
        if (!isWebGLAvailable()) {
            console.error("WebGL is not supported in this browser.")
        }

        new Game()
    }, [])

    return useMemo(() => {
        return (
            <div id="container">
                <div id="game"></div>
                <div id="score">0</div>
                <div id="instructions">Click (or press the spacebar) to place the block</div>
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>You did great, you&apos;re the best.</p>
                    <p>Click or spacebar to start again</p>
                </div>
                <div className="game-ready">
                    <div id="start-button">Start</div>
                    <div></div>
                </div>
            </div>
        )
    }, [])
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
