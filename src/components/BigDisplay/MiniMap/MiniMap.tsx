import { Box, Fade, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MiniMapInside } from "../.."
import { BattleBgWebP, SvgExternalLink, SvgFullscreen, SvgMinimize, SvgSwap } from "../../../assets"
import { useDimension, useGame, useUI } from "../../../containers"
import { useHotkey } from "../../../containers/hotkeys"
import { useMiniMap } from "../../../containers/minimap"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { Map } from "../../../types"
import { WindowPortal } from "../../Common/WindowPortal/WindowPortal"
import { useWindowPortal } from "../../Common/WindowPortal/WindowPortalContainer"
import { LEFT_DRAWER_WIDTH } from "../../LeftDrawer/LeftDrawer"
import { HighlightedMechAbilities } from "./MapOutsideItems/HighlightedMechAbilities"
import { TargetHint } from "./MapOutsideItems/TargetHint"

export const TOP_BAR_HEIGHT = 3.4 // rems
const PADDING = 6 // rems
const BOTTOM_PADDING = 10.5 // rems

export const MiniMap = () => {
    const { smallDisplayRef, bigDisplayRef, isStreamBigDisplay } = useUI()
    const { map, isBattleStarted } = useGame()
    const { isTargeting } = useMiniMap()
    const [isPoppedout, setIsPoppedout] = useState(false)
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const thisElement = ref.current
        const newContainerElement = isStreamBigDisplay ? smallDisplayRef : bigDisplayRef

        if (!isPoppedout && thisElement && newContainerElement) {
            let child = newContainerElement.lastElementChild
            while (child) {
                newContainerElement.removeChild(child)
                child = newContainerElement.lastElementChild
            }

            newContainerElement.appendChild(thisElement)
        }
    }, [isStreamBigDisplay, isPoppedout, smallDisplayRef, bigDisplayRef])

    const content = useMemo(() => {
        if (isBattleStarted && map) {
            if (isPoppedout) {
                return (
                    <WindowPortal title="Supremacy - Battle Arena" onClose={() => setIsPoppedout(false)} features={{ width: 600, height: 600 }}>
                        <MiniMapInnerPoppedOut map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
                    </WindowPortal>
                )
            }

            return <MiniMapInnerNormal map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
        }

        return <BattleNotStarted />
    }, [isBattleStarted, isPoppedout, isTargeting, map])

    return (
        <Box ref={ref} sx={{ width: "100%", height: "100%" }}>
            {content}
        </Box>
    )
}

interface MiniMapInnerProps {
    map: Map
    isTargeting: boolean
    isPoppedout: boolean
    setIsPoppedout: React.Dispatch<React.SetStateAction<boolean>>
    width?: number
    height?: number
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

const MiniMapInnerPoppedOut = ({ map, isTargeting, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const { containerRef, curWidth, curHeight } = useWindowPortal()
    if (!curWidth || !curHeight) return null
    return (
        <Box sx={{ width: "100%", height: "100%", border: (theme) => `${theme.factionTheme.primary} 1.5px solid` }}>
            <MiniMapInner
                poppedOutContainerRef={containerRef}
                map={map}
                isTargeting={isTargeting}
                isPoppedout={isPoppedout}
                setIsPoppedout={setIsPoppedout}
                width={curWidth}
                height={curHeight}
            />
        </Box>
    )
}

const MiniMapInnerNormal = ({ map, isTargeting, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    if (!width || !height) return null
    return <MiniMapInner map={map} isTargeting={isTargeting} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} width={width} height={height} />
}

const BattleNotStarted = () => {
    const { isStreamBigDisplay } = useUI()

    return useMemo(
        () => (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100%",
                    height: isStreamBigDisplay ? "28rem" : "100%",
                    border: (theme) => `${theme.factionTheme.primary}60 1px solid`,
                }}
            >
                <Typography
                    variant={!isStreamBigDisplay ? "h5" : "h6"}
                    sx={{
                        fontFamily: fonts.nostromoBold,
                        WebkitTextStrokeWidth: !isStreamBigDisplay ? "1px" : "unset",
                        textAlign: "center",
                        zIndex: 2,
                    }}
                >
                    Preparing for next battle...
                </Typography>

                <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, backgroundColor: "#00000050", zIndex: 1 }} />

