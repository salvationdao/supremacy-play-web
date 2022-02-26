import { Box, Stack, Typography } from "@mui/material"
import { useWallet } from "@ninjasoftware/passport-gamebar"
import { useEffect } from "react"
import { STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useAuth, useDimension, useStream } from "../../containers"
import { colors } from "../../theme/theme"

const Message = ({ haveSups, toggleHaveSups }: { haveSups: boolean; toggleHaveSups: any }) => {
    const { user } = useAuth()
    const { onWorldSups } = useWallet()

    const supsAboveZero = onWorldSups ? onWorldSups.isGreaterThan(0) : false

    // Doing it here prevents index.tsx from re-rendering continuously from sup ticks
    useEffect(() => {
        if (supsAboveZero && !haveSups) toggleHaveSups(true)
        if (!supsAboveZero && haveSups) toggleHaveSups(false)
    }, [onWorldSups, supsAboveZero, haveSups])

    return (
        <Stack sx={{ flex: 1, width: "100%" }}>
            <Box sx={{ px: 2, py: 0.5, backgroundColor: colors.red, boxShadow: 6, zIndex: 99 }}>
                <Typography variant="h6" sx={{ textAlign: "center", color: "#FFFFFF" }}>
                    {user && !haveSups
                        ? "You must have SUPS in order to view the battle stream."
                        : "You must connect your passport to view the battle stream."}
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

                {/* <iframe
                    src="https://stats.supremacy.game/#/"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: 0,
                    }}
                ></iframe> */}
            </Box>
        </Stack>
    )
}

export const Stream = ({ haveSups, toggleHaveSups }: { haveSups: boolean; toggleHaveSups: any }) => {
    const { user } = useAuth()
    const { iframeDimensions } = useDimension()
    const { selectedWsURL, isMute, vidRefCallback } = useStream()

    return (
        <Stack sx={{ width: "100%", height: "100%" }}>
            {user && haveSups ? (
                <video
                    key={selectedWsURL}
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
                <Message haveSups={haveSups} toggleHaveSups={toggleHaveSups} />
            )}
        </Stack>
    )
}