import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useRef } from "react"
import { TrailerThumbPNG } from "../../../../assets"
import { TRAILER_VIDEO } from "../../../../constants"
import { useUI } from "../../../../containers"
import { useOvenStream } from "../../../../containers/oven"
import { useToggle } from "../../../../hooks"
import { fonts, siteZIndex } from "../../../../theme/theme"
import { NiceButton } from "../../../Common/Nice/NiceButton"

export const Trailer = () => {
    const { toggleShowTrailer } = useUI()
    const vidRef = useRef<HTMLVideoElement>(null)
    const { isMute, volume } = useOvenStream()
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
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
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
                    <NiceButton
                        buttonColor="#FFFFFF"
                        sx={{ position: "absolute", bottom: "3rem", right: "3rem", px: "1.6rem", py: ".3rem", zIndex: 9 }}
                        onClick={onEnded}
                    >
                        <Typography variant="body2" sx={{ fontFamily: fonts.nostromoBlack }}>
                            CLOSE
                        </Typography>
                    </NiceButton>
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
