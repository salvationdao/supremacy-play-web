import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import {
    GAMEBAR_HEIGHT,
    CONTROLS_HEIGHT,
    SIDE_BARS_WIDTH,
    LIVE_CHAT_DRAWER_WIDTH,
    STREAM_ASPECT_RATIO_W_H,
} from '../constants'
import { useToggle, useWindowDimensions } from '../hooks'

// Contains dimensions for the overall layout of the divs, iframe etc.
export const DimensionContainer = createContainer(() => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions()
    const [isLiveChatOpen, toggleIsLiveChatOpen] = useToggle(false)
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

    useEffect(() => {
        const mainDivWidth = isLiveChatOpen
            ? windowWidth - LIVE_CHAT_DRAWER_WIDTH - SIDE_BARS_WIDTH
            : windowWidth - SIDE_BARS_WIDTH
        const mainDivHeight = windowHeight
        setMainDivDimensions({
            width: mainDivWidth,
            height: mainDivHeight,
        })
    }, [windowWidth, windowHeight, isLiveChatOpen])

    useEffect(() => {
        const streamWidth = mainDivDimensions.width - SIDE_BARS_WIDTH
        const streamHeight = mainDivDimensions.height - GAMEBAR_HEIGHT - CONTROLS_HEIGHT
        setStreamDimensions({
            width: streamWidth,
            height: streamHeight,
        })
    }, [mainDivDimensions])

    // Work out iframe width and height based on its aspect ratio and stream width and height
    useEffect(() => {
        let iframeWidth: number | string = streamDimensions.width
        let iframeHeight: number | string = streamDimensions.height
        const iframeRatio = iframeWidth / iframeHeight
        if (iframeRatio >= STREAM_ASPECT_RATIO_W_H) {
            iframeHeight = 'unset'
        } else {
            iframeWidth = 'unset'
        }

        setIframeDimensions({ width: iframeWidth, height: iframeHeight })
    }, [streamDimensions])

    return {
        mainDivDimensions,
        streamDimensions,
        iframeDimensions,
        isLiveChatOpen,
        toggleIsLiveChatOpen,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
