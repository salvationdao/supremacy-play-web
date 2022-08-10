import { IconButton, Slider, Stack } from "@mui/material"
import { useCallback, useState } from "react"
import { SvgFullscreen, SvgMinimize, SvgMusic, SvgMusicMute, SvgVolume, SvgVolumeMute } from "../../assets"
import { DEV_ONLY } from "../../constants"
import { useMobile, useStream } from "../../containers"

export const VideoPlayerControls = () => {
    const { isMobile } = useMobile()
    const { toggleIsMute, isMute, toggleIsMusicMute, isMusicMute, musicVolume, setMusicVolume, volume, setVolume } = useStream()
    const [fullscreen, setFullscreen] = useState(false)

    const handleVolumeChange = useCallback(
        (_: Event, newValue: number | number[]) => {
            setVolume(newValue as number)
        },
        [setVolume],
    )

    const handleMusicVolumeChange = useCallback(
        (_: Event, newValue: number | number[]) => {
            setMusicVolume(newValue as number)
        },
        [setMusicVolume],
    )

    const toggleFullscreen = useCallback(() => {
        setFullscreen((prev) => {
            const elem = document.documentElement
            const doc = document

            if (prev) {
                doc.exitFullscreen()
                return false
            } else if (elem.requestFullscreen) {
                elem.requestFullscreen()
                return true
            }

            return prev
        })
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
                            color: (theme) => theme.factionTheme.primary,
                        }}
                    />
                </Stack>

                {DEV_ONLY && (
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
                                color: (theme) => theme.factionTheme.primary,
                            }}
                        />
                    </Stack>
                )}
            </Stack>

            {!isMobile && (
                <IconButton size="small" onClick={() => toggleFullscreen()} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                    {fullscreen ? <SvgMinimize size="1.4rem" /> : <SvgFullscreen size="1.4rem" />}
                </IconButton>
            )}
        </Stack>
    )
}
