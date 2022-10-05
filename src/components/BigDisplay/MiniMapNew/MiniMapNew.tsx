import { Box, Fade, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { BattleBgWebP, SvgFullscreen, SvgGrid, SvgMinimize, SvgSwap } from "../../../assets"
import { useDimension, useGame, useMiniMapPixi, useUI, WinnerStruct } from "../../../containers"
import { useHotkey } from "../../../containers/hotkeys"
import { useToggle } from "../../../hooks"
import { fonts } from "../../../theme/theme"
import { Map, PlayerAbility } from "../../../types"
import { WindowPortal } from "../../Common/WindowPortal/WindowPortal"
import { useWindowPortal } from "../../Common/WindowPortal/WindowPortalContainer"
import { LEFT_DRAWER_WIDTH } from "../../LeftDrawer/LeftDrawer"
import { MiniMapPixi } from "./MiniMapPixi"

export const TOP_BAR_HEIGHT = 3.4 // rems
const PADDING = 6 // rems
const BOTTOM_PADDING = 11.5 // rems

export const MiniMapNew = () => {
    const { smallDisplayRef, bigDisplayRef, isStreamBigDisplay } = useUI()
    const { map, isBattleStarted } = useGame()
    const [isPoppedout, setIsPoppedout] = useState(false)
    const [ref, setRef] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!ref) return

        const thisElement = ref
        const newContainerElement = isStreamBigDisplay ? smallDisplayRef : bigDisplayRef

        if (!isPoppedout && thisElement && newContainerElement) {
            let child = newContainerElement.lastElementChild
            while (child) {
                newContainerElement.removeChild(child)
                child = newContainerElement.lastElementChild
            }

            newContainerElement.appendChild(thisElement)
        }
    }, [ref, isStreamBigDisplay, isPoppedout, smallDisplayRef, bigDisplayRef])

    const content = useMemo(() => {
        if (isBattleStarted && map) {
            if (isPoppedout) {
                return (
                    <WindowPortal title="Supremacy - Battle Arena" onClose={() => setIsPoppedout(false)} features={{ width: 600, height: 600 }}>
                        <MiniMapInnerPoppedOut map={map} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
                    </WindowPortal>
                )
            }

            return <MiniMapInnerNormal map={map} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} />
        }

        return <BattleNotStarted />
    }, [isBattleStarted, isPoppedout, map])

    return (
        <Box ref={setRef} sx={{ width: "100%", height: "100%" }}>
            {content}
        </Box>
    )
}

const BattleNotStarted = React.memo(function BattleNotStarted() {
    const { isStreamBigDisplay } = useUI()

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "relative",
                width: "100%",
                height: isStreamBigDisplay ? "28rem" : "100%",
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
    )
})

interface MiniMapInnerProps {
    map: Map
    isPoppedout: boolean
    setIsPoppedout: React.Dispatch<React.SetStateAction<boolean>>
    width?: number
    height?: number
    poppedOutContainerRef?: React.MutableRefObject<HTMLElement | null>
}

