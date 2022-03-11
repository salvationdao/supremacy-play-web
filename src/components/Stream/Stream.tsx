import { Box, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useGameServerAuth, useDimension, useStream, useWallet } from "../../containers"
import { colors } from "../../theme/theme"
import { Trailer } from ".."
import { useToggle } from "../../hooks"

const Message = ({ render, haveSups, toggleHaveSups }: { render: boolean; haveSups: boolean; toggleHaveSups: any }) => {
    const { user } = useGameServerAuth()
    const { onWorldSups } = useWallet()

    const supsAboveZero = onWorldSups ? onWorldSups.isGreaterThan(0) : false

    // Doing it here prevents index.tsx from re-rendering continuously from sup ticks
    useEffect(() => {
        if (supsAboveZero && !haveSups) toggleHaveSups(true)
        if (!supsAboveZero && haveSups) toggleHaveSups(false)
    }, [onWorldSups, supsAboveZero, haveSups])

    let message = "You must connect your passport to view the battle stream."
    if (user && user.faction && !haveSups) {
        message = "You must have SUPS in order to view the battle stream."
    } else if (user && !user.faction) {
        message = "You must enlist in a faction to view the battle stream."
    }

    return (
        <Fade in={render}>
            <Stack sx={{ flex: 1, width: "100%" }}>
                <Box sx={{ px: 2, py: 0.5, backgroundColor: colors.red, boxShadow: 6, zIndex: 99 }}>
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                        {message}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            boxShadow: "inset 0 0 1000px #000000",
                            pointerEvents: "none",
                        }}
                    />

                    <iframe
                        src="https://stats.supremacy.game/#/"
                        style={{
                            width: "100%",
                            height: "100%",
                            border: 0,
                        }}
                    ></iframe>
                </Box>
            </Stack>
        </Fade>
    )
}

export const Stream = ({ haveSups, toggleHaveSups }: { haveSups: boolean; toggleHaveSups: any }) => {
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
    const { user } = useGameServerAuth()
    const { iframeDimensions } = useDimension()
    const { currentStream, isMute, vidRefCallback } = useStream()
    const [renderTopMessage, toggleRenderTopMessage] = useToggle()

    // Don't show for couple seconds as it tries to do the auto login
    useEffect(() => {
        setTimeout(() => {
            toggleRenderTopMessage(true)
        }, GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS + 2000)
    })

    if (!watchedTrailer) {
        return <Trailer watchedTrailer={watchedTrailer} setWatchedTrailer={setWatchedTrailer} />
    }
    return (
        <Stack sx={{ width: "100%", height: "100%" }}>
            {user && user.faction_id && haveSups ? (
                <video
                    key={currentStream?.stream_id}
                    id={"remoteVideo"}
                    muted={isMute}
                    ref={vidRefCallback}
                    autoPlay
                    controls={false}
                    playsInline
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        aspectRatio: STREAM_ASPECT_RATIO_W_H.toString(),
                        width: iframeDimensions.width,
                        height: iframeDimensions.height,
                    }}
                />
            ) : (
                <Message render={renderTopMessage} haveSups={haveSups} toggleHaveSups={toggleHaveSups} />
            )}
        </Stack>
    )
}
