import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { GAMEBAR_CONSTANTS, useDrawer } from "@ninjasoftware/passport-gamebar"
import { CONTROLS_HEIGHT, STREAM_ASPECT_RATIO_W_H } from "../constants"
import { useWindowDimensions } from "../hooks"

export interface DimensionContainerType {
    mainDivDimensions: {
        width: number
        height: number
    }
    streamDimensions: {
        width: number
        height: number
    }
    iframeDimensions: {
        width: string | number
        height: string | number
    }
    isLiveChatOpen: any
    toggleIsLiveChatOpen: any
}

// Contains dimensions for the overall layout of the divs, iframe etc.
export const DimensionContainer = createContainer((): DimensionContainerType => {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions()
    const { isOpen: isLiveChatOpen, toggleIsOpen: toggleIsLiveChatOpen } = useDrawer()

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
        // Main div dimensions
        const mainDivWidth = isLiveChatOpen
            ? windowWidth - GAMEBAR_CONSTANTS.liveChatDrawerWidth
            : windowWidth - GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth
        const mainDivHeight = windowHeight - GAMEBAR_CONSTANTS.gameBarHeight

        // Stream div dimensions
        const streamWidth = mainDivWidth - GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth
        const streamHeight = mainDivHeight - CONTROLS_HEIGHT

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
    }, [windowWidth, windowHeight, isLiveChatOpen])

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
