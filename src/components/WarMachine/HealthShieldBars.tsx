import React, { useEffect, useState } from "react"
import { Box, Stack } from "@mui/material"
import { NetMessageTickWarMachine, WarMachineState } from "../../types"
import { BoxSlanted, SlantedBar, WIDTH_PER_SLANTED_BAR, WIDTH_PER_SLANTED_BAR_ACTUAL } from ".."
import { colors } from "../../theme/theme"
import { useGameServerWebsocket } from "../../containers"

export const HealthShieldBars = ({
    type = "horizontal",
    warMachine,
}: {
    type?: "vertical" | "horizontal"
    warMachine: WarMachineState
}) => {
    const { participant_id, max_health, max_shield } = warMachine
    const { state, subscribeWarMachineStatNetMessage } = useGameServerWebsocket()
    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)

    const healthPercent = (health / max_health) * 100
    const shieldPercent = (shield / max_shield) * 100

    // Listen on current war machine changes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeWarMachineStatNetMessage) return

        return subscribeWarMachineStatNetMessage<NetMessageTickWarMachine | undefined>(participant_id, (payload) => {
            if (payload?.health !== undefined) {
                setHealth(payload.health)
            }
            if (payload?.shield !== undefined) setShield(payload.shield)
        })
    }, [participant_id, state, subscribeWarMachineStatNetMessage])

    if (type == "vertical") {
        return (
            <Box sx={{ position: "relative", opacity: 0.8, width: "100%", height: "100%" }}>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: WIDTH_PER_SLANTED_BAR - 1,
                        width: WIDTH_PER_SLANTED_BAR_ACTUAL,
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <SlantedBar backgroundColor={colors.shield} progressPercent={shieldPercent} />
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: WIDTH_PER_SLANTED_BAR_ACTUAL,
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <SlantedBar
                        backgroundColor={health / max_health <= 0.45 ? colors.red : colors.health}
                        progressPercent={healthPercent}
                    />
                </Box>
            </Box>
        )
    }

    return (
        <Stack justifyContent="center" spacing={0.5} sx={{ flex: 1, height: "100%" }}>
            <Box>
                <BoxSlanted clipSlantSize="3px" sx={{ width: "100%", height: 12, backgroundColor: "#FFFFFF30" }}>
                    <BoxSlanted
                        clipSlantSize="3px"
                        sx={{
                            width: `${shieldPercent}%`,
                            height: "100%",
                            backgroundColor: colors.shield,
                        }}
                    />
                </BoxSlanted>
            </Box>

            <Box>
                <BoxSlanted
                    clipSlantSize="3px"
                    sx={{ ml: -0.5, width: "100%", height: 12, backgroundColor: "#FFFFFF30" }}
                >
                    <BoxSlanted
                        clipSlantSize="3px"
                        sx={{
                            width: `${healthPercent}%`,
                            height: "100%",
                            backgroundColor: health / max_health <= 0.45 ? colors.red : colors.health,
                        }}
                    />
                </BoxSlanted>
            </Box>
        </Stack>
    )
}
