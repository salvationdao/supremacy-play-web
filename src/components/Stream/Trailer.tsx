import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { FancyButton } from ".."
import { TrailerThumbPNG } from "../../assets"
import { TRAILER_VIDEO } from "../../constants"
import { useOverlayToggles, useStream } from "../../containers"
import { useToggle } from "../../hooks"
import { siteZIndex } from "../../theme/theme"

export const Trailer = () => {
    const { showTrailer } = useOverlayToggles()

    if (!showTrailer) return null

    return <TrailerInner />
}

const TrailerInner = () => {
    const { toggleShowTrailer } = useOverlayToggles()
    const vidRef = useRef<HTMLVideoElement>(null)
    const { isMute, volume } = useStream()
    const [isPlaying, toggleIsPlaying] = useToggle()

    const onEnded = useCallback(() => {
        toggleShowTrailer(false)
    }, [toggleShowTrailer])

    const onPlayClick = useCallback(() => {
        vidRef.current && vidRef.current.play()
    }, [])

    useEffect(() => {
        if (volume <= 0) return
        if (vidRef && vidRef.current) vidRef.current.volume = volume
    }, [volume])

    useEffect(() => {
        if (vidRef && vidRef.current) vidRef.current.muted = isMute
    }, [isMute])

    return (
        <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}>
            <Stack
                onClick={onPlayClick}
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    cursor: isPlaying ? "auto" : "pointer",
                    backgroundColor: "#000000",
                    "video::-internal-media-controls-overlay-cast-button": {
                        display: "none",
                    },
                    zIndex: siteZIndex.Trailer,
                }}
            >
                {!isPlaying ? (
                    <Box
                        onClick={onPlayClick}
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundImage: `url(${TrailerThumbPNG})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            zIndex: 2,
                        }}
                    />
                ) : (
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: "#222222",
                            opacity: 0.8,
                            border: { borderColor: "#FFFFFF", borderThickness: "1px" },
                            sx: { position: "absolute", bottom: "3rem", right: "3rem", zIndex: 9 },
                        }}
                        sx={{ px: "1.6rem", py: ".3rem", color: "#FFFFFF" }}
                        onClick={onEnded}
                    >
                        <Typography variant="body2" sx={{ fontWeight: "fontWeightBold", color: "#FFFFFF" }}>
                            CLOSE
                        </Typography>
                    </FancyButton>
                )}

                <video
                    ref={vidRef}
                    disablePictureInPicture
                    disableRemotePlayback
                    playsInline
                    controlsList="nodownload"
                    onPlay={() => toggleIsPlaying(true)}
                    onEnded={onEnded}
                    style={{
                        height: "100%",
                        width: "100%",
                    }}
                    controls={false}
                    autoPlay
                >
                    <source src={TRAILER_VIDEO} type="video/mp4" />
                </video>
            </Stack>
        </Box>
    )
}
