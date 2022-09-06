import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useTheme } from "../../../containers/theme"
import { useGameServerCommands } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors, fonts } from "../../../theme/theme"
import { BattleReplay, MechDetails } from "../../../types"
import { ClipThing } from "../../Common/ClipThing"
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

    // useEffect(() => {
    //     ;(async () => {
    //         try {
    //             setIsLoading(true)
    //             const resp = await send<RESPONSE_TYPE>(GameServerKeys.XXXXXX, {
    //                 payload: something,
    //             })

    //             if (!resp) return
    //             setFactionsData(resp)
    //         } catch (err) {
    //             const message = typeof err === "string" ? err : "Failed to get key card listings."
    //             newSnackbarMessage(message, "error")
    //             setLoadError(message)
    //             console.error(err)
    //         } finally {
    //             setIsLoading(true)
    //         }
    //     })()
    // }, [send])

    const primaryColor = theme.factionTheme.primary

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
                        <CircularProgress size="3rem" sx={{ color: primaryColor }} />
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
                    pr: "1rem",
                    mr: "1rem",
                    my: "2rem",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: "1rem",
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#FFFFFF15",
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: primaryColor,
                    },
                }}
            >
                <Box sx={{ direction: "ltr", height: 0 }}>
                    <Stack spacing="2rem">
                        <ReplayPlayer battleReplay={replay.battle_replay} />

                        <Stack direction="row" spacing="2rem">
                            {/* Left side */}
                            <Stack>
                                <Typography variant="h4" sx={{ fontFamily: fonts.nostromoBlack }}>
                                    BATTLE #{replay.battle_replay?.battle.battle_number}
                                </Typography>

                                <Typography sx={{ fontFamily: fonts.nostromoBold, color: colors.lightGrey }}>
                                    {replay.battle_replay?.battle.ended_at?.toLocaleDateString("en-us", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZoneName: "short",
                                        hour12: false,
                                    })}
                                </Typography>
                            </Stack>

                            {/* Right side */}
                            <Stack sx={{ width: "30rem" }}></Stack>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        )
    }, [loadError, primaryColor, replay])

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
            backgroundColor={theme.factionTheme.background}
            sx={{ height: "100%" }}
        >
            <Stack sx={{ height: "100%" }}>{content}</Stack>
        </ClipThing>
    )
}
