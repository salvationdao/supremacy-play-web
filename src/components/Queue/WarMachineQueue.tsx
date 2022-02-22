import { Box, Stack, Typography } from "@mui/material"
import { GAMEBAR_CONSTANTS } from "@ninjasoftware/passport-gamebar"
import { useEffect, useState } from "react"
import { WarMachineQueueItem } from ".."
import { SvgRobot } from "../../assets"
import { useAuth, useWebsocket } from "../../containers"
import HubKey from "../../keys"
import { colors } from "../../theme/theme"
import { QueuedWarMachine } from "../../types"

export const WarMachineQueue = () => {
    const { user, userID } = useAuth()
    const { state, subscribe } = useWebsocket()

    // Queued war machine data
    const [queuedWarMachines, setQueuedWarMachines] = useState<QueuedWarMachine[]>([])

    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribe || !user) return
        return subscribe<QueuedWarMachine[]>(HubKey.SubUserWarMachineQueueUpdated, (payload) => {
            if (!payload) return
            setQueuedWarMachines(payload)
        })
    }, [state, subscribe, user, userID])

    return (
        <Stack sx={{ height: "100%" }}>
            <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{
                    position: "relative",
                    pl: 2.5,
                    pr: 6,
                    height: GAMEBAR_CONSTANTS.gameBarHeight || 61,
                    background: `${colors.battleQueueBanner}65`,
                    boxShadow: 1.5,
                }}
            >
                <SvgRobot size="23px" fill={colors.text} sx={{ pb: 0.6 }} />
                <Typography
                    variant="caption"
                    sx={{ flex: 1, color: colors.text, fontFamily: "Nostromo Regular Black" }}
                >
                    BATTLE QUEUE
                </Typography>
            </Stack>

            <Box
                sx={{
                    m: 0.5,
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    direction: "ltr",
                    scrollbarWidth: "none",
                    "::-webkit-scrollbar": {
                        width: 4,
                    },
                    "::-webkit-scrollbar-track": {
                        boxShadow: `inset 0 0 5px ${colors.darkerNeonBlue}`,
                        borderRadius: 3,
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: colors.battleQueueBanner,
                        borderRadius: 3,
                    },
                }}
            >
                <Stack>
                    {queuedWarMachines && queuedWarMachines.length > 0 ? (
                        queuedWarMachines
                            .filter((q) => q.position >= 0)
                            .map((q, index) => (
                                <WarMachineQueueItem
                                    key={`${q.warMachineMetadata.tokenID}-${index}`}
                                    queueItem={q}
                                    index={index}
                                />
                            ))
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{
                                px: 1.6,
                                py: 1.6,
                                color: colors.grey,
                                fontFamily: "Share Tech",
                                fontSize: "0.8rem",
                                userSelect: "text",
                            }}
                        >
                            There are no war machines in the queue...
                        </Typography>
                    )}
                </Stack>
            </Box>
        </Stack>
    )
}
