import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { GAMEBAR_CONSTANTS, useLiveChat } from "@ninjasoftware/passport-gamebar"
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
    const { isOpen: isLiveChatOpen, toggleIsOpen: toggleIsLiveChatOpen } = useLiveChat()

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
            ? windowWidth - GAMEBAR_CONSTANTS.liveChatDrawerWidth
            : windowWidth - GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth
        const mainDivHeight = windowHeight - GAMEBAR_CONSTANTS.gameBarHeight
        setMainDivDimensions({
            width: mainDivWidth,
            height: mainDivHeight,
        })
    }, [windowWidth, windowHeight, isLiveChatOpen])

    useEffect(() => {
        const streamWidth = mainDivDimensions.width - GAMEBAR_CONSTANTS.liveChatDrawerButtonWidth
        const streamHeight = mainDivDimensions.height - CONTROLS_HEIGHT
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
            iframeHeight = "unset"
        } else {
            iframeWidth = "unset"
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
