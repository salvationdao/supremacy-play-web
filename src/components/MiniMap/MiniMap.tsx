import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef } from "react"
import { MiniMapInside, MoveableResizable } from ".."
import { SvgFullscreen } from "../../assets"
import { MINI_MAP_DEFAULT_SIZE } from "../../constants"
import { useDimension, useGame, useMobile, useOverlayToggles } from "../../containers"
import { useMiniMap } from "../../containers/minimap"
import { useTheme } from "../../containers/theme"
import { useToggle } from "../../hooks"
import { fonts } from "../../theme/theme"
import { Map } from "../../types"
import { MoveableResizableConfig, useMoveableResizable } from "../Common/MoveableResizable/MoveableResizableContainer"
import { TargetHint } from "./MapOutsideItems/TargetHint"

const TOP_BAR_HEIGHT = 3.1 // rems

export const MiniMap = () => {
    const { isMobile } = useMobile()
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

    useEffect(() => {
        if (isTargeting) toggleIsMapOpen(true)
    }, [isTargeting, toggleIsMapOpen])

    // Map config
    const config: MoveableResizableConfig = useMemo(
        () => ({
            localStoragePrefix: "miniMap1",
            // Defaults
            defaultPosX: 350,
            defaultPosY: 0,
            defaultWidth: MINI_MAP_DEFAULT_SIZE,
            defaultHeight: MINI_MAP_DEFAULT_SIZE,
            // Position limits
            minPosX: 0,
            minPosY: 0,
            // Size limits
            minWidth: 225,
            minHeight: 225,
            maxWidth: 1000,
            maxHeight: 1000,
            // Others
            infoTooltipText: "Battle arena minimap.",
            onHideCallback: () => toggleIsMapOpen(false),
            hidePopoutBorder: true,
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

    return useMemo(() => {
        if (!map) return null

        const toRender = show && isMapOpen

        return (
            <Fade in={toRender}>
                <Box sx={{ ...(isMobile ? { backgroundColor: "#FFFFFF12", boxShadow: 2, border: "#FFFFFF20 1px solid" } : {}) }}>
                    <MoveableResizable config={config}>
                        <MiniMapInner map={map} isTargeting={isTargeting} isEnlarged={isEnlarged} toRender={toRender} />
                    </MoveableResizable>
                </Box>
            </Fade>
        )
    }, [map, show, isMapOpen, isMobile, config, isTargeting, isEnlarged])
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isTargeting, isEnlarged, toRender }: { map: Map; isTargeting: boolean; isEnlarged: boolean; toRender: boolean }) => {
    const { isMobile } = useMobile()
    const theme = useTheme()
    const {
        remToPxRatio,
        gameUIDimensions: { width, height },
    } = useDimension()
    const {
        isPoppedout,
        updateSize,
        updatePosition,
        curWidth,
        curHeight,
        curPosX,
        curPosY,
        defaultWidth,
        maxWidth,
        maxHeight,
        setDefaultWidth,
        setDefaultHeight,
        minWidth,
        setMinHeight,
    } = useMoveableResizable()

    const ref = useRef<HTMLDivElement>()
    const mapHeightWidthRatio = useRef(1)
    const prevWidth = useRef(curWidth)
    const prevHeight = useRef(curHeight)
    const prevPosX = useRef(curPosX)
    const prevPosY = useRef(curPosY)

    // Set initial size
    useEffect(() => {
        const ratio = map.height / map.width
        const defaultW = defaultWidth
        const defaultH = defaultWidth * ratio + TOP_BAR_HEIGHT * remToPxRatio
        const minH = (minWidth || defaultWidth) * ratio + TOP_BAR_HEIGHT * remToPxRatio

        setDefaultWidth(defaultW)
        setDefaultHeight(defaultH)
        setMinHeight(minH)
        updateSize({ width: curWidth, height: curWidth * ratio + TOP_BAR_HEIGHT * remToPxRatio })
        mapHeightWidthRatio.current = ratio
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, setDefaultWidth, setDefaultHeight])

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

            prevPosX.current = curPosX
            prevPosY.current = curPosY
            prevWidth.current = curWidth
            prevHeight.current = curHeight
            updateSize({ width: targetingWidth, height: targetingHeight })
            updatePosition({ x: (width - targetingWidth) / 2, y: Math.max((height - targetingHeight) / 2 - 55, 25) })
        } else {
            updateSize({ width: prevWidth.current, height: prevHeight.current })
            updatePosition({ x: prevPosX.current, y: prevPosY.current })
        }

        if (isTargeting && isMobile && ref.current) {
            ref.current.scrollIntoView()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTargeting, isEnlarged, maxHeight, maxWidth, isMobile])

    let mapName = map.name
    if (mapName === "NeoTokyo") mapName = "City Block X2"

    return useMemo(() => {
        if (!toRender) return null

        let outsideWidth = curWidth
        let outsideHeight = curHeight
        let insideWidth = outsideWidth
        let insideHeight = outsideHeight - TOP_BAR_HEIGHT * remToPxRatio

        if (isPoppedout) {
            const maxHeight = outsideWidth * mapHeightWidthRatio.current
            const maxWidth = outsideHeight / mapHeightWidthRatio.current

            if (outsideHeight > maxHeight) {
                outsideHeight = maxHeight
            }
            insideHeight = outsideHeight

            if (outsideWidth > maxWidth) {
                outsideWidth = maxWidth
                insideWidth = outsideWidth
            }
        }

        if (isMobile) {
            const parentDiv = ref.current?.parentElement
            insideWidth = parentDiv?.offsetWidth || 300
            insideHeight = parentDiv?.offsetWidth || 300 * mapHeightWidthRatio.current
        }

        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Box
                    ref={ref}
                    sx={{
                        position: "relative",
                        boxShadow: 1,
                        width: outsideWidth,
                        height: outsideHeight,
                        transition: "all .2s",
                        overflow: "hidden",
                        pointerEvents: "all",
                        border: `${theme.factionTheme.primary} 1.5px solid`,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            height: `${TOP_BAR_HEIGHT}rem`,
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

                    <MiniMapInside containerDimensions={{ width: insideWidth, height: insideHeight }} />

                    <TargetHint />
                </Box>
            </Stack>
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toRender, theme.factionTheme.primary, mapName, curWidth, curHeight, remToPxRatio, isMobile, width, height, isPoppedout])
}
