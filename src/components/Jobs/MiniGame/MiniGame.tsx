import { Box } from "@mui/material"
import "./style.css"
import { isWebGLAvailable } from "./lib/WebGL"
import { Game } from "./src/game"
import { useEffect } from "react"

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
