import { useEffect, useMemo, useState } from "react"
import { Box, Stack } from "@mui/material"
import { NetMessageTickWarMachine, WarMachineState } from "../../types"
import { BoxSlanted, SlantedBar, WIDTH_PER_SLANTED_BAR, WIDTH_PER_SLANTED_BAR_ACTUAL } from ".."
import { colors } from "../../theme/theme"
import { useGameServerWebsocket } from "../../containers"

type LayoutType = "vertical" | "horizontal"

export const HealthShieldBars = ({ type = "horizontal", warMachine }: { type?: LayoutType; warMachine: WarMachineState }) => {
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

    return <HealthShieldBarsInner type={type} health={health} healthPercent={healthPercent} shieldPercent={shieldPercent} maxHealth={maxHealth} />
}

const HealthShieldBarsInner = ({
    type,
    health,
    healthPercent,
    shieldPercent,
    maxHealth,
}: {
    type: LayoutType
    health: number
    healthPercent: number
    shieldPercent: number
    maxHealth: number
}) => {
    if (type == "vertical") {
        return (
            <Box style={{ position: "relative", opacity: 0.8, width: "100%", height: "100%" }}>
                <Box
                    style={{
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
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: `${WIDTH_PER_SLANTED_BAR_ACTUAL}rem`,
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <SlantedBar backgroundColor={health / maxHealth <= 0.45 ? colors.red : colors.health} progressPercent={healthPercent} />
                </Box>
            </Box>
        )
    }

    return (
        <Stack justifyContent="center" spacing=".4rem" style={{ flex: 1, height: "100%" }}>
            <Box>
                <BoxSlanted clipSlantSize="3px" style={{ width: "100%", height: "1.2rem", backgroundColor: "#FFFFFF30" }}>
                    <BoxSlanted
                        clipSlantSize="3px"
                        style={{
                            width: `${shieldPercent}%`,
                            height: "100%",
                            backgroundColor: colors.shield,
                        }}
                    />
                </BoxSlanted>
            </Box>

            <Box>
                <BoxSlanted clipSlantSize="3px" style={{ marginLeft: "-0.4rem", width: "100%", height: "1.2rem", backgroundColor: "#FFFFFF30" }}>
                    <BoxSlanted
                        clipSlantSize="3px"
                        style={{
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
