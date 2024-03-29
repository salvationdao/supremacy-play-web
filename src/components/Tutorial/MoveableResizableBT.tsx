import { Box, Stack } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { Rnd } from "react-rnd"
import { SvgInfoCircular } from "../../assets"
import { useDimension, useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { shadeColor } from "../../helpers"
import { colors, siteZIndex } from "../../theme/theme"
import { ClipThing } from "../Common/Deprecated/ClipThing"
import { NiceTooltip } from "../Common/Nice/NiceTooltip"
import { WindowPortal } from "../Common/WindowPortal/WindowPortal"

import { MoveableResizableBTProvider, MoveableResizableConfig, useMoveableResizableBT } from "./MoveableResizeableContainerBT"

interface MoveableResizableProps {
    config: MoveableResizableConfig
    children: ReactNode
}

export const MoveableResizableBT = (props: MoveableResizableProps) => {
    const { isMobile } = useMobile()

    return (
        <MoveableResizableBTProvider initialState={props.config}>
            {isMobile ? <>{props.children}</> : <MoveableResizableInner {...props} />}
        </MoveableResizableBTProvider>
    )
}

const MoveableResizableInner = ({ children }: MoveableResizableProps) => {
    const theme = useTheme()
    const { remToPxRatio } = useDimension()
    const {
        setPopoutRef,
        isPoppedout,
        toggleIsPoppedout,
        curWidth,
        curHeight,

        rndRef,
        defaultWidth,
        defaultHeight,
        defaultPosX,
        defaultPosY,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        infoTooltipText,
        onMovingStopped,
        onResizeStopped,
        topRightContent,

        autoFit,
        hidePopoutBorder,
    } = useMoveableResizableBT()

    const topRightBackgroundColor = useMemo(() => shadeColor(theme.factionTheme.primary, -90), [theme.factionTheme.primary])

    if (isPoppedout) {
        return (
            <WindowPortal
                ref={(ref: HTMLDivElement) => setPopoutRef(ref)}
                title="Supremacy - Battle Arena"
                onClose={() => {
                    toggleIsPoppedout(false)
                    setPopoutRef(null)
                }}
                features={{
                    width: curWidth / (remToPxRatio / 11),
                    height: curHeight / (remToPxRatio / 11) + 30, // this is the top bar height
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        border: hidePopoutBorder ? "unset" : `${theme.factionTheme.primary} 1.5px solid`,
                    }}
                >
                    {children}
                </Box>
            </WindowPortal>
        )
    }

    return (
        <Box
            sx={{
                position: "absolute",
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
                ".moveable-resizable": {
                    zIndex: siteZIndex.MoveableResizable,
                    ":hover": {
                        zIndex: siteZIndex.MoveableResizableHover,
                    },
                },
            }}
        >
            <Rnd
                ref={(c) => (rndRef.current = c)}
                default={{
                    x: defaultPosX,
                    y: defaultPosY,
                    width: defaultWidth,
                    height: defaultHeight,
                }}
                size={autoFit ? { width: "unset", height: "unset" } : undefined}
                enableResizing={autoFit ? {} : undefined}
                className="moveable-resizable"
                dragHandleClassName="moveable-resizable-drag-handle"
                minWidth={minWidth}
                minHeight={minHeight}
                maxWidth={maxWidth}
                maxHeight={maxHeight}
                bounds="parent"
                onDragStop={(e, d) => onMovingStopped({ x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                    onMovingStopped(position)
                    onResizeStopped({
                        width: parseFloat(ref.style.width),
                        height: parseFloat(ref.style.height),
                    })
                }}
            >
                <ClipThing
                    clipSize="8px"
                    border={{
                        borderThickness: ".25rem",
                        borderColor: theme.factionTheme.primary,
                    }}
                    backgroundColor={theme.factionTheme.u800}
                    opacity={0.8}
                    sx={{ position: "relative", width: "100%", height: "100%", transition: "all .2s" }}
                >
                    {/* Top right icon buttons */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            zIndex: 999,
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            sx={{
                                position: "relative",
                                pl: "1rem",
                                pr: "1.7rem",
                                height: "3.3rem",
                            }}
                        >
                            {topRightContent}

                            {infoTooltipText && (
                                <NiceTooltip text={infoTooltipText} placement="bottom">
                                    <Box
                                        sx={{
                                            mr: ".9rem",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgInfoCircular fill={colors.text} size="1.6rem" />
                                    </Box>
                                </NiceTooltip>
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
                            width: "100%",
                            height: "100%",
                            transition: "all .2s",
                            resize: "all",
                            overflow: "hidden",
                            borderRadius: 0.5,
                            zIndex: 2,
                        }}
                    >
                        {children}
                    </Box>

                    {/* Invisible at the top, handle for dragging */}
                    <Box
                        className="moveable-resizable-drag-handle"
                        sx={{
                            cursor: "move",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            width: "100%",
                            height: "2.8rem",
                            pointerEvents: "all",
                            zIndex: 99,
                        }}
                    />
                </ClipThing>
            </Rnd>
        </Box>
    )
}
