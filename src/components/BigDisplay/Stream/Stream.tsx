import { Box, Stack, Typography } from "@mui/material"
import { useEffect, useRef } from "react"
import { SvgFullscreen, SvgMinimize, SvgSwap } from "../../../assets"
import { useDimension, useGame, useUI } from "../../../containers"
import { useOvenStream } from "../../../containers/oven"
import { fonts, siteZIndex } from "../../../theme/theme"
import { LEFT_DRAWER_WIDTH } from "../../LeftDrawer/LeftDrawer"
import { TOP_BAR_HEIGHT } from "../MiniMap/MiniMap"
import { NoStreamScreen } from "./NoStreamScreen"
import { OvenplayerStream } from "./OvenPlayerStream"
import { Trailer } from "./Trailer"

export const Stream = () => {
    const { remToPxRatio } = useDimension()
    const { isStreamBigDisplay, setIsStreamBigDisplay } = useGame()
    const { isEnlarged, toggleIsEnlarged } = useOvenStream()
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const thisElement = ref.current
        const newContainerElement = document.getElementById(!isStreamBigDisplay ? "left-drawer-space" : "big-display-space")

        if (thisElement && newContainerElement) {
            let child = newContainerElement.lastElementChild
            while (child) {
                newContainerElement.removeChild(child)
                child = newContainerElement.lastElementChild
            }

            newContainerElement.appendChild(thisElement)
        }
    }, [isStreamBigDisplay])

    return (
        <Stack
            ref={ref}
            sx={{
                width: "100%",
                height: isStreamBigDisplay ? "100%" : (LEFT_DRAWER_WIDTH * remToPxRatio) / (16 / 9) + TOP_BAR_HEIGHT * remToPxRatio,
                boxShadow: 2,
                border: (theme) => `${theme.factionTheme.primary}60 1px solid`,
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
                }}
            >
                <Box onClick={() => setIsStreamBigDisplay((prev) => !prev)} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                    <SvgSwap size="1.6rem" />
                </Box>

                {isStreamBigDisplay && (
                    <Box onClick={() => toggleIsEnlarged()} sx={{ cursor: "pointer", opacity: 0.4, ":hover": { opacity: 1 } }}>
                        {isEnlarged ? <SvgMinimize size="1.6rem" /> : <SvgFullscreen size="1.6rem" />}
                    </Box>
                )}

                <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>BATTLE LIVE STREAM</Typography>
            </Stack>

            <Box sx={{ flex: 1 }}>
                <StreamInner />
            </Box>
        </Stack>
    )
}

export const StreamInner = () => {
    const { showTrailer } = useUI()
    const { currentOvenStream } = useOvenStream()
    const isGreenScreen = useRef(localStorage.getItem("greenScreen") === "true")

    if (showTrailer) {
        return <Trailer />
    }

    if (isGreenScreen.current) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    backgroundColor: "green",
                    zIndex: siteZIndex.Stream + 1,
                }}
            />
        )
    }

    if (!currentOvenStream?.isBlank) {
        return <OvenplayerStream />
    }

    return <NoStreamScreen />
}
