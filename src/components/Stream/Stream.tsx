import { Box, Stack, Typography } from "@mui/material"
import { useWallet } from "@ninjasoftware/passport-gamebar"
import { useEffect } from "react"
import { STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useAuth, useDimension, useStream } from "../../containers"
import { useToggle } from "../../hooks"
import { colors } from "../../theme/theme"

const Message = ({ toggleHaveSups }: { toggleHaveSups: any }) => {
    const { user } = useAuth()
    const { onWorldSups } = useWallet()

    const haveSups = onWorldSups ? onWorldSups.dividedBy(1000000000000000000).isGreaterThanOrEqualTo(0) : false

    useEffect(() => {
        if (haveSups) toggleHaveSups
    }, [onWorldSups])

    return (
        <Stack sx={{ flex: 1, width: "100%" }}>
            <Box sx={{ px: 2, py: 0.5, backgroundColor: colors.red, boxShadow: 6, zIndex: 99 }}>
                <Typography variant="h6" sx={{ textAlign: "center", color: "#FFFFFF" }}>
                    {user && !haveSups
                        ? "You must have SUPS in order to view the battle stream."
                        : "You must connect your passport to view the battle stream."}
                </Typography>
            </Box>
            <iframe
                src="https://stats.supremacy.game/#/"
                style={{
                    flex: 1,
                    width: "100%",
                    border: 0,
                }}
            ></iframe>
        </Stack>
    )
}

export const Stream = () => {
    const { user } = useAuth()
    const { iframeDimensions } = useDimension()
    const { selectedWsURL, isMute, vidRefCallback } = useStream()
    // We don't want the stream to suddenly cut off while they are playing,
    // so only check if theyhave sups on initial load
    const [haveSups, toggleHaveSups] = useToggle()

    return (
        <Stack sx={{ width: "100%", height: "100%" }}>
            {user && (user.sups > 0 || haveSups) ? (
                <video
                    key={selectedWsURL}
                    id={"remoteVideo"}
                    muted={isMute}
                    ref={vidRefCallback}
                    autoPlay
                    controls
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
                <Message toggleHaveSups={toggleHaveSups} />
            )}
        </Stack>
    )
}
