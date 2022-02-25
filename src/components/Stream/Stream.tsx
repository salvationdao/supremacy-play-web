import { Box, Stack, Typography } from "@mui/material"
import { STREAM_ASPECT_RATIO_W_H } from "../../constants"
import { useAuth, useDimension, useStream } from "../../containers"
import { colors } from "../../theme/theme"

export const Stream = () => {
    const { user } = useAuth()
    const { iframeDimensions } = useDimension()
    const { selectedWsURL, isMute, vidRefCallback } = useStream()

    return (
        <Stack sx={{ width: "100%", height: "100%" }}>
            {user && user.sups > 0 ? (
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
                <Stack sx={{ flex: 1, width: "100%" }}>
                    <Box sx={{ px: 2, py: 0.5, backgroundColor: colors.red }}>
                        <Typography variant="h6" sx={{ textAlign: "center", color: "#FFFFFF" }}>
                            {user && user.sups <= 0
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
            )}
        </Stack>
    )
}
