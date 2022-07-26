import { Box } from "@mui/material"
import { useEffect } from "react"
import { Game } from "./src/game"
import "./style.css"

export const isWebGLAvailable = function () {
    try {
        const canvas = document.createElement("canvas")
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
    } catch (e) {
        return false
    }
}

export const isWebGL2Available = function () {
    try {
        const canvas = document.createElement("canvas")
        return !!(window.WebGL2RenderingContext && canvas.getContext("webgl2"))
    } catch (e) {
        return false
    }
}

export const MiniGame = () => {
    useEffect(() => {
        if (!isWebGLAvailable()) {
            console.error("WebGL is not supported in this browser.")
        }

        new Game()
    }, [])

    return (
        <Box sx={{ width: "100%", height: "100%", backgroundColor: "beige" }}>
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
        </Box>
    )
}
