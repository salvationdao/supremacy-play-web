import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"
import { parseString } from "../../../helpers"
import { Dimension, Position } from "../../../types"

const defaultConfig: MoveableResizableConfig = {
    localStoragePrefix: "moveaberesizeable",
    // Defaults
    defaultPosX: 10,
    defaultPosY: 10,
    defaultWidth: 250,
    defaultHeight: 250,
}

export interface MoveableResizableConfig {
    localStoragePrefix: string
    // Defaults
    defaultPosX: number
    defaultPosY: number
    defaultWidth: number
    defaultHeight: number
    // Position limits
    minPosX?: number
    minPosY?: number
    maxPosX?: number
    maxPosY?: number
    // Size limits
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    // Callbacks
    onResizeCallback?: (width: number, height: number) => void
    onHideCallback?: () => void
    // Others
    infoTooltipText?: string
}

// Container for allowing children to set size and position
export const MoveableResizableContainer = createContainer((initialState: MoveableResizableConfig | undefined) => {
    const {
        localStoragePrefix,

        defaultPosX = 0,
        defaultPosY = 0,
        defaultWidth = 50,
        defaultHeight = 50,

        minPosX,
        minPosY,
        maxPosX,
        maxPosY,

        minWidth,
        minHeight,
        maxWidth,
        maxHeight,

        onResizeCallback,
        onHideCallback,

        infoTooltipText,
    } = initialState || defaultConfig

    const [curPosX, setCurPosX] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosX`), defaultPosX))
    const [curPosY, setCurPosY] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosY`), defaultPosY))
    const [curWidth, setCurWidth] = useState(parseString(localStorage.getItem(`${localStoragePrefix}SizeX`), defaultWidth))
    const [curHeight, setCurHeight] = useState(parseString(localStorage.getItem(`${localStoragePrefix}SizeY`), defaultHeight))

    const onMovingStopped = useCallback(
        (data: Position) => {
            setCurPosX(data.x)
            setCurPosY(data.y)
            localStorage.setItem(`${localStoragePrefix}PosX`, data.x.toString())
            localStorage.setItem(`${localStoragePrefix}PosY`, data.y.toString())
        },
        [localStoragePrefix],
    )

    const onResizeStopped = useCallback(
        (data: Dimension) => {
            setCurWidth(data.width)
            setCurHeight(data.height)
            localStorage.setItem(`${localStoragePrefix}SizeX`, data.width.toString())
            localStorage.setItem(`${localStoragePrefix}SizeY`, data.height.toString())
            onResizeCallback && onResizeCallback(data.width, data.height)
        },
        [localStoragePrefix, onResizeCallback],
    )

    return {
        defaultWidth,
        defaultHeight,
        minPosX,
        minPosY,
        maxPosX,
        maxPosY,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        onResizeCallback,
        onHideCallback,
        infoTooltipText,
        curPosX,
        curPosY,
        curWidth,
        curHeight,
        setCurPosX,
        setCurPosY,
        setCurWidth,
        setCurHeight,
        onMovingStopped,
        onResizeStopped,
    }
})

export const MoveableResizableProvider = MoveableResizableContainer.Provider
export const useMoveableResizable = MoveableResizableContainer.useContainer
