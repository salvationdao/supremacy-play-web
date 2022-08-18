import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { MiniMapInside } from "../.."
import { BattleBgWebP, SvgExternalLink, SvgFullscreen, SvgMinimize, SvgSwap } from "../../../assets"
import { useDimension, useGame } from "../../../containers"
import { useHotkey } from "../../../containers/hotkeys"
import { useMiniMap } from "../../../containers/minimap"
import { useToggle } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { Map } from "../../../types"
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
        if (map && bribeStage && bribeStage.phase !== "HOLD" ? true : false) {
            setIsBattleStarted(true)
        } else {
            setIsBattleStarted(false)
            resetSelection()
        }
    }, [bribeStage, setIsBattleStarted, resetSelection, map])

    if (isPoppedout) {
        return (
            <WindowPortal title="Supremacy - Battle Arena" onClose={() => setIsPoppedout(false)} features={{ width: 600, height: 600 }}>
                <Box sx={{ width: "100%", height: "100%", border: (theme) => `${theme.factionTheme.primary} 1.5px solid` }}>
                    {isBattleStarted && map ? (
                        <MiniMapInnerPoppedOut map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
                    ) : (
                        <BattleNotStarted />
                    )}
                </Box>
            </WindowPortal>
        )
    }

    if (isBattleStarted && map) {
        return <MiniMapInnerNormal map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
    }

    return <BattleNotStarted />
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
    if (!curWidth || !curHeight) return null
    return <MiniMapInner map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} width={curWidth} height={curHeight} />
}

const MiniMapInnerNormal = ({ map, isTargeting, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    if (!width || !height) return null
    return <MiniMapInner map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} width={width} height={height} />
}

const BattleNotStarted = () => {
    const { isStreamBigDisplay } = useGame()
    const [showBg, setShowBg] = useState(false)

    // Only show the bg image after X seconds, dont want a bright flash in between battles
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowBg(true)
        }, 20000)

        return () => clearTimeout(timeout)
    }, [])

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "relative",
                width: "100%",
                height: isStreamBigDisplay ? "28rem" : "100%",
                background: showBg ? `url(${BattleBgWebP})` : "unset",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Typography
                variant={!isStreamBigDisplay ? "h5" : "h6"}
                sx={{
                    color: colors.grey,
                    fontFamily: fonts.nostromoBold,
                    WebkitTextStrokeWidth: !isStreamBigDisplay ? "1px" : "unset",
                    textAlign: "center",
                    zIndex: 1,
                }}
            >
                Preparing for next battle...
            </Typography>

            <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "#00000050", zIndex: 0 }} />
        </Stack>
    )
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isTargeting, isPoppedout, setIsPoppedout, width = 100, height = 100 }: MiniMapInnerProps) => {
    const { handleHotKey } = useHotkey()
    const { remToPxRatio } = useDimension()
    const { isStreamBigDisplay, setIsStreamBigDisplay, prevIsStreamBigDisplay } = useGame()
    const [isEnlarged, toggleIsEnlarged] = useToggle(localStorage.getItem("isMiniMapEnlarged") === "true")

    const mapHeightWidthRatio = useRef(1)

    // If small version, not allow enlarge
    useEffect(() => {
        if (isStreamBigDisplay) toggleIsEnlarged(false)
    }, [isStreamBigDisplay, toggleIsEnlarged])

    useEffect(() => {
        localStorage.setItem("isMiniMapEnlarged", isEnlarged.toString())
    }, [isEnlarged])

    // When it's targeting, enlarge to big display, else restore to the prev location
    useEffect(() => {
        if (isTargeting) {
            setIsStreamBigDisplay((prev) => {
                if (!prevIsStreamBigDisplay.current) prevIsStreamBigDisplay.current = prev
                return false
            })
        } else if (prevIsStreamBigDisplay.current) {
            setIsStreamBigDisplay(prevIsStreamBigDisplay.current)
            prevIsStreamBigDisplay.current = undefined
        }
    }, [isTargeting, prevIsStreamBigDisplay, setIsStreamBigDisplay])

    // Set size
    const sizes = useMemo(() => {
        // Step 1
        mapHeightWidthRatio.current = map.height / map.width

        let defaultWidth = width
        let defaultHeight = 0
        if (isPoppedout || !isStreamBigDisplay) {
            defaultHeight = Math.min(defaultWidth * mapHeightWidthRatio.current, height)
        } else {
            defaultWidth = LEFT_DRAWER_WIDTH * remToPxRatio
            defaultHeight = defaultWidth * mapHeightWidthRatio.current
        }

        if (isEnlarged) defaultHeight = height

        // Step 2
        const padding = (isPoppedout || !isStreamBigDisplay) && !isEnlarged ? 6 * remToPxRatio : 0
        let bottomPadding = padding
        if (!isPoppedout && !isStreamBigDisplay) bottomPadding += BOTTOM_PADDING * remToPxRatio

        let outsideWidth = defaultWidth - padding
        let outsideHeight = defaultHeight - bottomPadding
        let insideWidth = outsideWidth
        let insideHeight = outsideHeight - TOP_BAR_HEIGHT * remToPxRatio

        if ((isPoppedout || !isStreamBigDisplay) && !isEnlarged) {
            const maxHeight = outsideWidth * mapHeightWidthRatio.current
            const maxWidth = outsideHeight / mapHeightWidthRatio.current

            if (outsideHeight > maxHeight) outsideHeight = maxHeight
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
    }, [map.height, map.width, width, isEnlarged, height, remToPxRatio])

    return useMemo(() => {
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    pb: !isPoppedout && !isStreamBigDisplay ? `${BOTTOM_PADDING}rem` : 0,
                    boxShadow: 2,
                    border: (theme) => `${theme.factionTheme.primary}60 1px solid`,
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
                        spacing="1rem"
                        direction="row"
                        alignItems="center"
                        sx={{
                            p: ".6rem 1.6rem",
                            height: `${TOP_BAR_HEIGHT}rem`,
                            background: (theme) => `linear-gradient(${theme.factionTheme.background} 26%, ${theme.factionTheme.background}BB)`,
                            zIndex: 99,
                        }}
                    >
                        {!isPoppedout && (
                            <>
                                <Box onClick={() => setIsStreamBigDisplay((prev) => !prev)} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                                    <SvgSwap size="1.6rem" />
                                </Box>

                                <Box onClick={() => setIsPoppedout(true)} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                                    <SvgExternalLink size="1.6rem" />
                                </Box>
                            </>
                        )}

                        {(!isStreamBigDisplay || isPoppedout) && (
                            <Box onClick={() => toggleIsEnlarged()} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                                {isEnlarged ? <SvgMinimize size="1.6rem" /> : <SvgFullscreen size="1.6rem" />}
                            </Box>
                        )}

                        <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>
                            {map.name
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .toUpperCase()}
                        </Typography>
                    </Stack>

                    <MiniMapInside containerDimensions={{ width: sizes.insideWidth, height: sizes.insideHeight }} />

                    <TargetHint />

                    <HighlightedMechAbilities />
                </Box>

                {/* Not scaled map background image, for background only */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
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
    }, [
        isEnlarged,
        handleHotKey,
        sizes.outsideWidth,
        sizes.outsideHeight,
        sizes.insideWidth,
        sizes.insideHeight,
        map.name,
        map?.image_url,
        isPoppedout,
        isStreamBigDisplay,
        setIsStreamBigDisplay,
        setIsPoppedout,
        toggleIsEnlarged,
    ])
}