                {/* Background image */}
                <Fade in>
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            zIndex: 0,
                            background: `url(${BattleBgWebP})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                        }}
                    />
                </Fade>
            </Stack>
        ),
        [isStreamBigDisplay],
    )
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isTargeting, isPoppedout, setIsPoppedout, width = 100, height = 100, poppedOutContainerRef }: MiniMapInnerProps) => {
    const { handleMiniMapHotKey } = useHotkey()
    const { remToPxRatio } = useDimension()
    const { isStreamBigDisplay, setIsStreamBigDisplay, toggleIsStreamBigDisplayMemorized, restoreIsStreamBigDisplayMemorized } = useUI()
    const [isEnlarged, toggleIsEnlarged] = useToggle(localStorage.getItem("isMiniMapEnlarged") === "true")

    const mapHeightWidthRatio = useRef(1)
    const mapRef = useRef<HTMLDivElement>()

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
            toggleIsStreamBigDisplayMemorized(false)
        } else {
            restoreIsStreamBigDisplayMemorized()
        }
    }, [isTargeting, restoreIsStreamBigDisplayMemorized, toggleIsStreamBigDisplayMemorized])

    // Set size
    const sizes = useMemo(() => {
        // Step 1
        mapHeightWidthRatio.current = map.Height / map.Width

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
        const padding = (isPoppedout || !isStreamBigDisplay) && !isEnlarged ? PADDING * remToPxRatio : 0
        let bottomPadding = padding
        if (!isPoppedout && !isStreamBigDisplay) bottomPadding += BOTTOM_PADDING * remToPxRatio

        let outsideWidth = defaultWidth - padding
        let outsideHeight = defaultHeight - bottomPadding
        let insideWidth = outsideWidth
        let insideHeight = outsideHeight

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

        outsideHeight += TOP_BAR_HEIGHT * remToPxRatio

        return {
            outsideWidth,
            outsideHeight,
            insideWidth,
            insideHeight,
        }
    }, [map.Height, map.Width, width, isEnlarged, height, remToPxRatio, isStreamBigDisplay, isPoppedout])

    const focusMap = useCallback(() => mapRef.current?.focus(), [mapRef])

    useEffect(() => {
        focusMap()
    }, [focusMap])

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
                    ref={mapRef}
                    tabIndex={0}
                    onKeyDown={handleMiniMapHotKey}
                    onClick={focusMap}
                    sx={{
                        position: "relative",
                        boxShadow: 1,
                        width: sizes.outsideWidth,
                        height: sizes.outsideHeight,
                        transition: "width .2s, height .2s",
                        overflow: "hidden",
                        pointerEvents: "all",
                        zIndex: 2,
                        boxSizing: "border-box",
                        "&.MuiBox-root": {
                            border: "1px transparent solid",
                            "&:focus": {
                                border: (theme) => `2px solid ${theme.factionTheme.primary}`,
                            },
                            outline: "none",
                        },
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
                            {map.Name.replace(/([A-Z])/g, " $1")
                                .trim()
                                .toUpperCase()}
                        </Typography>
                    </Stack>

                    <MiniMapInside
                        containerDimensions={{ width: sizes.insideWidth, height: sizes.insideHeight }}
                        poppedOutContainerRef={poppedOutContainerRef}
                    />

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
                        background: `url(${map?.Image_Url})`,
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
        handleMiniMapHotKey,
        focusMap,
        sizes.outsideWidth,
        sizes.outsideHeight,
        sizes.insideWidth,
        sizes.insideHeight,
        map.Name,
        map?.Image_Url,
        isPoppedout,
        isStreamBigDisplay,
        setIsStreamBigDisplay,
        setIsPoppedout,
        toggleIsEnlarged,
        poppedOutContainerRef,
    ])
}
