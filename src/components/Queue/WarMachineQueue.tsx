import { Box, Fade, Typography } from "@mui/material"
import { GAMEBAR_CONSTANTS } from "@ninjasoftware/passport-gamebar"
import React, { useEffect, useState } from "react"
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
        <Box sx={{ pointerEvents: "all", height: "100%" }}>
            <Fade in={true}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    <Box
                        sx={{
                            minHeight: GAMEBAR_CONSTANTS.gameBarHeight || 61,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.darkNeonBlue,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: ".7rem",
                                fontFamily: '"Nostromo Regular Bold", "Roboto", "Helvetica", "Arial", "sans-serif"',
                                textTransform: "uppercase",
                            }}
                        >
                            Your Battle Queue
                        </Typography>
                    </Box>
                    {queuedWarMachines.length > 0 ? (
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                            }}
                        >
                            {queuedWarMachines
                                .filter((q) => q.position >= 0)
                                .map((q, index) => (
                                    <Box
                                        key={`${q.warMachineMetadata.tokenID}-${index}`}
                                        sx={{
                                            position: "relative",
                                            display: "flex",
                                            padding: 1,
                                            backgroundColor: index % 2 === 0 ? colors.navy : undefined,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={q.warMachineMetadata.image}
                                            alt="Warmachine Thumbnail"
                                            sx={{
                                                height: 40,
                                                width: 40,
                                                marginRight: 1,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    textAlign: "start",
                                                }}
                                            >
                                                {q.warMachineMetadata.model || q.warMachineMetadata.name}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                Queue Position: {q.position + 1}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                position: "absolute",
                                            }}
                                        >
                                            {q.position + 1}
                                        </Box>
                                    </Box>
                                ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                padding: 1,
                            }}
                        >
                            <Typography>No war machines queued</Typography>
                        </Box>
                    )}
                </Box>
            </Fade>
        </Box>
    )
}