const MiniMapInnerPoppedOut = ({ map, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const { containerRef, curWidth, curHeight } = useWindowPortal()
    if (!curWidth || !curHeight) return null
    return (
        <Box sx={{ width: "100%", height: "100%", border: (theme) => `${theme.factionTheme.primary} 1.5px solid` }}>
            <MiniMapInner
                poppedOutContainerRef={containerRef}
                map={map}
                isPoppedout={isPoppedout}
                setIsPoppedout={setIsPoppedout}
                width={curWidth}
                height={curHeight}
            />
        </Box>
    )
}

const MiniMapInnerNormal = ({ map, isPoppedout, setIsPoppedout }: MiniMapInnerProps) => {
    const {
        gameUIDimensions: { width, height },
    } = useDimension()
    if (!width || !height) return null
    return <MiniMapInner map={map} isPoppedout={isPoppedout} setIsPoppedout={setIsPoppedout} width={width} height={height} />
}

// This inner component takes care of the resizing etc.
const MiniMapInner = ({ map, isPoppedout, width = 100, height = 100, poppedOutContainerRef }: MiniMapInnerProps) => {
    const { handleMiniMapHotKey } = useHotkey()
    const { remToPxRatio } = useDimension()
    const { onAbilityUseCallbacks } = useMiniMapPixi()
    const { isStreamBigDisplay, setIsStreamBigDisplay, toggleIsStreamBigDisplayMemorized, restoreIsStreamBigDisplayMemorized, stopMapRender } = useUI()
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
        onAbilityUseCallbacks.current["mini-map-new"] = (wn: WinnerStruct | undefined, pa: PlayerAbility | undefined) => {
            if (wn || pa) {
                toggleIsStreamBigDisplayMemorized(false)
            } else {
                setTimeout(() => {
                    restoreIsStreamBigDisplayMemorized()
                }, 3000)
            }
        }
    }, [onAbilityUseCallbacks, restoreIsStreamBigDisplayMemorized, toggleIsStreamBigDisplayMemorized])

    // Set sizes
    const sizes = useMemo(() => {
        // Step 1: set width and height of overall container
        mapHeightWidthRatio.current = map.Height / map.Width

        let defaultWidth = width
        let defaultHeight = 0
        if (isPoppedout || !isStreamBigDisplay) {
            defaultHeight = Math.min(defaultWidth * mapHeightWidthRatio.current, height)
        } else {
            defaultWidth = LEFT_DRAWER_WIDTH * remToPxRatio
            defaultHeight = defaultWidth * mapHeightWidthRatio.current
        }

        if (isEnlarged) defaultHeight = height - TOP_BAR_HEIGHT * remToPxRatio

        // Step 2: minus any padding and stuff, and calculate inside dimensions to keep a good ratio
        const padding = (isPoppedout || !isStreamBigDisplay) && !isEnlarged ? PADDING * remToPxRatio : 0
        let verticalPadding = padding
        if (!isPoppedout && !isStreamBigDisplay) verticalPadding += BOTTOM_PADDING * remToPxRatio

        let outsideWidth = defaultWidth - padding
        let outsideHeight = defaultHeight - verticalPadding
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

    return useMemo(() => {
        if (stopMapRender) {
            return null
        }

        return (
            <Stack
                id="mini-map"
                alignItems="center"
                justifyContent="center"
                tabIndex={0}
                onKeyDown={handleMiniMapHotKey}
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    pb: !isPoppedout && !isStreamBigDisplay ? `${BOTTOM_PADDING}rem` : 0,
                    boxShadow: 2,
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        width: sizes.outsideWidth,
                        height: sizes.outsideHeight,
                        pointerEvents: "all",
                        transition: "width .2s, height .2s",
                        overflow: "hidden",
                        boxShadow: 1,
                        zIndex: 2,
                    }}
                >
                    {/* Top bar with toggles like enlarge, popout, switch etc. */}
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

                                {/* <Box
                                    onClick={() => {
                                        setIsPoppedout(true)
                                        setIsStreamBigDisplay(true)
                                    }}
                                    sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}
                                >
                                    <SvgExternalLink size="1.6rem" />
                                </Box> */}
                            </>
                        )}

                        {(!isStreamBigDisplay || isPoppedout) && (
                            <Box onClick={() => toggleIsEnlarged()} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                                {isEnlarged ? <SvgMinimize size="1.6rem" /> : <SvgFullscreen size="1.6rem" />}
                            </Box>
                        )}

                        <Box id="minimap-show-grid-button" sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                            <SvgGrid size="1.6rem" />
                        </Box>

                        <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>
                            {map.Name.replace(/([A-Z])/g, " $1")
                                .trim()
                                .toUpperCase()}
                        </Typography>
                    </Stack>

                    <MiniMapPixi containerDimensions={{ width: sizes.insideWidth, height: sizes.insideHeight }} poppedOutContainerRef={poppedOutContainerRef} />
                </Box>

                {/* Not scaled map background image, for background only */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: `url(${map?.Background_Url || map?.Image_Url})`,
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
        stopMapRender,
        handleMiniMapHotKey,
        isPoppedout,
        isStreamBigDisplay,
        sizes.outsideWidth,
        sizes.outsideHeight,
        sizes.insideWidth,
        sizes.insideHeight,
        isEnlarged,
        map.Name,
        map?.Background_Url,
        map?.Image_Url,
        poppedOutContainerRef,
        setIsStreamBigDisplay,
        toggleIsEnlarged,
    ])
}
