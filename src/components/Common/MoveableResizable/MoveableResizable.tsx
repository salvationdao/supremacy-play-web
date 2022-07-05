import { Box, Stack } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { Rnd } from "react-rnd"
import { TooltipHelper } from "../.."
import { SvgClose, SvgDrag, SvgInfoCircular } from "../../../assets"
import { ClipThing } from "../../../components"
import { useTheme } from "../../../containers/theme"
import { shadeColor } from "../../../helpers"
import { colors, siteZIndex } from "../../../theme/theme"
import { MoveableResizableConfig, MoveableResizableProvider, useMoveableResizable } from "./MoveableResizableContainer"

interface MoveableResizableProps {
    config: MoveableResizableConfig
    children: ReactNode
}

export const MoveableResizable = (props: MoveableResizableProps) => {
    return (
        <MoveableResizableProvider initialState={props.config}>
            <MoveableResizableInner {...props} />
        </MoveableResizableProvider>
    )
}

const MoveableResizableInner = ({ children }: MoveableResizableProps) => {
    const theme = useTheme()
    const {
        rndRef,
        defaultWidth,
        defaultHeight,
        defaultPosX,
        defaultPosY,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        onHideCallback,
        infoTooltipText,
        onMovingStopped,
        onResizeStopped,
        topRightContent,
    } = useMoveableResizable()

    const topRightBackgroundColor = useMemo(() => shadeColor(theme.factionTheme.primary, -90), [theme.factionTheme.primary])

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
                    backgroundColor={theme.factionTheme.background}
                    opacity={0.8}
                    sx={{ position: "relative", width: "100%", height: "100%", transition: "all .2s" }}
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
                                pr: "1.7rem",
                                height: "3.3rem",
                                zIndex: 3,
                            }}
                        >
                            {topRightContent}

                            {infoTooltipText && (
                                <TooltipHelper text={infoTooltipText} placement="bottom">
                                    <Box
                                        sx={{
                                            mr: ".9rem",
                                            opacity: 0.4,
                                            ":hover": { opacity: 1 },
                                        }}
                                    >
                                        <SvgInfoCircular fill={colors.text} size="1.6rem" />
                                    </Box>
                                </TooltipHelper>
                            )}

                            <Box
                                className="moveable-resizable-drag-handle"
                                sx={{
                                    mr: onHideCallback ? ".9rem" : 0,
                                    cursor: "move",
                                    opacity: 0.4,
                                    ":hover": { opacity: 1 },
                                }}
                            >
                                <SvgDrag size="1.6rem" />
                            </Box>

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

                    <Box
                        className="moveable-resizable-drag-handle"
                        sx={{
                            cursor: "move",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: "12rem",
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