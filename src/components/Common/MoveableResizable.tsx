import { Box, Stack, Theme } from "@mui/material"
import { useTheme } from "@mui/styles"
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { ResizeBox, TooltipHelper } from ".."
import { SvgDrag, SvgHide, SvgInfoCircular } from "../../assets"
import { useDimension } from "../../containers"
import { clamp, parseString } from "../../helpers"
import { colors } from "../../theme/theme"
import { Dimension } from "../../types"
import { ClipThing } from "../../components"

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
    tooltipText?: string
}

const PADDING = 10

export const MoveableResizable = ({ config, children }: { config: MoveableResizableConfig; children: ReactElement }) => {
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
        tooltipText,
    } = config

    const theme = useTheme<Theme>()
    const {
        pxToRemRatio,
        streamDimensions: { width, height },
    } = useDimension()
    const [curPosX, setCurPosX] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosX`), -1))
    const [curPosY, setCurPosY] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosY`), -1))
    const [curWidth, setCurWidth] = useState(parseString(localStorage.getItem(`${localStoragePrefix}SizeX`), defaultSizeX))
    const [curHeight, setCurHeight] = useState(parseString(localStorage.getItem(`${localStoragePrefix}SizeY`), defaultSizeY))

    const adjustment = useMemo(() => Math.min(pxToRemRatio, 9) / 9, [pxToRemRatio])

    // Position shouldn't be loading from local storage with initial state, since it depends on current width and height
    // Make sure live voting chart is inside iframe when page is resized etc.
    useEffect(() => {
        if (width <= 0 || height <= 0) return

        const newPosX = curPosX > 0 ? clamp(PADDING, curPosX, width - curWidth - PADDING) : defaultPositionX + PADDING
        const newPosY = curPosY > 0 ? clamp(PADDING, curPosY, height - curHeight - PADDING) : height - defaultPositionYBottom - curHeight

        setCurPosX(newPosX)
        setCurPosY(newPosY)
        localStorage.setItem(`${localStoragePrefix}PosX`, newPosX.toString())
        localStorage.setItem(`${localStoragePrefix}PosY`, newPosY.toString())

        onReizeCallback && onReizeCallback(curWidth, curHeight)
    }, [width, height, curWidth, curHeight])

    // When dragging stops, just set the position and save to local storage
    // The bounds in the  Draggable component already limits it's range of motion
    const onDragStop = useCallback((e: DraggableEvent, data: DraggableData) => {
        setCurPosX(data.x)
        setCurPosY(data.y)
        localStorage.setItem(`${localStoragePrefix}PosX`, data.x.toString())
        localStorage.setItem(`${localStoragePrefix}PosY`, data.y.toString())
    }, [])

    // When user resize is done, save into local storage
    const onResizeStop = useCallback(
        (data: Dimension) => {
            const size = data || { width: curWidth, height: curHeight }

            if (allowResizeX && size.width >= minSizeX * adjustment && size.width <= width - 2 * PADDING) {
                setCurWidth(size.width)
            }

            if (allowResizeY && size.height >= minSizeY * adjustment && size.height <= height - 2 * PADDING) {
                setCurHeight(size.height)
            }

            localStorage.setItem(`${localStoragePrefix}SizeX`, size.width.toString())
            localStorage.setItem(`${localStoragePrefix}SizeY`, size.height.toString())
        },
        [curWidth, curHeight, allowResizeX, allowResizeY, minSizeX, minSizeY, width, height, adjustment],
    )

    return (
        <Stack
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 18,
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
                <Box sx={{ position: "relative", pointerEvents: "all" }}>
                    <ResizeBox
                        color={theme.factionTheme.primary || colors.darkNeonBlue}
                        onResizeStop={onResizeStop}
                        adjustment={adjustment}
                        initialDimensions={[curWidth, curHeight]}
                        minConstraints={[allowResizeX ? minSizeX : defaultSizeX, allowResizeY ? minSizeY : defaultSizeY]}
                        maxConstraints={[allowResizeX ? width - curPosX - PADDING : defaultSizeX, allowResizeY ? height - curPosY - 2 * PADDING : defaultSizeY]}
                        resizeHandles={["se"]}
                        handle={() => (
                            <Box
                                sx={{
                                    pointerEvents: "all",
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    cursor: "ew-resize",
                                    zIndex: 50,
                                    width: "10px",
                                    height: "100%",
                                }}
                            />
                        )}
                    />

                    <ClipThing
                        clipSize=".5rem"
                        border={{
                            isFancy: true,
                            borderThickness: ".15rem",
                            borderColor: theme.factionTheme.primary,
                        }}
                    >
                        <Box sx={{ position: "relative" }}>
                            <Stack
                                sx={{
                                    position: "relative",
                                    width: curWidth,
                                    height: curHeight,
                                    transition: "all .2s",
                                    resize: "all",
                                    overflow: "hidden",
                                    backgroundColor: theme.factionTheme.background,
                                    borderRadius: 0.5,
                                }}
                            >
                                {children}

                                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ px: "1.04rem", pb: ".56rem" }}>
                                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mr: "auto" }}>
                                        {CaptionArea}
                                    </Stack>

                                    <TooltipHelper text={tooltipText}>
                                        <Box
                                            sx={{
                                                mr: ".88rem",
                                                opacity: 0.4,
                                                ":hover": { opacity: 1 },
                                            }}
                                        >
                                            <SvgInfoCircular fill={colors.text} size="1.2rem" />
                                        </Box>
                                    </TooltipHelper>

                                    <Box
                                        onClick={() => onHideCallback && onHideCallback()}
                                        sx={{
                                            cursor: "pointer",
                                            mr: ".88rem",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgHide size="1.3rem" />
                                    </Box>

                                    <Box
                                        className="handle"
                                        sx={{
                                            cursor: "move",
                                            mr: allowResizeX || allowResizeY ? ".4rem" : ".3rem",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgDrag size="1.2rem" />
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </ClipThing>
                </Box>
            </Draggable>
        </Stack>
    )
}
