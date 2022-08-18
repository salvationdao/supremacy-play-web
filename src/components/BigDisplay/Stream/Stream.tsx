import { Box, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { SvgSwap } from "../../../assets"
import { useDimension, useGame, useOverlayToggles, useStream } from "../../../containers"
import { fonts, siteZIndex } from "../../../theme/theme"
import { StreamService } from "../../../types"
import { LEFT_DRAWER_WIDTH } from "../../LeftDrawer/LeftDrawer"
import { TOP_BAR_HEIGHT } from "../MiniMap/MiniMap"
import { AntMediaStream } from "./AntMediaStream"
import { NoStreamScreen } from "./NoStreamScreen"
import { OvenplayerStream } from "./OvenPlayerStream"
import { SLPDStream } from "./SLPDStream"
import { Trailer } from "./Trailer"

export const Stream = () => {
    const { remToPxRatio } = useDimension()
    const { isStreamBigDisplay, setIsStreamBigDisplay } = useGame()

    useEffect(() => {
        const thisElement = document.getElementById("bid-display-stream")
        const newContainerElement = document.getElementById(!isStreamBigDisplay ? "left-drawer-space" : "big-display-space")

        if (thisElement && newContainerElement) {
            newContainerElement.appendChild(thisElement)
        }
    }, [isStreamBigDisplay])

    return (
        <Stack
            id="bid-display-stream"
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

                <Typography sx={{ fontFamily: fonts.nostromoHeavy }}>BATTLE LIVE STREAM</Typography>
            </Stack>

            <Box sx={{ flex: 1 }}>
                <StreamInner />
            </Box>
        </Stack>
    )
}

export const StreamInner = () => {
    const { showTrailer } = useOverlayToggles()
    const { currentStream } = useStream()

    const isGreenScreen = localStorage.getItem("greenScreen") === "true"

    if (showTrailer) {
        return <Trailer />
    }

    if (isGreenScreen) {
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

    if (currentStream?.service === StreamService.OvenMediaEngine) {
        return <OvenplayerStream />
    }

    if (currentStream?.service === StreamService.Softvelum) {
        return <SLPDStream />
    }

    if (currentStream?.service === StreamService.AntMedia) {
        return <AntMediaStream />
    }

    return <NoStreamScreen />
}
