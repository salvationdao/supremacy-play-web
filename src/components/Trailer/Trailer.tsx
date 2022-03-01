import { Box, Stack, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { SvgPlay, TrailerThumbPNG } from "../../assets"
import { TRAILER_VIDEO } from "../../constants"
import { colors } from "../../theme/theme"
import { useToggle } from "../GameBar/hooks"

export const Trailer = () => {
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, toggleIsPlaying] = useToggle()

    if (watchedTrailer) return null

    return (
        <Stack
            onClick={() => {
                videoRef.current && videoRef.current.play()
            }}
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
                zIndex: 99999999,
            }}
        >
            {!isPlaying && (
                <Box
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
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1.2}
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            px: 2.6,
                            py: 1,
                            borderRadius: 1,
                            backgroundColor: colors.darkerNeonBlue,
                            boxShadow: 10,
                        }}
                    >
                        <SvgPlay size="19px" />
                        <Typography variant="h6" sx={{ lineHeight: 2, fontWeight: "fontWeightBold" }}>
                            WATCH TRAILER TO ENTER
                        </Typography>
                    </Stack>
                </Box>
            )}

            <video
                ref={videoRef}
                disablePictureInPicture
                disableRemotePlayback
                playsInline
                controlsList="nodownload"
                onPlay={() => toggleIsPlaying(true)}
                onEnded={() => {
                    setWatchedTrailer(true)
                    if (!watchedTrailer) localStorage.setItem("watchedTrailer", "true")
                }}
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
    )
}
