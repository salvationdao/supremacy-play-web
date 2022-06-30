import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { MiniMapInside, MoveableResizable } from ".."
import { SvgFullscreen } from "../../assets"
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { useDimension, useGame, useOverlayToggles } from "../../containers"
import { useMiniMap } from "../../containers/minimap"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts } from "../../theme/theme"
import { Map } from "../../types"
import { MoveableResizableConfig, useMoveableResizable } from "../Common/MoveableResizable/MoveableResizableContainer"
import { TargetHint } from "./MapOutsideItems/TargetHint"

export const MiniMap = () => {
    const { map, bribeStage } = useGame()
    const { isTargeting, isEnlarged, resetSelection, toggleIsEnlarged } = useMiniMap()
    const { isMapOpen, toggleIsMapOpen } = useOverlayToggles()

    // Temp hotfix ask james ****************************
    const [show, toggleShow] = useToggle(false)
    useEffect(() => {
        if (bribeStage && bribeStage.phase !== "HOLD") {
            toggleShow(true)
        } else {
            toggleShow(false)
            resetSelection()
        }
    }, [bribeStage, toggleShow, resetSelection])
    // End ****************************************

    // Map config
    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "minimap",
            // Defaults
            defaultPosX: 10,
            defaultPosY: 10,
            defaultWidth: MINI_MAP_DEFAULT_SIZE,
            defaultHeight: MINI_MAP_DEFAULT_SIZE,
            // Position limits
            minPosX: 10,
            minPosY: 10,
            // Size limits
            minWidth: 225,
            minHeight: 225,
            maxWidth: 1000,
            maxHeight: 1000,
            // Others
            infoTooltipText: "Battle arena minimap.",
            onHideCallback: () => toggleIsMapOpen(false),
            topRightContent: (
                <Box
                    onClick={() => toggleIsEnlarged()}
                    sx={{
                        mr: ".9rem",
                        cursor: "pointer",
                        opacity: 0.4,
                        ":hover": { opacity: 1 },
                    }}
                >
                    <SvgFullscreen size="1.6rem" />
                </Box>
            ),
        }),
        [toggleIsEnlarged, toggleIsMapOpen],
    )

    const mapRender = useMemo(() => {
        if (!map) return null

        return (
            <Fade in={show}>
                <Box>
                    <MoveableResizable config={config}>
                        <MiniMapInner map={map} isTargeting={isTargeting} isEnlarged={isEnlarged} />
                    </MoveableResizable>
                </Box>
            </Fade>
        )
    }, [config, show, map, isTargeting, isEnlarged])

    if (!isMapOpen) return null

    return mapRender
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isTargeting, isEnlarged }: { map: Map; isTargeting: boolean; isEnlarged: boolean }) => {
    const theme = useTheme()
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    const {
        curWidth,
        curHeight,
        curPosX,
        curPosY,
        defaultWidth,
        defaultHeight,
        maxWidth,
        maxHeight,
        setCurWidth,
        setCurHeight,
        setCurPosX,
        setCurPosY,
        setDefaultWidth,
        setDefaultHeight,
    } = useMoveableResizable()

    const mapHeightWidthRatio = useRef(1)
    const prevWidth = useRef(curWidth)
    const prevHeight = useRef(curHeight)
    const prevPosX = useRef(curPosX)
    const prevPosY = useRef(curPosY)

    const isLargeMode = useMemo(() => curWidth > 350 || curHeight > 350, [curHeight, curWidth])

    // Set initial size
    useEffect(() => {
        const ratio = map.height / map.width
        const defaultW = defaultWidth
        const defaultH = defaultHeight * ratio

        setDefaultWidth(defaultW)
        setDefaultHeight(defaultH)
        setCurHeight(curWidth * ratio)
        mapHeightWidthRatio.current = ratio
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, setDefaultWidth, setDefaultHeight, setCurHeight])

    // When it's targeting, enlarge the map and move to center of screen, else restore to the prev dimensions
    useEffect(() => {
        if (isTargeting || isEnlarged) {
            const maxW = Math.min(width - 25, maxWidth || width, 900)
            const maxH = Math.min(maxW * mapHeightWidthRatio.current, maxHeight || height, height - 120)
            let targetingWidth = Math.min(maxW, 900)
            let targetingHeight = targetingWidth * mapHeightWidthRatio.current

            if (targetingHeight > maxH) {
                targetingHeight = Math.min(maxH, 700)
                targetingWidth = targetingHeight / mapHeightWidthRatio.current
            }

            setCurPosX((prev1) => {
                prevPosX.current = prev1

                setCurWidth((prev2) => {
                    prevWidth.current = prev2
                    return targetingWidth
                })

                return (width - targetingWidth) / 2
            })
            setCurPosY((prev1) => {
                prevPosY.current = prev1

                setCurHeight((prev2) => {
                    prevHeight.current = prev2
                    return targetingHeight
                })

                return (height - targetingHeight) / 2
            })
        } else {
            setCurPosX(() => {
                setCurWidth(prevWidth.current)
                return prevPosX.current
            })
            setCurPosY(() => {
                setCurHeight(prevHeight.current)
                return prevPosY.current
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTargeting, isEnlarged, maxHeight, maxWidth, setCurHeight, setCurPosX, setCurPosY, setCurWidth])

    let mapName = map.name
    if (mapName === "NeoTokyo") mapName = "City Block X2"

    return useMemo(
        () => (
            <Box
                sx={{
                    position: "relative",
                    boxShadow: 1,
                    width: curWidth,
                    height: curHeight,
                    transition: "all .2s",
                    overflow: "hidden",
                    pointerEvents: "all",
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        height: "3.1rem",
                        px: "1.8rem",
                        backgroundColor: "#000000BF",
                        borderBottom: `${theme.factionTheme.primary}80 .25rem solid`,
                        zIndex: 99,
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{
                            fontFamily: fonts.nostromoBlack,
                            lineHeight: 1,
                            opacity: 0.8,
                        }}
                    >
                        {mapName
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .toUpperCase()}
                    </Typography>
                </Stack>

                <MiniMapInside containerDimensions={{ width: curWidth, height: curHeight }} isLargeMode={isLargeMode} />

                <TargetHint />
            </Box>
        ),
        [curWidth, curHeight, theme.factionTheme.primary, mapName, isLargeMode],
    )
}
