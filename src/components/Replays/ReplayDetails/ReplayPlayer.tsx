import { Stream, StreamPlayerApi } from "@cloudflare/stream-react"
import { Box, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { parseString } from "../../../helpers"
import { useInterval } from "../../../hooks"
import { colors, fonts } from "../../../theme/theme"
import { BattleReplay } from "../../../types"
import { NiceButton } from "../../Common/Nice/NiceButton"

export const ReplayPlayer = ({
    battleReplay,
    streamRef,
    seekToSeconds,
}: {
    battleReplay?: BattleReplay
    streamRef: React.MutableRefObject<StreamPlayerApi | undefined>
    seekToSeconds: (seconds: number) => void
}) => {
    const theme = useTheme()
    const { hasInteracted } = useSupremacy()
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        streamRef.current?.play()
        if (streamRef?.current?.muted !== undefined) streamRef.current.muted = false
    }, [hasInteracted, streamRef])

    useInterval(() => {
        const videoTime = streamRef.current?.currentTime || 0
        const playerEl = document.getElementById("replay-player-skip-button")

        // Show/hide the skip button based on current video watch time
        if (videoTime > 2 && playerEl && battleReplay?.intro_ended_at && battleReplay?.started_at) {
            if (videoTime < (battleReplay.intro_ended_at.getTime() - battleReplay.started_at.getTime()) / 1000 - 5) {
                playerEl.style.display = "block"
            } else {
                playerEl.style.display = "none"
            }
        }
    }, 1000)

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

                {battleReplay?.intro_ended_at && battleReplay?.started_at && (
                    <Box id="replay-player-skip-button" sx={{ display: "none", position: "absolute", top: "2rem", right: "2.5rem", zIndex: 9 }}>
                        <NiceButton
                            buttonColor="#FFFFFF"
                            onClick={() => {
                                if (!battleReplay?.intro_ended_at || !battleReplay?.started_at) return
                                const timeSeconds = (battleReplay.intro_ended_at.getTime() - battleReplay.started_at.getTime()) / 1000
                                seekToSeconds(timeSeconds)
                            }}
                        >
                            SKIP INTRO
                        </NiceButton>
                    </Box>
                )}
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
