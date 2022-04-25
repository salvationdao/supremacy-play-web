import { Stack } from "@mui/material"
import { useTour } from "@reactour/tour"
import { useState } from "react"
import { DEV_ONLY, STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useDimension, useStream } from "../../containers"
import { Music } from "../Music/Music"
import { Trailer } from "./Trailer"

export const Stream = () => {
    const [watchedTrailer, setWatchedTrailer] = useState(localStorage.getItem("watchedTrailer") == "true")
    const { iframeDimensions } = useDimension()
    const { currentStream, isMute, vidRefCallback } = useStream()
    const { isOpen } = useTour()

    if (!watchedTrailer) {
        return <Trailer watchedTrailer={watchedTrailer} setWatchedTrailer={setWatchedTrailer} />
    }

    if (isOpen) return null

    return (
        <>
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
            </Stack>

            {DEV_ONLY && <Music />}
        </>
    )
}
