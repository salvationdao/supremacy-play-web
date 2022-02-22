import { Box, Stack, Theme } from "@mui/material"
import { useTheme } from "@mui/styles"
import { ReactElement, SyntheticEvent, useEffect, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { Resizable, ResizeCallbackData } from "react-resizable"
import { SvgDrag, SvgResizeX, SvgResizeY, SvgResizeXY, SvgHide } from "../../assets"
import { UI_OPACITY } from "../../constants"
import { useDimension } from "../../containers"
import { clamp, parseString } from "../../helpers"

export interface MoveableResizableConfig {
    localStoragePrefix: string
    // Defaults
    defaultPositionX: number
    defaultPositionYBottom: number
    defaultSizeX: number
    defaultSizeY: number
    // Limits
    minSizeX: number
    minSizeY: number
    // Toggles
    allowResizeX?: boolean
    allowResizeY?: boolean
    // Callbacks
    onReizeCallback?: (width: number, height: number) => void
    onHideCallback?: () => void
    // Others
    CaptionArea?: ReactElement
}

const PADDING = 10
// const DefaultMaxLiveVotingDataLength = 100

export const MoveableResizable = ({
    config,
    children,
}: {
    config: MoveableResizableConfig
    children: ReactElement
}) => {
    const {
        localStoragePrefix,
        defaultPositionX,
        defaultPositionYBottom,
        defaultSizeX,
        defaultSizeY,
        minSizeX,
        minSizeY,
        allowResizeX,
        allowResizeY,
        onReizeCallback,
        onHideCallback,
        CaptionArea,
    } = config

    const theme = useTheme<Theme>()
    const {
        streamDimensions: { width, height },
    } = useDimension()
    const [curPosX, setCurPosX] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosX`), -1))
    const [curPosY, setCurPosY] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosY`), -1))
    const [curWidth, setCurWidth] = useState(
        parseString(localStorage.getItem(`${localStoragePrefix}SizeX`), defaultSizeX),
    )
    const [curHeight, setCurHeight] = useState(
        parseString(localStorage.getItem(`${localStoragePrefix}SizeY`), defaultSizeY),
    )

    // Position shouldn't be loading from local storage with initial state, since it depends on current width and height
    // Make sure live voting chart is inside iframe when page is resized etc.
    useEffect(() => {
        if (width <= 0 || height <= 0) return

        const newPosX = curPosX > 0 ? clamp(PADDING, curPosX, width - curWidth - PADDING) : defaultPositionX + PADDING
        const newPosY =
            curPosY > 0
                ? clamp(PADDING, curPosY, height - curHeight - PADDING)
                : height - defaultPositionYBottom - curHeight

        setCurPosX(newPosX)
        setCurPosY(newPosY)
        localStorage.setItem(`${localStoragePrefix}PosX`, newPosX.toString())
        localStorage.setItem(`${localStoragePrefix}PosY`, newPosY.toString())

        onReizeCallback && onReizeCallback(curWidth, curHeight)
    }, [width, height, curWidth, curHeight])

    // When dragging stops, just set the position and save to local storage
    // The bounds in the  Draggable component already limits it's range of motion
    const onDragStop = (e: DraggableEvent, data: DraggableData) => {
        setCurPosX(data.x)
        setCurPosY(data.y)
        localStorage.setItem(`${localStoragePrefix}PosX`, data.x.toString())
        localStorage.setItem(`${localStoragePrefix}PosY`, data.y.toString())
    }

    // When resizing, make sure it stays within the bounds
    const onResize = (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
        if (width <= 0 || height <= 0) return

        const { size } = data || { size: { width: curWidth, height: curHeight } }
        if (allowResizeX && size.width >= minSizeX && size.width <= width - 2 * PADDING) {
            setCurWidth(size.width)
        }

        if (allowResizeY && size.height >= minSizeY && size.height <= height - 2 * PADDING) {
            setCurHeight(size.height)
        }
    }

    // When user resize is done, save into local storage
    const onResizeStop = (e: SyntheticEvent, data: ResizeCallbackData) => {
        localStorage.setItem(`${localStoragePrefix}SizeX`, data.size.width.toString())
        localStorage.setItem(`${localStoragePrefix}SizeY`, data.size.height.toString())
    }

    const Content = () => {
        return (
            <Stack
                sx={{
                    position: "relative",
                    width: curWidth,
                    height: curHeight,
                    resize: "all",
                    overflow: "auto",
                    backgroundColor: theme.factionTheme.background,
                    borderRadius: 0.5,
                }}
            >
                {children}

                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ px: 1.3, pb: 0.7 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mr: "auto" }}>
                        {CaptionArea}
                    </Stack>

                    <Box
                        onClick={() => onHideCallback && onHideCallback()}
                        sx={{
                            cursor: "pointer",
                            mr: 1.1,
                            opacity: 0.4,
                            ":hover": { opacity: 1 },
                        }}
                    >
                        <SvgHide size="13px" />
                    </Box>

                    <Box
                        className="handle"
                        sx={{
                            cursor: "move",
                            mr: allowResizeX || allowResizeY ? "20px" : "3px",
                            opacity: 0.4,
                            ":hover": { opacity: 1 },
                        }}
                    >
                        <SvgDrag size="13px" />
                    </Box>
                </Stack>
            </Stack>
        )
    }

    return (
        <Stack
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 18,
                opacity: UI_OPACITY,
                filter: "drop-shadow(0 3px 3px #00000050)",
                ":hover": {
                    zIndex: 999,
                },
            }}
        >
            <Draggable
                allowAnyClick
                handle=".handle"
                position={{
                    x: curPosX,
                    y: curPosY,
                }}
                onStop={onDragStop}
                bounds={{
                    top: PADDING,
                    bottom: height - curHeight - PADDING,
                    left: PADDING,
                    right: width - curWidth - PADDING,
                }}
            >
                <Box sx={{ pointerEvents: "all" }}>
                    {allowResizeX || allowResizeY ? (
                        <Resizable
                            height={curHeight}
                            width={curWidth}
                            onResize={onResize}
                            onResizeStop={onResizeStop}
                            handle={() => (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 8.8,
                                        right: 10,
                                        cursor:
                                            allowResizeX && allowResizeY
                                                ? "nesw-resize"
                                                : allowResizeX
                                                ? "ew-resize"
                                                : "ns-resize",
                                        opacity: 0.4,
                                        ":hover": { opacity: 1 },
                                    }}
                                >
                                    {allowResizeX && allowResizeY ? (
                                        <SvgResizeXY size="12px" />
                                    ) : allowResizeX ? (
                                        <SvgResizeX size="12px" />
                                    ) : (
                                        <SvgResizeY size="12px" />
                                    )}
                                </Box>
                            )}
                        >
                            <Box sx={{ position: "relative" }}>
                                <Content />
                            </Box>
                        </Resizable>
                    ) : (
                        <Content />
                    )}
                </Box>
            </Draggable>
        </Stack>
    )
}
