import { useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { STREAM_ASPECT_RATIO_W_H } from "../constants"
import { useDebounce } from "../hooks"
import { Dimension } from "../types"

// Contains dimensions for the overall layout of the divs, iframe etc.
export const DimensionContainer = createContainer(() => {
    const [remToPxRatio, setRemToPxRatio] = useState(10)
    const below900 = useMediaQuery("(max-width:900px)")
    const below1500 = useMediaQuery("(max-width:1500px)")
    const below1920 = useMediaQuery("(max-width:1920px)")

    const [gameUIDimensions, setGameUIDimensions] = useDebounce<Dimension>(
        {
            width: 0,
            height: 0,
        },
        300,
    )
    const [iframeDimensions, setIframeDimensions] = useState<{ width: number | string; height: number | string }>({
        width: 0,
        height: 0,
    })

    // Please refer to `src/theme/global.css`
    useEffect(() => {
        if (below900) return setRemToPxRatio(0.44 * 16)
        if (below1500) return setRemToPxRatio(0.5 * 16)
        if (below1920) return setRemToPxRatio(0.54 * 16)
        setRemToPxRatio(0.6 * 16)
    }, [below1920, below1500, below900])

    useEffect(() => {
        const gameUIContainer = document.getElementById("game-ui-container")
        if (!gameUIContainer) {
            console.error("Please assign #game-ui-container to the game UI.")
            return
        }

        const resize_ob = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect
            setGameUIDimensions({
                width: rect.width,
                height: rect.height,
            })
        })

        resize_ob.observe(gameUIContainer)
        return () => {
            resize_ob.unobserve(gameUIContainer)
        }
    }, [setGameUIDimensions])

    useEffect(() => {
        const gameUIContainer = document.getElementById("game-ui-container")
        if (!gameUIContainer) {
            console.error("Please assign #game-ui-container to the game UI.")
            return
        }

        const containerWidth = gameUIContainer.offsetWidth
        const containerHeight = gameUIContainer.offsetHeight

        // Work out iframe width and height based on its aspect ratio and stream width and height
        let iframeWidth: number | string = containerWidth
        let iframeHeight: number | string = containerHeight
        const iframeRatio = iframeWidth / iframeHeight
        if (iframeRatio >= STREAM_ASPECT_RATIO_W_H) {
            iframeHeight = "unset"
        } else {
            iframeWidth = "unset"
        }

        setGameUIDimensions({ width: containerWidth, height: containerHeight })
        setIframeDimensions({ width: iframeWidth, height: iframeHeight })
    }, [gameUIDimensions, remToPxRatio, setGameUIDimensions])

    return {
        remToPxRatio,
        gameUIDimensions,
        iframeDimensions,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
