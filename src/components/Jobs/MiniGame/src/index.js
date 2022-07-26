import WEBGL from "../lib/WebGL"
import Game from "./game"

if (!WEBGL.isWebGLAvailable()) {
    console.error("WebGL is not supported in this browser.")
}

document.addEventListener("DOMContentLoaded", () => {
    new Game()
})
