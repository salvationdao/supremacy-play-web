import { Box, Fade, Stack, Theme, Typography } from "@mui/material"
import { useTheme } from "@mui/styles"
import React, { SyntheticEvent, useEffect, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { Resizable, ResizeCallbackData } from "react-resizable"
import { GenericWarMachinePNG, SvgDrag, SvgResizeArrow } from "../../assets"
import { UI_OPACITY } from "../../constants"
import { useDimension } from "../../containers"
import { parseString } from "../../helpers"
import { pulseEffect } from "../../theme/keyframes"
import { colors } from "../../theme/theme"

const Padding = 10
const DefaultPositionX = 0
const DefaultPositionYBottom = 128
const DefaultSizeX = 240
const DefaultSizeY = 400
const MaxSizeY = 400
const DefaultMaxWarMachineQueueLength = 400

export const WarMachineQueue = () => {
    const theme = useTheme<Theme>()
    const {
        streamDimensions: { width, height },
    } = useDimension()
    const [curPosX, setCurPosX] = useState(-1)
    const [curPosY, setCurPosY] = useState(-1)
    const [curWidth, setCurWidth] = useState(parseString(localStorage.getItem("warMachineQueueSizeX"), DefaultSizeX))
    const [curHeight, setCurHeight] = useState(parseString(localStorage.getItem("warMachineQueueSizeY"), DefaultSizeY))
    const [maxWarMachineQueueLength, setWarMachineQueueLength] = useState(
        parseString(localStorage.getItem("warMachineQueueDataMax"), DefaultMaxWarMachineQueueLength),
    )

    useEffect(() => {
        if (width <= 0 || height <= 0) return

        let newPosX = parseString(localStorage.getItem("warMachineQueuePosX"), -1)
        let newPosY = parseString(localStorage.getItem("warMachineQueuePosY"), -1)

        // Make sure live voting chart is inside iframe when page is resized etc.
        newPosX =
            newPosX > 0 ? Math.max(Padding, Math.min(newPosX, width - curWidth - Padding)) : DefaultPositionX + Padding
        newPosY =
            newPosY > 0
                ? Math.max(Padding, Math.min(newPosY, height - curHeight - Padding))
                : height - DefaultPositionYBottom - curHeight

        setCurPosX(newPosX)
        setCurPosY(newPosY)
        localStorage.setItem("warMachineQueuePosX", newPosX.toString())
        localStorage.setItem("warMachineQueuePosY", newPosY.toString())

        onResize()
    }, [width, height, curWidth])

    const onResize = (e?: SyntheticEvent<Element, Event>, data?: ResizeCallbackData) => {
        if (width <= 0 || height <= 0) return

        const { size } = data || { size: { width: curWidth, height: curHeight } }
        if (size.width >= DefaultSizeX) {
            setWarMachineQueueLength(size.width / 5)
            setCurWidth(Math.min(width - 2 * Padding, size.width))
        }

        if (size.height <= MaxSizeY && size.height >= DefaultSizeY) {
            setCurHeight(Math.min(height - 2 * Padding, size.height))
        }
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
                onStop={(e: DraggableEvent, data: DraggableData) => {
                    setCurPosX(data.x)
                    setCurPosY(data.y)
                    localStorage.setItem("warMachineQueuePosX", data.x.toString())
                    localStorage.setItem("warMachineQueuePosY", data.y.toString())
                }}
                bounds={{
                    top: Padding,
                    bottom: height - curHeight - Padding,
                    left: Padding,
                    right: width - curWidth - Padding,
                }}
            >
                <Box sx={{ pointerEvents: "all" }}>
                    <Fade in={true}>
                        <Box>
                            <Resizable
                                height={curHeight}
                                width={curWidth}
                                onResize={onResize}
                                handle={() => (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 9.1,
                                            right: 9,
                                            cursor: "ew-resize",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgResizeArrow size="13px" />
                                    </Box>
                                )}
                                onResizeStop={(e: SyntheticEvent, data: ResizeCallbackData) => {
                                    localStorage.setItem("warMachineQueueSizeX", data.size.width.toString())
                                    localStorage.setItem("warMachineQueueSizeY", data.size.height.toString())
                                }}
                            >
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
                                    <Box sx={{ flex: 1, px: 1, pt: 1, pb: 0.9, width: "100%" }}>
                                        <Box
                                            key={maxWarMachineQueueLength}
                                            sx={{
                                                position: "relative",
                                                height: "100%",
                                                px: 0.7,
                                                pt: 2,
                                                background: "#00000099",
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                                spacing={0.5}
                                                sx={{
                                                    position: "absolute",
                                                    top: 5,
                                                    right: 7,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 7,
                                                        height: 7,
                                                        mb: 0.2,
                                                        backgroundColor: colors.red,
                                                        borderRadius: "50%",
                                                        animation: `${pulseEffect} 3s infinite`,
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ lineHeight: 1 }}>
                                                    Live
                                                </Typography>
                                            </Stack>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    "&:not(:last-child)": {
                                                        marginBottom: 1,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={GenericWarMachinePNG}
                                                    alt="Warmachine Thumbnail"
                                                    sx={{
                                                        height: 40,
                                                        width: 40,
                                                        marginRight: 1,
                                                    }}
                                                />
                                                <Box>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            textAlign: "start",
                                                        }}
                                                    >
                                                        Warmachine name
                                                    </Typography>
                                                    <Typography variant="subtitle2">Queue Position: 1</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="flex-end"
                                        sx={{ px: 1.3, pb: 0.7 }}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{ mr: "auto" }}
                                        >
                                            <Typography variant="body1">Your Warmachine Queue</Typography>
                                        </Stack>

                                        <Box
                                            className="handle"
                                            sx={{ cursor: "move", mr: "20px", opacity: 0.4, ":hover": { opacity: 1 } }}
                                        >
                                            <SvgDrag size="13px" />
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Resizable>
                        </Box>
                    </Fade>
                </Box>
            </Draggable>
        </Stack>
    )
}
