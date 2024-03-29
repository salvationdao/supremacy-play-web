import { StreamPlayerApi } from "@cloudflare/stream-react"
import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleReplay, MechDetails } from "../../../types"
import { ClipThing } from "../../Common/Deprecated/ClipThing"
import { RelatedReplayVideos } from "./RelatedReplayVideos"
import { ReplayEvents } from "./ReplayEvents"
import { ReplayInfo } from "./ReplayInfo"
import { ReplayMechs } from "./ReplayMechs"
import { ReplayPlayer } from "./ReplayPlayer"

interface GetReplayResponse {
    battle_replay: BattleReplay
    mechs: MechDetails[]
}

export const ReplayDetails = ({ gid, battleNumber }: { gid: number; battleNumber: number }) => {
    const theme = useTheme()
    const { send } = useGameServerCommands("/public/commander")
    const [replay, setReplay] = useState<GetReplayResponse>()
    const [loadError, setLoadError] = useState<string>()
    const streamRef = useRef<StreamPlayerApi>()

    // Get replay details
    useEffect(() => {
        ;(async () => {
            try {
                const resp = await send<GetReplayResponse>(GameServerKeys.GetReplayDetails, {
                    battle_number: battleNumber,
                    arena_gid: gid,
                })

                if (!resp) return
                setReplay(resp)
            } catch (err) {
                const message = typeof err === "string" ? err : "Failed to load replay."
                setLoadError(message)
                console.error(err)
            }
        })()
    }, [battleNumber, gid, send])

    const seekToSeconds = useCallback((seconds: number) => {
        streamRef.current?.play()
        if (streamRef.current?.currentTime) {
            streamRef.current.currentTime = Math.max(seconds - 3, 0)
        }
    }, [])

    const content = useMemo(() => {
        if (loadError) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
                        spacing="1.5rem"
                    >
                        <Typography
                            sx={{
                                color: colors.red,
                                fontFamily: fonts.nostromoBold,
                                textAlign: "center",
                            }}
                        >
                            {loadError}
                        </Typography>
                    </Stack>
                </Stack>
            )
        }

        if (!replay) {
            return (
                <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
                        <CircularProgress />
                    </Stack>
                </Stack>
            )
        }

        return (
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    ml: "2rem",
                    pr: "1.4rem",
                    mr: ".6rem",
                    my: "2rem",
                    direction: "ltr",
                }}
            >
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack direction="row" spacing="2rem" justifyContent="space-between">
                        {/* Left side */}
                        <Stack spacing="2rem" sx={{ flex: 1 }}>
                            <ReplayPlayer battleReplay={replay.battle_replay} streamRef={streamRef} seekToSeconds={seekToSeconds} />
                            <ReplayInfo battleReplay={replay.battle_replay} />
                            <ReplayMechs mechs={replay.mechs} />
                        </Stack>

                        {/* Right side */}
                        <Stack spacing="2rem" sx={{ width: "38rem" }}>
                            <ReplayEvents battleReplay={replay.battle_replay} seekToSeconds={seekToSeconds} streamRef={streamRef} />
                            <RelatedReplayVideos battleReplay={replay.battle_replay} />
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        )
    }, [loadError, replay, seekToSeconds])

    return (
        <ClipThing
            clipSize="10px"
            border={{
                borderColor: theme.factionTheme.primary,
                borderThickness: ".3rem",
            }}
            corners={{
                topRight: true,
                bottomLeft: true,
                bottomRight: true,
            }}
            opacity={0.7}
            backgroundColor={theme.factionTheme.u800}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}
