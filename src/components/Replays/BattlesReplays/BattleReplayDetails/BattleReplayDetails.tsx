import { Stream } from "@cloudflare/stream-react"
import { CircularProgress, Stack, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useGlobalNotifications } from "../../../../containers"
import { useTheme } from "../../../../containers/theme"
import { useGameServerCommands } from "../../../../hooks/useGameServer"
import { GameServerKeys } from "../../../../keys"
import { colors } from "../../../../theme/theme"
import { BattleReplay, MechDetails } from "../../../../types"
import { ClipThing } from "../../../Common/ClipThing"

interface GetReplayResponse {
    battle_replay: BattleReplay
    mechs: MechDetails[]
}

export const BattleReplayDetails = ({ gid, battleNumber }: { gid: number; battleNumber: number }) => {
    const theme = useTheme()
    const { send } = useGameServerCommands("/public/commander")
    const [replay, setReplay] = useState<GetReplayResponse>()
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string>()

    const primaryColor = theme.factionTheme.primary

    // Get replay details
    useEffect(() => {
        ;(async () => {
            try {
                setIsLoading(true)
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
            } finally {
                setIsLoading(false)
            }
        })()
    }, [battleNumber, gid, send])

    // const content = useMemo(() => {
    //     if (loadError) {
    //         return (
    //             <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
    //                 <Stack
    //                     alignItems="center"
    //                     justifyContent="center"
    //                     sx={{ height: "100%", maxWidth: "100%", width: "75rem", px: "3rem", pt: "1.28rem" }}
    //                     spacing="1.5rem"
    //                 >
    //                     <Typography
    //                         sx={{
    //                             color: colors.red,
    //                             fontFamily: fonts.nostromoBold,
    //                             textAlign: "center",
    //                         }}
    //                     >
    //                         {loadError ? loadError : "Failed to load listing details."}
    //                     </Typography>
    //                 </Stack>
    //             </Stack>
    //         )
    //     }

    //     if (isLoading) {

    //     }

    //     if (!marketItem) {
    //         return (
    //             <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
    //                 <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem", pt: "1.28rem" }}>
    //                     <CircularProgress size="3rem" sx={{ color: primaryColor }} />
    //                 </Stack>
    //             </Stack>
    //         )
    //     }

    //     return <BattleReplayPlayer battleNumber={battleNumber} gid={gid} />
    // }, [loadError, marketItem, mechDetails, primaryColor])

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
            <Stack sx={{ height: "100%" }}>
                {isLoading && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", px: "3rem" }}>
                            <CircularProgress size="3rem" sx={{ color: primaryColor }} />
                        </Stack>
                    </Stack>
                )}

                {!isLoading && replay && <Stream controls src={replay.battle_replay.stream_id} autoplay={true} primaryColor={primaryColor} />}
            </Stack>
        </ClipThing>
    )
}
