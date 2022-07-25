import { useMediaQuery } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
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

    const gameUIContainer = useRef<HTMLElement | null>(null)
    const resizeObserver = useRef<ResizeObserver>()

    const [gameUIDimensions, setGameUIDimensions] = useDebounce<Dimension>(
        {
            width: 0,
            height: 0,
        },
        300,
    )

    // Please refer to `src/theme/global.css`
    useEffect(() => {
        if (below600) return setRemToPxRatio(0.39 * 16)
        if (below900) return setRemToPxRatio(0.44 * 16)
        if (below1500) return setRemToPxRatio(0.5 * 16)
        if (below1922) return setRemToPxRatio(0.52 * 16)
        setRemToPxRatio(0.59 * 16)
    }, [below1922, below1500, below900, below600])

    const setupResizeObserver = useCallback(() => {
        gameUIContainer.current = document.getElementById("game-ui-container")
        if (!gameUIContainer.current) return

        resizeObserver.current = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect
            setGameUIDimensions({
                width: rect.width,
                height: rect.height,
            })
        })
        resizeObserver.current.observe(gameUIContainer.current)
    }, [setGameUIDimensions])

    const recalculateDimensions = useCallback(() => {
        gameUIContainer.current = document.getElementById("game-ui-container")
        if (!gameUIContainer.current) {
            setGameUIDimensions({ width: 0, height: 0 })
            return
        }

        const containerWidth = gameUIContainer.current.offsetWidth
        const containerHeight = gameUIContainer.current.offsetHeight

        setGameUIDimensions({ width: containerWidth, height: containerHeight })
    }, [setGameUIDimensions])

    const triggerReset = useCallback(() => {
        recalculateDimensions()
        setupResizeObserver()
    }, [recalculateDimensions, setupResizeObserver])

    useEffect(() => {
        recalculateDimensions()
        setupResizeObserver()
    }, [remToPxRatio, isNavOpen, recalculateDimensions, setupResizeObserver])

    useEffect(() => {
        return () => {
            resizeObserver.current && gameUIContainer.current && resizeObserver.current.unobserve(gameUIContainer.current)
        }
    }, [])

    return {
        remToPxRatio,
        gameUIDimensions,
        triggerReset,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
