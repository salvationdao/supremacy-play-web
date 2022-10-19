import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSupremacy } from "../../../containers"
import { useTheme } from "../../../containers/theme"
import { dateFormatter } from "../../../helpers"
import { useToggle } from "../../../hooks"
import { useGameServerCommandsUser } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { AdminLookupHistoryResp } from "../../../types/admin"

export const LookupHistory = ({ playerGID }: { playerGID: string }) => {
    const theme = useTheme()
    const { getFaction } = useSupremacy()
    const { send } = useGameServerCommandsUser("/user_commander")

    const [lookupHistory, setLookupHistory] = useState<AdminLookupHistoryResp[]>([])
    const [isLoading, setIsLoading] = useToggle(false)
    const [loadError, setLoadError] = useState<string>()

    const fetchLookupHistory = useCallback(async () => {
        setIsLoading(true)
        try {
            const resp = await send<AdminLookupHistoryResp[]>(GameServerKeys.ModLookupHistory)
            if (!resp) return

            setLookupHistory(resp)
            setLoadError(undefined)
        } catch (e) {
            setLoadError(typeof e === "string" ? e : "Failed to get lookup history.")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }, [send, setIsLoading])

    useEffect(() => {
        fetchLookupHistory()
    }, [fetchLookupHistory, playerGID])

    if (loadError) {
        return (
            <Typography
                sx={{
                    color: colors.red,
                }}
            >
                {loadError}
            </Typography>
        )
    }

    if (isLoading) {
        return (
            <Stack
                sx={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    p: "1rem",
                }}
            >
                <CircularProgress
                    sx={{
                        color: theme.factionTheme.primary,
                    }}
                />
            </Stack>
        )
    }

    if (lookupHistory.length === 0) {
        return (
            <Stack
                sx={{
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    p: "1rem",
                }}
            >
                <Typography>No Recent Lookup History</Typography>
            </Stack>
        )
    }

    return (
        <Stack>
            {lookupHistory.map((lh, index) => {
                const faction = getFaction(lh.faction_id)

                return (
                    <Link key={index} to={`/admin/lookup/${lh.gid}`}>
                        <Stack
                            justifyContent="space-between"
                            direction="row"
                            alignItems="center"
                            p="1rem"
                            sx={{
                                borderRadius: "2px",
                                backgroundColor: index % 2 === 0 ? `${theme.factionTheme.primary}33` : "transparent",
                            }}
                        >
                            <Stack direction="row">
                                <Box
                                    sx={{
                                        alignSelf: "flex-start",
                                        flexShrink: 0,
                                        width: "2rem",
                                        height: "2rem",
                                        background: `url(${faction.logo_url})`,
                                        backgroundColor: faction.background_color,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "contain",
                                    }}
                                />
                                <Typography sx={{ ml: "0.3rem", fontWeight: "700", userSelect: "none" }}>{`${lh.username} #${lh.gid}`}</Typography>
                            </Stack>
                            {lh.visited_on && (
                                <Typography sx={{ color: colors.lightGrey, userSelect: "none" }}>Visited On: {dateFormatter(lh.visited_on)}</Typography>
                            )}
                        </Stack>
                    </Link>
                )
            })}
        </Stack>
    )
}
