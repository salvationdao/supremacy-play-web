import { Box, Stack } from "@mui/material"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { ResizeBox, TooltipHelper } from "../.."
import { SvgClose, SvgDrag, SvgInfoCircular } from "../../../assets"
import { ClipThing } from "../../../components"
import { useTheme } from "../../../containers/theme"
import { parseString, shadeColor } from "../../../helpers"
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
    onResizeCallback?: (width: number, height: number) => void
    onHideCallback?: () => void
    // Others
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

        onResizeCallback,
        onHideCallback,

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
            onResizeCallback && onResizeCallback(data.width, data.height)
        },
        [localStoragePrefix, onResizeCallback],
    )

    const topRightBackgroundColor = useMemo(() => shadeColor(theme.factionTheme.primary, -90), [theme.factionTheme.primary])

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
                            right: onHideCallback ? "3.45rem" : "1rem",
                            top: ".8rem",
                            cursor: "move",
                            opacity: 0.4,
                            ":hover": { opacity: 1 },
                        }}
                    >
                        <SvgDrag size="1.5rem" />
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
                        sx={{ position: "relative" }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                sx={{
                                    position: "relative",
                                    pl: "1rem",
                                    pt: ".8rem",
                                    pb: ".5rem",
                                    pr: onHideCallback ? "1.7rem" : "3rem",
                                    zIndex: 3,
                                }}
                            >
                                {infoTooltipText && (
                                    <TooltipHelper text={infoTooltipText}>
                                        <Box
                                            sx={{
                                                mr: onHideCallback ? "3rem" : ".9rem",
                                                opacity: 0.4,
                                                ":hover": { opacity: 1 },
                                            }}
                                        >
                                            <SvgInfoCircular fill={colors.text} size="1.6rem" />
                                        </Box>
                                    </TooltipHelper>
                                )}

                                {onHideCallback && (
                                    <Box
                                        onClick={() => onHideCallback()}
                                        sx={{
                                            cursor: "pointer",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgClose size="1.6rem" />
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        bottom: 0,
                                        left: -6,
                                        right: -6,
                                        backgroundColor: topRightBackgroundColor,
                                        borderLeft: `${theme.factionTheme.primary}BB .25rem solid`,
                                        borderBottom: `${theme.factionTheme.primary}BB .25rem solid`,
                                        transform: "skew(35deg)",
                                        zIndex: -1,
                                    }}
                                />
                            </Stack>
                        </Box>

                        <Box
                            sx={{
                                position: "relative",
                                width: curWidth,
                                height: curHeight,
                                transition: "all .2s",
                                resize: "all",
                                overflow: "hidden",
                                borderRadius: 0.5,
                                zIndex: 2,
                            }}
                        >
                            {children}
                        </Box>
                    </ClipThing>
                </Box>
            </Box>
        </Box>
    )
}
