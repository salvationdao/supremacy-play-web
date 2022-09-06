import { IconButton, Slider, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import screenfull from "screenfull"
import { SvgFullscreen, SvgMinimize, SvgMusic, SvgMusicMute, SvgVolume, SvgVolumeMute } from "../../assets"
import { DEV_ONLY } from "../../constants"
import { useMobile } from "../../containers"
import { useOvenStream } from "../../containers/oven"
import { siteZIndex } from "../../theme/theme"

export const VideoPlayerControls = () => {
    const { isMobile, isMobileHorizontal } = useMobile()
    const { toggleIsMute, isMute, toggleIsMusicMute, isMusicMute, musicVolume, setMusicVolume, volume, setVolume } = useOvenStream()
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

    const toggleFullscreen = useCallback(
        (newValue?: boolean) => {
            try {
                // If unsupported, then just fullscreen the video
                if (!screenfull.isEnabled) {
                    const elem = document.getElementById("battle-arena-all")
                    const videoElems = elem?.getElementsByTagName("video")
                    const videoElem = videoElems && videoElems.length > 0 ? videoElems[0] : undefined

                    // Mobile safari edge case, it doesnt support fullscreen API
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (videoElem && (videoElem as any).webkitEnterFullscreen) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ;(videoElem as any).webkitEnterFullscreen()
                        setFullscreen(false)
                    }
                    return
                }

                if (screenfull.isFullscreen || newValue === false) {
                    const elem = document.getElementById("battle-arena-all")
                    if (isMobile && elem) {
                        elem.style.position = ""
                        elem.style.top = ""
                        elem.style.left = ""
                        elem.style.zIndex = ""
                    }

                    screenfull.exit().then(() => setFullscreen(false))
                } else {
                    if (isMobile) {
                        const elem = document.getElementById("battle-arena-all")
                        if (elem) {
                            elem.style.position = "fixed"
                            elem.style.top = "0"
                            elem.style.left = "0"
                            elem.style.zIndex = `${siteZIndex.Bar + 10}`
                            screenfull.request(elem, { navigationUI: "hide" }).then(() => setFullscreen(screenfull.isFullscreen))
                        }
                    } else {
                        screenfull.request().then(() => setFullscreen(screenfull.isFullscreen))
                    }
                }
            } catch (err) {
                console.error(err)
            }
        },
        [isMobile],
    )

    useEffect(() => {
        if (isMobile) toggleFullscreen(isMobileHorizontal)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobileHorizontal])

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

            {(!isMobile || isMobileHorizontal) && (
                <IconButton size="small" onClick={() => toggleFullscreen()} sx={{ opacity: 0.5, transition: "all .2s", ":hover": { opacity: 1 } }}>
                    {fullscreen ? <SvgMinimize size="1.4rem" /> : <SvgFullscreen size="1.4rem" />}
                </IconButton>
            )}
        </Stack>
    )
}
