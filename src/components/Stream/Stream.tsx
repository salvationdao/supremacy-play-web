import { Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { NoSupsModal, Trailer } from ".."
import { GAMEBAR_AUTO_SIGNIN_WAIT_SECONDS, STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useStream, useWallet } from "../../containers"
import { useToggle } from "../../hooks"

const Message = ({ render, haveSups, toggleHaveSups }: { render: boolean; haveSups: boolean; toggleHaveSups: any }) => {
    const { onWorldSups } = useWallet()

    // Doing it here prevents index.tsx from re-rendering continuously from sup ticks
    useEffect(() => {
        if (!onWorldSups) return

        const supsAboveZero = onWorldSups ? onWorldSups.isGreaterThan(0) : false

        if (supsAboveZero && !haveSups) toggleHaveSups(true)
        if (!supsAboveZero && haveSups) toggleHaveSups(false)
    }, [onWorldSups, haveSups])

    if (!render) return null
    return null
}

export const Stream = ({ haveSups, toggleHaveSups }: { haveSups: boolean; toggleHaveSups: any }) => {
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
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
            <Message render={renderTopMessage} haveSups={haveSups} toggleHaveSups={toggleHaveSups} />
            <NoSupsModal haveSups={haveSups} />
        </Stack>
    )
}
