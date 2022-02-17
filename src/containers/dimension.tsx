import { useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { LIVE_CHAT_DRAWER_BUTTON_WIDTH, LIVE_CHAT_DRAWER_WIDTH } from '../constants'
import { useToggle, useWindowDimensions } from '../hooks'

export const DimensionContainer = createContainer(() => {
    const { width, height } = useWindowDimensions()
    const [isLiveChatOpen, toggleIsLiveChatOpen] = useToggle(true)
    const [streamDimensions, setStreamDimensions] = useState<{ width: number; height: number }>({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        setStreamDimensions({
            width: isLiveChatOpen
                ? width - LIVE_CHAT_DRAWER_WIDTH - 2 * LIVE_CHAT_DRAWER_BUTTON_WIDTH
                : width - 2 * LIVE_CHAT_DRAWER_BUTTON_WIDTH,
            height,
        })
    }, [width, height, isLiveChatOpen])

    return {
        streamDimensions,
        isLiveChatOpen,
        toggleIsLiveChatOpen,
    }
})

export const DimensionProvider = DimensionContainer.Provider
export const useDimension = DimensionContainer.useContainer
