import { useMediaQuery } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { createContainer } from "unstated-next"
import { useDebounce } from "../hooks"
import { Dimension } from "../types"
import { useMobile } from "./mobile"

export const MAIN_CONTENT_ID = "main-content-container"
export const GAME_UI_ID = "game-ui-container"

// Contains dimensions for the overall layout of the divs, iframe etc.
export const DimensionContainer = createContainer(() => {
    const { isNavOpen } = useMobile()
    const [remToPxRatio, setRemToPxRatio] = useState(10) // rem value * remToPxRatio = pixel value
    const below600 = useMediaQuery("(max-width:600px)")
    const below900 = useMediaQuery("(max-width:900px)")
    const below1300 = useMediaQuery("(max-width:1300px)")
    const below1500 = useMediaQuery("(max-width:1500px)")
    const below1922 = useMediaQuery("(max-width:1922px)")

    const gameUIContainer = useRef<HTMLElement | null>(null)
    const mainContentContainer = useRef<HTMLElement | null>(null)
    const resizeObserver = useRef<ResizeObserver>()

    const [gameUIDimensions, setGameUIDimensions] = useDebounce<Dimension>(
        {
            width: 0,
            height: 0,
        },
        300,
    )
    const [mainContentDimensions, setMainContentDimensions] = useDebounce<Dimension>(
        {
            width: 0,
            height: 0,
        },
        3000,
    )

    // Please refer to `src/theme/global.css`
    useEffect(() => {
        if (below600) return setRemToPxRatio(0.37 * 16)
        if (below900) return setRemToPxRatio(0.42 * 16)
        if (below1300) return setRemToPxRatio(0.44 * 16)
        if (below1500) return setRemToPxRatio(0.48 * 16)
        if (below1922) return setRemToPxRatio(0.5 * 16)
        setRemToPxRatio(0.57 * 16)
    }, [below1922, below1500, below900, below600, below1300])

    const setupResizeObserver = useCallback(async () => {
        if (!resizeObserver.current) {
            resizeObserver.current = new ResizeObserver((entries) => {
                for (const e of entries) {
                    switch (e.target.id) {
                        case MAIN_CONTENT_ID:
                            setMainContentDimensions({
                                width: e.contentRect.width,
                                height: e.contentRect.height,
                            })
                            break
                        case GAME_UI_ID:
                            setGameUIDimensions({
                                width: e.contentRect.width,
                                height: e.contentRect.height,
                            })
                            break
                    }
                }
            })
        }

        gameUIContainer.current = document.getElementById(GAME_UI_ID)
        if (gameUIContainer.current) {
            resizeObserver.current.observe(gameUIContainer.current)
        }
        mainContentContainer.current = document.getElementById(MAIN_CONTENT_ID)
        if (mainContentContainer.current) {
            setMainContentDimensions({
                width: mainContentContainer.current.getBoundingClientRect().width,
                height: mainContentContainer.current.getBoundingClientRect().height,
            })
            resizeObserver.current.observe(mainContentContainer.current)
        }
    }, [setGameUIDimensions, setMainContentDimensions])

    const recalculateDimensions = useCallback(() => {
        gameUIContainer.current = document.getElementById(GAME_UI_ID)
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
            if (resizeObserver.current) {
                if (gameUIContainer.current) {
                    resizeObserver.current.unobserve(gameUIContainer.current)
                }
                if (mainContentContainer.current) {
                    resizeObserver.current.unobserve(mainContentContainer.current)
                }
            }
        }
    }, [])

    return {
        remToPxRatio,
        gameUIDimensions,
        mainContentDimensions,
        triggerReset,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
