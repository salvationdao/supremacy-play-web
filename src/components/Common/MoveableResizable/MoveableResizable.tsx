import { Box, Stack } from "@mui/material"
import { ReactNode, useMemo } from "react"
import { ResizeBox, TooltipHelper } from "../.."
import { SvgClose, SvgDrag, SvgInfoCircular } from "../../../assets"
import { ClipThing } from "../../../components"
import { useTheme } from "../../../containers/theme"
import { shadeColor } from "../../../helpers"
import { colors, siteZIndex } from "../../../theme/theme"
import { MoveableResizableConfig, MoveableResizableProvider, useMoveableResizable } from "./MoveableResizableContainer"
import { MovingBox } from "./MovingBox"

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
        onHideCallback,
        infoTooltipText,
        curPosX,
        curPosY,
        curWidth,
        curHeight,
        onMovingStopped,
        onResizeStopped,
    } = useMoveableResizable()

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
                key={`${curWidth}${curHeight}${curPosX}${curPosY}`}
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
                    <>
                        <Box
                            className="handle"
                            sx={{ cursor: "move", position: "absolute", top: 0, left: 0, right: "10rem", height: "3rem", pointerEvents: "all" }}
                        />
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
                    </>
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
                    transition: "all .2s",
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
                                    width: "2rem",
                                    height: "2rem",
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
                                    <TooltipHelper text={infoTooltipText} placement="bottom">
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

                        <Box
                            sx={{
                                position: "absolute",
                                bottom: -9,
                                right: ".9rem",
                                height: "4.2rem",
                                transform: "rotate(45deg)",
                                zIndex: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: ".25rem",
                                    height: "100%",
                                    backgroundColor: theme.factionTheme.primary,
                                }}
                            />
                        </Box>
                    </ClipThing>
                </Box>
            </Box>
        </Box>
    )
}
