import { useMediaQuery } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useDebounce } from "../hooks"
import { Dimension } from "../types"
import { useMobile } from "./mobile"

// Contains dimensions for the overall layout of the divs, iframe etc.
export const DimensionContainer = createContainer(() => {
    const { isNavOpen } = useMobile()
    const [remToPxRatio, setRemToPxRatio] = useState(10)
    const below600 = useMediaQuery("(max-width:600px)")
    const below900 = useMediaQuery("(max-width:900px)")
    const below1500 = useMediaQuery("(max-width:1500px)")
    const below1922 = useMediaQuery("(max-width:1922px)")

    const [gameUIDimensions, setGameUIDimensions] = useDebounce<Dimension>(
        {
            width: 0,
            height: 0,
        },
        300,
    )

    // Please refer to `src/theme/global.css`
    useEffect(() => {
        if (below600) return setRemToPxRatio(0.42 * 16)
        if (below900) return setRemToPxRatio(0.44 * 16)
        if (below1500) return setRemToPxRatio(0.5 * 16)
        if (below1922) return setRemToPxRatio(0.52 * 16)
        setRemToPxRatio(0.6 * 16)
    }, [below1922, below1500, below900, below600])

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

    const recalculateDimensions = useCallback(() => {
        const gameUIContainer = document.getElementById("game-ui-container")
        if (!gameUIContainer) {
            setGameUIDimensions({ width: 0, height: 0 })
            return
        }

        const containerWidth = gameUIContainer.offsetWidth
        const containerHeight = gameUIContainer.offsetHeight

        setGameUIDimensions({ width: containerWidth, height: containerHeight })
    }, [setGameUIDimensions])

    useEffect(() => {
        recalculateDimensions()
    }, [recalculateDimensions, remToPxRatio, isNavOpen])

    return {
        remToPxRatio,
        gameUIDimensions,
        recalculateDimensions,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
