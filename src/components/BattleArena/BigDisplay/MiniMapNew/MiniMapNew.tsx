import { Box, Fade, Stack, Typography } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { BattleBgWebP, SvgGrid, SvgSwap } from "../../../../assets"
import { useDimension, useGame, useMiniMapPixi, useUI } from "../../../../containers"
import { fonts } from "../../../../theme/theme"
import { AnyAbility, BattleState, Map } from "../../../../types"
import { WindowPortal } from "../../../Common/WindowPortal/WindowPortal"
import { useWindowPortal } from "../../../Common/WindowPortal/WindowPortalContainer"
import { LEFT_DRAWER_WIDTH } from "../../../LeftDrawer/LeftDrawer"
import { MiniMapPixi } from "./MiniMapPixi/MiniMapPixi"

export const TOP_BAR_HEIGHT = 4.5 // rems
const BOTTOM_PADDING = 12 // rems

export const MiniMapNew = () => {
    const { smallDisplayRef, bigDisplayRef, isStreamBigDisplay } = useUI()
    const { map, battleState } = useGame()
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
        if (battleState === BattleState.BattlingState && map) {
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
    }, [battleState, isPoppedout, map])

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
    const { remToPxRatio } = useDimension()
    const { onAnyAbilityUseCallbacks, handleMiniMapHotKey } = useMiniMapPixi()
    const { isStreamBigDisplay, setIsStreamBigDisplay, toggleIsStreamBigDisplayMemorized, restoreIsStreamBigDisplayMemorized, stopMapRender } = useUI()

    const mapHeightWidthRatio = useRef(1)

    // When it's targeting, enlarge to big display, else restore to the prev location
    useEffect(() => {
        onAnyAbilityUseCallbacks.current["mini-map-new"] = (aa: AnyAbility | undefined) => {
            if (aa) {
                toggleIsStreamBigDisplayMemorized(false)
            } else {
                setTimeout(() => {
                    restoreIsStreamBigDisplayMemorized()
                }, 3000)
            }
        }
    }, [onAnyAbilityUseCallbacks, restoreIsStreamBigDisplayMemorized, toggleIsStreamBigDisplayMemorized])

    // Set sizes
    const sizes = useMemo(() => {
        // Step 1: set width and height of overall container
        mapHeightWidthRatio.current = map.Height / map.Width

        let defaultWidth = width
        let defaultHeight = 0
        if (isPoppedout || !isStreamBigDisplay) {
            defaultHeight = height - TOP_BAR_HEIGHT * remToPxRatio
        } else {
            defaultWidth = LEFT_DRAWER_WIDTH * remToPxRatio
            defaultHeight = defaultWidth * mapHeightWidthRatio.current
        }

        // Step 2: minus any padding and stuff, and calculate inside dimensions to keep a good ratio
        let verticalPadding = 0
        if (!isPoppedout && !isStreamBigDisplay) verticalPadding += BOTTOM_PADDING * remToPxRatio

        const outsideWidth = defaultWidth
        let outsideHeight = defaultHeight - verticalPadding
        const insideWidth = outsideWidth
        const insideHeight = outsideHeight

        outsideHeight += TOP_BAR_HEIGHT * remToPxRatio

        return {
            outsideWidth,
            outsideHeight,
            insideWidth,
            insideHeight,
        }
    }, [map.Height, map.Width, width, height, remToPxRatio, isStreamBigDisplay, isPoppedout])

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
                    overscrollBehavior: "contain",
                    overflowX: "hidden",
                    overflowY: "auto",
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
                            background: (theme) => theme.factionTheme.background,
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

                        <Box id="minimap-show-grid-button" sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                            <SvgGrid size="1.6rem" />
                        </Box>

                        <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>{map.Name}</Typography>
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
        map.Name,
        map?.Background_Url,
        map?.Image_Url,
        poppedOutContainerRef,
        setIsStreamBigDisplay,
    ])
}
