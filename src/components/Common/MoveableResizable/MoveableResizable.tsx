import { Box, Stack } from "@mui/material"
import { ReactNode, useCallback, useState } from "react"
import { ResizeBox, TooltipHelper } from "../.."
import { SvgDrag, SvgHide, SvgInfoCircular } from "../../../assets"
import { ClipThing } from "../../../components"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { colors, siteZIndex } from "../../../theme/theme"
import { Dimension, Position } from "../../../types"
import { MovingBox } from "./MovingBox"

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
    onReizeCallback?: (width: number, height: number) => void
    onHideCallback?: () => void
    // Others
    CaptionArea?: ReactNode
    infoTooltipText?: string
}

export const MoveableResizable = ({ config, children }: { config: MoveableResizableConfig; children: ReactNode }) => {
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

        onReizeCallback,
        onHideCallback,

        CaptionArea,
        infoTooltipText,
    } = config

    const theme = useTheme()

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
            onReizeCallback && onReizeCallback(data.width, data.height)
        },
        [localStoragePrefix, onReizeCallback],
    )

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: siteZIndex.MoveableResizable,
                ":hover": {
                    zIndex: siteZIndex.MoveableResizableHover,
                },
            }}
        >
            <MovingBox
                color={theme.factionTheme.primary}
                onMovingStopped={onMovingStopped}
                initialPosX={curPosX}
                initialPosY={curPosY}
                minPosX={minPosX}
                minPosY={minPosY}
                maxPosX={maxPosX}
                maxPosY={maxPosY}
                curWidth={curWidth}
                curHeight={curHeight}
                handle={
                    <Box
                        className="handle"
                        sx={{
                            pointerEvents: "all",
                            position: "absolute",
                            right: "1.7rem",
                            bottom: ".6rem",
                            cursor: "move",
                            opacity: 0.4,
                            ":hover": { opacity: 1 },
                        }}
                    >
                        <SvgDrag size="1.2rem" />
                    </Box>
                }
            />

            <Box
                sx={{
                    position: "absolute",
                    top: curPosY,
                    left: curPosX,
                    zIndex: siteZIndex.MoveableResizable,
                    filter: "drop-shadow(0 3px 3px #00000050)",
                    ":hover": {
                        zIndex: siteZIndex.MoveableResizableHover,
                    },
                    pointerEvents: "all",
                }}
            >
                <Box sx={{ position: "relative" }}>
                    <ResizeBox
                        color={theme.factionTheme.primary}
                        onResizeStopped={onResizeStopped}
                        initialWidth={curWidth}
                        initialHeight={curHeight}
                        minWidth={minWidth || defaultWidth}
                        minHeight={minHeight || defaultHeight}
                        maxWidth={maxWidth}
                        maxHeight={maxHeight}
                        resizeHandles={["se"]}
                        handle={() => (
                            <Box
                                sx={{
                                    pointerEvents: "all",
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    cursor: "nw-resize",
                                    zIndex: siteZIndex.MoveableResizable,
                                    width: "10px",
                                    height: "10px",
                                }}
                            />
                        )}
                    />

                    <ClipThing
                        clipSize="8px"
                        border={{
                            borderThickness: ".25rem",
                            borderColor: theme.factionTheme.primary,
                        }}
                        backgroundColor={theme.factionTheme.background}
                        opacity={0.8}
                    >
                        <Stack
                            sx={{
                                position: "relative",
                                width: curWidth,
                                height: curHeight,
                                transition: "all .2s",
                                resize: "all",
                                overflow: "hidden",
                                borderRadius: 0.5,
                            }}
                        >
                            <Box sx={{ flex: 1, overflow: "hidden" }}>{children}</Box>

                            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ height: "3.1rem", px: "1.04rem", mr: "2rem" }}>
                                <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mr: "auto" }}>
                                    {CaptionArea}
                                </Stack>

                                {infoTooltipText && (
                                    <TooltipHelper text={infoTooltipText}>
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
                                )}

                                {onHideCallback && (
                                    <Box
                                        onClick={() => onHideCallback()}
                                        sx={{
                                            cursor: "pointer",
                                            mr: ".88rem",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgHide size="1.3rem" />
                                    </Box>
                                )}
                            </Stack>
                        </Stack>
                    </ClipThing>
                </Box>
            </Box>
        </Box>
    )
}
