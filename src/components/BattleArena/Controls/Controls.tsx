import { Box, Stack } from "@mui/material"
import { useMemo } from "react"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from "../.."
import { useArena, useMobile } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { shadeColor } from "../../../helpers"
import { siteZIndex } from "../../../theme/theme"
import { VoiceChat } from "../../RightDrawer/VoiceChat/VoiceChat"
import { OvenResolutionSelect } from "./ResolutionSelect"
import { OvenStreamSelect } from "./StreamSelect"

export const CONTROLS_HEIGHT = 3.0 // rem

export const Controls = () => {
    const { isMobile } = useMobile()
    const { currentArenaID } = useArena()

    const theme = useTheme()

    const darkerBackgroundColor = useMemo(() => shadeColor(theme.factionTheme.primary, -91), [theme.factionTheme.primary])

    return (
        <Stack
            direction="row"
            alignItems="stretch"
            justifyContent="flex-start"
            spacing="1.6rem"
            sx={{
                flexShrink: 0,
                position: "relative",
                width: "100%",
                height: `${CONTROLS_HEIGHT}rem`,
                px: "1rem",
                pt: ".24rem",
                pb: ".16rem",
                background: `linear-gradient(${darkerBackgroundColor} 26%, ${theme.factionTheme.background})`,
                borderTop: `${theme.factionTheme.s700} 1px solid`,
                zIndex: siteZIndex.Controls,
                overflowX: "auto",
                overflowY: "hidden",
            }}
        >
            <LiveCounts />
            {!isMobile && <OverlayToggles />}

            <Box flex={1} />

            {currentArenaID && <VoiceChat />}
            <OvenStreamSelect />
            <OvenResolutionSelect />
            <VideoPlayerControls />
        </Stack>
    )
}
