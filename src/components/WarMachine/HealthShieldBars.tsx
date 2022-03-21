import { useEffect, useMemo, useState } from "react"
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
    const { participantID, maxHealth, maxShield } = warMachine
    const { state, subscribeWarMachineStatNetMessage } = useGameServerWebsocket()
    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)

    const healthPercent = useMemo(() => (health / maxHealth) * 100, [health, maxHealth])
    const shieldPercent = useMemo(() => (shield / maxShield) * 100, [shield, maxShield])

    // Listen on current war machine changes
    useEffect(() => {
        if (state !== WebSocket.OPEN || !subscribeWarMachineStatNetMessage) return

        return subscribeWarMachineStatNetMessage<NetMessageTickWarMachine | undefined>(participantID, (payload) => {
            if (payload?.health !== undefined) {
                setHealth(payload.health)
            }
            if (payload?.shield !== undefined) setShield(payload.shield)
        })
    }, [participantID, state, subscribeWarMachineStatNetMessage])

    if (type == "vertical") {
        return (
            <Box sx={{ position: "relative", opacity: 0.8, width: "100%", height: "100%" }}>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        right: `${WIDTH_PER_SLANTED_BAR - 0.1}rem`,
                        width: `${WIDTH_PER_SLANTED_BAR_ACTUAL}rem`,
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
                        width: `${WIDTH_PER_SLANTED_BAR_ACTUAL}rem`,
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <SlantedBar
                        backgroundColor={health / maxHealth <= 0.45 ? colors.red : colors.health}
                        progressPercent={healthPercent}
                    />
                </Box>
            </Box>
        )
    }

    return (
        <Stack justifyContent="center" spacing=".4rem" sx={{ flex: 1, height: "100%" }}>
            <Box>
                <BoxSlanted clipSlantSize="3px" sx={{ width: "100%", height: "1.2rem", backgroundColor: "#FFFFFF30" }}>
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
                    sx={{ ml: "-0.4rem", width: "100%", height: "1.2rem", backgroundColor: "#FFFFFF30" }}
                >
                    <BoxSlanted
                        clipSlantSize="3px"
                        sx={{
                            width: `${healthPercent}%`,
                            height: "100%",
                            backgroundColor: health / maxHealth <= 0.45 ? colors.red : colors.health,
                        }}
                    />
                </BoxSlanted>
            </Box>
        </Stack>
    )
}
function usMemo(arg0: () => number, arg1: number[]) {
    throw new Error("Function not implemented.")
}
