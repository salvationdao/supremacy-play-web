import { IconButton, Slider, Stack } from "@mui/material"
import { useCallback } from "react"
import { SvgFullscreen, SvgMusic, SvgMusicMute, SvgVolume, SvgVolumeMute } from "../../assets"
import { useGameServerAuth, useStream } from "../../containers"
import { colors } from "../../theme/theme"

export const VideoPlayerControls = () => {
    const { user } = useGameServerAuth()
    const { toggleIsMute, isMute, toggleIsMusicMute, isMusicMute, musicVolume, setMusicVolume, volume, setVolume } = useStream()

    const handleVolumeChange = useCallback((_: Event, newValue: number | number[]) => {
        setVolume(newValue as number)
    }, [])

    const handleMusicVolumeChange = useCallback((_: Event, newValue: number | number[]) => {
        setMusicVolume(newValue as number)
    }, [])

    const toggleFullscreen = useCallback(() => {
        const elem = document.documentElement
        const doc = document

        if (window.innerWidth == screen.width && window.innerHeight == screen.height && doc.exitFullscreen) {
            doc.exitFullscreen()
            return
        }
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        }
    }, [])

    return (
        <Stack direction="row" alignItems="center">
            <Stack direction="row">
                <Stack direction="row" alignItems="center" sx={{ width: "15rem", mr: "1.6rem" }}>
                    <IconButton size="small" onClick={() => toggleIsMute()} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                        {isMute || volume <= 0 ? <SvgVolumeMute size="1.4rem" sx={{ pb: 0 }} /> : <SvgVolume size="1.4rem" sx={{ pb: 0 }} />}
                    </IconButton>

                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label="Volume"
                        value={isMute ? 0 : volume}
                        onChange={handleVolumeChange}
                        sx={{
                            ml: "1.2rem",
                            color: user && user.faction ? user.faction.theme.primary : colors.neonBlue,
                        }}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" sx={{ width: "15rem", mr: "1.6rem" }}>
                    <IconButton size="small" onClick={() => toggleIsMusicMute()} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                        {isMusicMute || musicVolume <= 0 ? <SvgMusicMute size="1.2rem" sx={{ pb: 0 }} /> : <SvgMusic size="1.2rem" sx={{ pb: 0 }} />}
                    </IconButton>

                    <Slider
                        size="small"
                        min={0}
                        max={1}
                        step={0.01}
                        aria-label="Volume"
                        value={isMusicMute ? 0 : musicVolume}
                        onChange={handleMusicVolumeChange}
                        sx={{
                            ml: "1.2rem",
                            color: user && user.faction ? user.faction.theme.primary : colors.neonBlue,
                        }}
                    />
                </Stack>
            </Stack>

            <IconButton size="small" onClick={toggleFullscreen} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                <SvgFullscreen size="1.4rem" />
            </IconButton>
        </Stack>
    )
}
