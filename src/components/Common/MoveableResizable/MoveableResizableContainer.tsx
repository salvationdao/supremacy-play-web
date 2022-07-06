import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { Rnd } from "react-rnd"
import { createContainer } from "unstated-next"
import { useDimension } from "../../../containers"
import { clamp, parseString } from "../../../helpers"
import { Dimension, Position } from "../../../types"

const PADDING = 10

const defaultConfig: MoveableResizableConfig = {
    localStoragePrefix: "moveaberesizeable",
    // Defaults
    defaultPosX: PADDING,
    defaultPosY: PADDING,
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
    // Others
    onHideCallback?: () => void
    resizeHandlePlacement?: "topLeft" | "bottomRight"
    infoTooltipText?: string
    topRightContent?: ReactNode
}

// Container for allowing children to set size and position
export const MoveableResizableContainer = createContainer((initialState: MoveableResizableConfig | undefined) => {
    const {
        localStoragePrefix,

        defaultPosX = 0,
        defaultPosY = 0,
        defaultWidth: defaultW = 50,
        defaultHeight: defaultH = 50,

        minWidth,
        minHeight,
        maxWidth,
        maxHeight,

        onHideCallback,
        infoTooltipText,
        topRightContent,
    } = initialState || defaultConfig

    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    const rndRef = useRef<Rnd | null>(null)
    const [curPosX, setCurPosX] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosX`), defaultPosX))
    const [curPosY, setCurPosY] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosY`), defaultPosY))
    const [defaultWidth, setDefaultWidth] = useState(defaultW)
    const [defaultHeight, setDefaultHeight] = useState(defaultH)
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
        },
        [localStoragePrefix],
    )

    const updateSize = useCallback(
        (size: { width: number; height: number }) => {
            rndRef.current?.updateSize(size)
            onResizeStopped(size)

            // Make sure its within the parent container
            rndRef.current?.updatePosition({
                x: clamp(0, curPosX, width - size.width - 2 * PADDING),
                y: clamp(0, curPosY, height - size.height - 2 * PADDING),
            })
        },
        [curPosX, curPosY, height, onResizeStopped, width],
    )

    const updatePosition = useCallback(
        (position: { x: number; y: number }) => {
            rndRef.current?.updatePosition(position)
            onMovingStopped(position)
        },
        [onMovingStopped],
    )

    // Set initial
    useEffect(() => {
        const newWidth = Math.min(curWidth, width - 2 * PADDING)
        const newHeight = Math.min(curHeight, height - 2 * PADDING)

        const newDimension = { width: newWidth, height: newHeight }
        const newPosition = {
            x: clamp(0, curPosX, width - newWidth - 2 * PADDING),
            y: clamp(0, curPosY, height - newHeight - 2 * PADDING),
        }

        rndRef.current?.updateSize(newDimension)
        rndRef.current?.updatePosition(newPosition)

        onResizeStopped(newDimension)
        onMovingStopped(newPosition)
        // Just run this once to set intial, no deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height])

    return {
        rndRef,
        updateSize,
        updatePosition,

        // From config
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        onHideCallback,
        infoTooltipText,

        // Own states
        defaultPosX,
        defaultPosY,
        defaultWidth,
        defaultHeight,
        setDefaultWidth,
        setDefaultHeight,
        curPosX,
        curPosY,
        curWidth,
        curHeight,
        onMovingStopped,
        onResizeStopped,
        topRightContent,
    }
})

export const MoveableResizableProvider = MoveableResizableContainer.Provider
export const useMoveableResizable = MoveableResizableContainer.useContainer
