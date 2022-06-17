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
    defaultPositionX: number
    defaultPositionY: number
    defaultSizeX: number
    defaultSizeY: number
    // Size limits
    minSizeX: number
    minSizeY: number
    // Toggles
    allowResizeX?: boolean
    allowResizeY?: boolean
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
        defaultPositionX,
        defaultPositionY,
        defaultSizeX,
        defaultSizeY,
        minSizeX,
        minSizeY,
        allowResizeX,
        allowResizeY,
        onReizeCallback,
        onHideCallback,
        CaptionArea,
        infoTooltipText,
    } = config

    const theme = useTheme()

    const [curPosX, setCurPosX] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosX`), defaultPositionX))
    const [curPosY, setCurPosY] = useState(parseString(localStorage.getItem(`${localStoragePrefix}PosY`), defaultPositionY))
    const [curWidth, setCurWidth] = useState(parseString(localStorage.getItem(`${localStoragePrefix}SizeX`), defaultSizeX))
    const [curHeight, setCurHeight] = useState(parseString(localStorage.getItem(`${localStoragePrefix}SizeY`), defaultSizeY))

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
                        minWidth={allowResizeX ? minSizeX : defaultSizeX}
                        maxWidth={allowResizeX ? undefined : defaultSizeX}
                        minHeight={allowResizeY ? minSizeY : defaultSizeY}
                        maxHeight={allowResizeY ? undefined : defaultSizeY}
                        resizeHandles={["se"]}
                        handle={() => (
                            <Box
                                sx={{
                                    pointerEvents: "all",
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    cursor: "ew-resize",
                                    zIndex: siteZIndex.MoveableResizable,
                                    width: "10px",
                                    height: "100%",
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
                        <Box sx={{ position: "relative" }}>
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
                                {children}

                                <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ px: "1.04rem", pb: ".56rem" }}>
                                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mr: "auto" }}>
                                        {CaptionArea}
                                    </Stack>

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

                                    <Box
                                        onClick={() => onHideCallback && onHideCallback()}
                                        sx={{
                                            cursor: "pointer",
                                            mr: "3rem",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgHide size="1.3rem" />
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                    </ClipThing>
                </Box>
            </Box>
        </Box>
    )
}
