import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { MiniMapInside } from "../.."
import { SvgExternalLink } from "../../../assets"
import { useDimension, useGame } from "../../../containers"
import { useHotkey } from "../../../containers/hotkeys"
import { useMiniMap } from "../../../containers/minimap"
import { fonts } from "../../../theme/theme"
import { Dimension, Map } from "../../../types"
import { WindowPortal } from "../../Common/WindowPortal/WindowPortal"
import { useWindowPortal } from "../../Common/WindowPortal/WindowPortalContainer"
import { LEFT_DRAWER_WIDTH } from "../../LeftDrawer/LeftDrawer"
import { HighlightedMechAbilities } from "./MapOutsideItems/HighlightedMechAbilities"
import { TargetHint } from "./MapOutsideItems/TargetHint"

export const TOP_BAR_HEIGHT = 3.4 // rems
const BOTTOM_PADDING = 10 // rems

export const MiniMap = () => {
    const { map, bribeStage } = useGame()
    const { isTargeting, resetSelection } = useMiniMap()
    const [isBattleStarted, setIsBattleStarted] = useState(false)
    const [isPoppedout, setIsPoppedout] = useState(false)

    useEffect(() => {
        if (bribeStage && bribeStage.phase !== "HOLD" ? true : false) {
            setIsBattleStarted(true)
        } else {
            setIsBattleStarted(false)
            resetSelection()
        }
    }, [bribeStage, setIsBattleStarted, resetSelection])

    if (!map) {
        return null
    }

    if (isPoppedout) {
        return (
            <WindowPortal title="Supremacy - Battle Arena" onClose={() => setIsPoppedout(false)} features={{ width: 600, height: 600 }}>
                <Box sx={{ width: "100%", height: "100%", border: (theme) => `${theme.factionTheme.primary} 1.5px solid` }}>
                    {isBattleStarted ? (
                        <MiniMapInnerPoppedOut map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
                    ) : (
                        <div />
                    )}
                </Box>
            </WindowPortal>
        )
    }

    return (
        <>{isBattleStarted ? <MiniMapInnerNormal map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} /> : <div />}</>
    )
}

interface MiniMapInnerProps {
    map: Map
    isTargeting: boolean
    isPoppedout: boolean
    setIsPoppedout: React.Dispatch<React.SetStateAction<boolean>>
    width?: number
    height?: number
}

const MiniMapInnerPoppedOut = ({ map, isTargeting, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const { curWidth, curHeight } = useWindowPortal()
    return <MiniMapInner map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} width={curWidth} height={curHeight} />
}

const MiniMapInnerNormal = ({ map, isTargeting, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    return <MiniMapInner map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} width={width} height={height} />
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isTargeting, isPoppedout, setIsPoppedout, width = 100, height = 100 }: MiniMapInnerProps) => {
    const { isStreamBigDisplay, setIsStreamBigDisplay } = useGame()
    const { handleHotKey } = useHotkey()
    const { remToPxRatio } = useDimension()

    const [renderDimensions, setRenderDimensions] = useState<Dimension>({ width: 100, height: 100 })
    const mapHeightWidthRatio = useRef(1)
    const prevIsStreamBigDisplay = useRef(isStreamBigDisplay)

    const containFit = useMemo(() => isPoppedout || !isStreamBigDisplay, [isPoppedout, isStreamBigDisplay])

    // Set size
    useEffect(() => {
        mapHeightWidthRatio.current = map.height / map.width

        let defaultWidth = width
        let defaultHeight = 0
        if (!containFit) {
            defaultWidth = LEFT_DRAWER_WIDTH * remToPxRatio
            defaultHeight = defaultWidth * mapHeightWidthRatio.current
        } else {
            defaultHeight = Math.min(defaultWidth * mapHeightWidthRatio.current, height)
        }

        setRenderDimensions({ width: defaultWidth, height: defaultHeight })
    }, [map, remToPxRatio, isPoppedout, isStreamBigDisplay, containFit, width, height])

    // When it's targeting, enlarge to big display, else restore to the prev location
    useEffect(() => {
        if (isTargeting) {
            setIsStreamBigDisplay((prev) => {
                prevIsStreamBigDisplay.current = prev
                return false
            })
        } else {
            setIsStreamBigDisplay(prevIsStreamBigDisplay.current)
        }
    }, [isTargeting, setIsStreamBigDisplay])

    const sizes = useMemo(() => {
        const padding = 6 * remToPxRatio
        let outsideWidth = renderDimensions.width - padding
        let outsideHeight = renderDimensions.height - padding - BOTTOM_PADDING * remToPxRatio
        let insideWidth = outsideWidth
        let insideHeight = outsideHeight - TOP_BAR_HEIGHT * remToPxRatio

        if (containFit) {
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

        return {
            outsideWidth,
            outsideHeight,
            insideWidth,
            insideHeight,
        }
    }, [containFit, remToPxRatio, renderDimensions.height, renderDimensions.width])

    return useMemo(() => {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    pb: containFit ? `${BOTTOM_PADDING}rem` : 0,
                }}
            >
                <Box
                    tabIndex={0}
                    onKeyDown={handleHotKey}
                    sx={{
                        position: "relative",
                        boxShadow: 1,
                        width: sizes.outsideWidth,
                        height: sizes.outsideHeight,
                        transition: "all .2s",
                        overflow: "hidden",
                        pointerEvents: "all",
                        zIndex: 2,
                    }}
                >
                    {/* Top bar */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            p: ".6rem 1.6rem",
                            height: `${TOP_BAR_HEIGHT}rem`,
                            background: (theme) => `linear-gradient(${theme.factionTheme.background} 26%, ${theme.factionTheme.background}BB)`,
                            zIndex: 99,
                        }}
                    >
                        <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>
                            {map.name
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .toUpperCase()}
                        </Typography>

                        <Box sx={{ flex: 1 }} />

                        <Box onClick={() => setIsPoppedout(true)} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                            <SvgExternalLink size="1.6rem" />
                        </Box>
                    </Stack>

                    <MiniMapInside containerDimensions={{ width: sizes.insideWidth, height: sizes.insideHeight }} />

                    <TargetHint />

                    <HighlightedMechAbilities />
                </Box>

                {/* Not scaled map background image, for background only */}
                <Box
                    sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        background: `url(${map?.image_url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        opacity: 0.15,
                        zIndex: 1,
                    }}
                />
            </Stack>
        )
    }, [containFit, handleHotKey, sizes.outsideWidth, sizes.outsideHeight, sizes.insideWidth, sizes.insideHeight, map.name, map?.image_url, setIsPoppedout])
}
