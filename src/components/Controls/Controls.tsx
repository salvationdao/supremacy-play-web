import { Stack } from "@mui/material"
import { useMemo } from "react"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { useArena, useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { shadeColor } from "../../helpers"
import { siteZIndex } from "../../theme/theme"
import { OvenResolutionSelect } from "./ResolutionSelect"
import { VoiceChat } from "../RightDrawer/VoiceChat/VoiceChat"
import { OvenStreamSelect } from "./StreamSelect"
import { DEV_ONLY } from "../../constants"

export const CONTROLS_HEIGHT = 3.0 // rem

export const Controls = () => {
    const { isMobile } = useMobile()
    const { currentArenaID } = useArena()

    const theme = useTheme()

    const darkerBackgroundColor = useMemo(() => shadeColor(theme.factionTheme.primary, -91), [theme.factionTheme.primary])

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing="1.6rem"
            sx={{
                flexShrink: 0,
                position: "relative",
                width: "100%",
                height: `${CONTROLS_HEIGHT}rem`,
                px: "1rem",
                pt: ".24rem",
                pb: ".16rem",
                background: (theme) => `linear-gradient(${darkerBackgroundColor} 26%, ${theme.factionTheme.background})`,
                zIndex: siteZIndex.Controls,
                overflowX: "auto",
                overflowY: "hidden",

                "::-webkit-scrollbar": {
                    height: ".6rem",
                },
                "::-webkit-scrollbar-track": {
                    background: "#FFFFFF15",
                    borderRadius: 0,
                },
                "::-webkit-scrollbar-thumb": {
                    background: (theme) => `${theme.factionTheme.primary}50`,
                    borderRadius: 0,
                },
            }}
        >
            <Stack direction="row" spacing="1.6rem" sx={{ flexShrink: 0, height: "100%" }}>
                <LiveCounts />
                {!isMobile && <OverlayToggles />}
            </Stack>

            <Stack direction="row" spacing="1.2rem" sx={{ flexShrink: 0, height: "100%" }}>
                {DEV_ONLY && currentArenaID && <VoiceChat />}
                <OvenStreamSelect />
                <OvenResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
