import { Stack } from "@mui/material"
import { useMemo } from "react"
import { LiveCounts, OverlayToggles, VideoPlayerControls } from ".."
import { useMobile } from "../../containers"
import { useTheme } from "../../containers/theme"
import { shadeColor } from "../../helpers"
import { siteZIndex } from "../../theme/theme"
import { ResolutionSelect } from "./ResolutionSelect"
import { ShowTrailerButton } from "./ShowTrailerButton"
import { StreamSelect } from "./StreamSelect"

export const CONTROLS_HEIGHT = 3.0 // rem

export const Controls = () => {
    const { isMobile } = useMobile()
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
                    height: ".4rem",
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

            <Stack direction="row" spacing="1.6rem" sx={{ flexShrink: 0, height: "100%" }}>
                <ShowTrailerButton />
                <StreamSelect />
                <ResolutionSelect />
                <VideoPlayerControls />
            </Stack>
        </Stack>
    )
}
