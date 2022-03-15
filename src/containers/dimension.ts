import { useMediaQuery } from "@mui/material"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { useDrawer } from "."
import {
    CONTROLS_HEIGHT,
    GAME_BAR_HEIGHT,
    LIVE_CHAT_DRAWER_BUTTON_WIDTH,
    LIVE_CHAT_DRAWER_WIDTH,
    STREAM_ASPECT_RATIO_W_H,
} from "../constants"
import { useWindowDimensions } from "../hooks"

// Contains dimensions for the overall layout of the divs, iframe etc.
export const DimensionContainer = createContainer(() => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions()
    const { isAnyPanelOpen } = useDrawer()

    const [mainDivDimensions, setMainDivDimensions] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })
    const [streamDimensions, setStreamDimensions] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })
    const [iframeDimensions, setIframeDimensions] = useState<{ width: number | string; height: number | string }>({
        width: 0,
        height: 0,
    })

    const below900 = useMediaQuery("(max-width:900px)")
    const below1500 = useMediaQuery("(max-width:1500px)")
    const below1920 = useMediaQuery("(max-width:1920px)")
    const [pxToRemRatio, setPxToRemRatio] = useState(10)

    // Refer to `src/theme/global.css`
    useEffect(() => {
        if (below900) {
            setPxToRemRatio(6.4)
        } else if (below1500) {
            setPxToRemRatio(7.2)
            return
        } else if (below1920) {
            setPxToRemRatio(8.32)
            return
        }

        setPxToRemRatio(10)
    }, [below1920, below1500])

    useEffect(() => {
        // Main div dimensions
        const mainDivWidth = isAnyPanelOpen
            ? windowWidth - LIVE_CHAT_DRAWER_WIDTH * pxToRemRatio
            : windowWidth - LIVE_CHAT_DRAWER_BUTTON_WIDTH * pxToRemRatio
        const mainDivHeight = windowHeight - GAME_BAR_HEIGHT * pxToRemRatio

        // Stream div dimensions
        const streamWidth = mainDivWidth - LIVE_CHAT_DRAWER_BUTTON_WIDTH * pxToRemRatio
        const streamHeight = mainDivHeight - CONTROLS_HEIGHT * pxToRemRatio

        // Work out iframe width and height based on its aspect ratio and stream width and height
        let iframeWidth: number | string = streamWidth
        let iframeHeight: number | string = streamHeight
        const iframeRatio = iframeWidth / iframeHeight
        if (iframeRatio >= STREAM_ASPECT_RATIO_W_H) {
            iframeHeight = "unset"
        } else {
            iframeWidth = "unset"
        }

        setStreamDimensions({ width: streamWidth, height: streamHeight })
        setMainDivDimensions({ width: mainDivWidth, height: mainDivHeight })
        setIframeDimensions({ width: iframeWidth, height: iframeHeight })
    }, [windowWidth, windowHeight, isAnyPanelOpen, pxToRemRatio])

    return {
        pxToRemRatio,
        mainDivDimensions,
        streamDimensions,
        iframeDimensions,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
