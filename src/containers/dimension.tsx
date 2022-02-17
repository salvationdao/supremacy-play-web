import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import {
    CONTROLS_HEIGHT,
    GAMEBAR_HEIGHT,
    LIVE_CHAT_DRAWER_BUTTON_WIDTH,
    LIVE_CHAT_DRAWER_WIDTH,
    STREAM_ASPECT_RATIO_W_H,
} from '../constants'
import { useToggle, useWindowDimensions } from '../hooks'

export const DimensionContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [isLiveChatOpen, toggleIsLiveChatOpen] = useToggle(false)
    const [streamDimensions, setStreamDimensions] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })
    const [iframeDimensions, setIframeDimensions] = useState<{ width: number | string; height: number | string }>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        const streamWidth = isLiveChatOpen
            ? width - LIVE_CHAT_DRAWER_WIDTH - 2 * LIVE_CHAT_DRAWER_BUTTON_WIDTH
            : width - 2 * LIVE_CHAT_DRAWER_BUTTON_WIDTH
        const streamHeight = height
        setStreamDimensions({
            width: streamWidth,
            height: streamHeight,
        })
    }, [width, height, isLiveChatOpen])

    // Work out iframe width and height based on its aspect ratio and stream width and height
    useEffect(() => {
        let iframeWidth: number | string = width
        let iframeHeight: number | string = height - GAMEBAR_HEIGHT - CONTROLS_HEIGHT
        const iframeRatio = iframeWidth / iframeHeight
        if (iframeRatio >= STREAM_ASPECT_RATIO_W_H) {
            iframeHeight = 'unset'
        } else {
            iframeWidth = 'unset'
        }

        setIframeDimensions({ width: iframeWidth, height: iframeHeight })
    }, [width, height])

    return {
        streamDimensions,
        iframeDimensions,
        isLiveChatOpen,
        toggleIsLiveChatOpen,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
