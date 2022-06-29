import { Box, Stack, Typography } from "@mui/material"
import { Dispatch, SetStateAction, useCallback, useRef } from "react"
import { FancyButton } from ".."
import { SvgPlay, TrailerThumbPNG } from "../../assets"
import { TRAILER_VIDEO } from "../../constants"
import { useToggle } from "../../hooks"
import { colors, siteZIndex } from "../../theme/theme"

export const Trailer = ({ watchedTrailer, setWatchedTrailer }: { watchedTrailer: boolean; setWatchedTrailer: Dispatch<SetStateAction<boolean>> }) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, toggleIsPlaying] = useToggle()

    const onEnded = useCallback(() => {
        setWatchedTrailer(true)
        if (!watchedTrailer) localStorage.setItem("watchedTrailer", "true")
    }, [setWatchedTrailer, watchedTrailer])

    return (
        <Box sx={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}>
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
                    zIndex: siteZIndex.Trailer,
                }}
            >
                {!isPlaying ? (
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
                            spacing=".96rem"
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                px: "2.08rem",
                                py: ".8rem",
                                borderRadius: 1,
                                backgroundColor: colors.darkerNeonBlue,
                                boxShadow: 10,
                            }}
                        >
                            <SvgPlay size="1.9rem" />
                            <Typography variant="h6" sx={{ lineHeight: 2, fontWeight: "fontWeightBold" }}>
                                WATCH TRAILER TO ENTER
                            </Typography>
                        </Stack>
                    </Box>
                ) : (
                    <FancyButton
                        clipThingsProps={{
                            clipSize: "9px",
                            backgroundColor: "#222222",
                            opacity: 0.8,
                            border: { isFancy: true, borderColor: colors.offWhite, borderThickness: "1px" },
                            sx: { position: "absolute", bottom: "3rem", right: "3rem", zIndex: 9 },
                        }}
                        sx={{ px: "1.6rem", py: ".3rem", color: colors.offWhite }}
                        onClick={onEnded}
                    >
                        <Typography variant="body2" sx={{ fontWeight: "fontWeightBold", color: colors.offWhite }}>
                            SKIP
                        </Typography>
                    </FancyButton>
                )}

                <video
                    ref={videoRef}
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
