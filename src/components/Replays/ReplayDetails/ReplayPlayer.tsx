import { Stream, StreamPlayerApi } from "@cloudflare/stream-react"
import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { colors, fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"

export const ReplayPlayer = ({ battleReplay, streamRef }: { battleReplay?: BattleReplay; streamRef: React.MutableRefObject<StreamPlayerApi | undefined> }) => {
    const theme = useTheme()
    const { hasInteracted } = useSupremacy()
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        streamRef.current?.play()
        if (streamRef?.current?.muted !== undefined) streamRef.current.muted = false
    }, [hasInteracted, streamRef])

    const onVolumeChanged = useCallback(() => {
        streamRef.current?.volume && localStorage.setItem("replayPlaybackVolume", `${streamRef.current.volume}`)
    }, [streamRef])

    const primaryColor = theme.factionTheme.primary

    return (
        <Box sx={{ position: "relative", width: "100%", pt: "56.25%", backgroundColor: colors.darkerNavy }}>
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 3 }}>
                <Stream
                    streamRef={streamRef}
                    src={battleReplay?.stream_id || ""}
                    controls
                    autoplay={false}
                    primaryColor={primaryColor}
                    volume={parseString(localStorage.getItem("replayPlaybackVolume"), 1)}
                    onVolumeChange={onVolumeChanged}
                    onError={() => setHasError(true)}
                />
            </Box>

            {hasError && (
                <Stack alignItems="center" justifyContent="center" sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 1 }}>
                    <Typography
                        sx={{
                            color: colors.red,
                            fontFamily: fonts.nostromoBold,
                            textAlign: "center",
                        }}
                    >
                        An error occurred while loading the replay video...
                    </Typography>
                </Stack>
            )}
        </Box>
    )
}
