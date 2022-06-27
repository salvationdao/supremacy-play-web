import { Stack } from "@mui/material"
import { useMemo, useState } from "react"
import { WIDTH_STAT_BAR } from "../.."
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { WarMachineLiveState, WarMachineState } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"

export const HealthShieldBars = ({ warMachine, toggleIsAlive }: { warMachine: WarMachineState; toggleIsAlive: (value: boolean) => void }) => {
    const { participantID, maxHealth, maxShield } = warMachine
    const [health, setHealth] = useState<number>(warMachine.health)
    const [shield, setShield] = useState<number>(warMachine.shield)

    const healthPercent = useMemo(() => (health / maxHealth) * 100, [health, maxHealth])
    const shieldPercent = useMemo(() => (shield / maxShield) * 100, [shield, maxShield])

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID,
            batchURI: "/public/mech",
        },
        (payload) => {
            if (payload?.health !== undefined) {
                setHealth(payload.health)
                if (payload.health <= 0) toggleIsAlive(false)
            }
            if (payload?.shield !== undefined) setShield(payload.shield)
        },
    )

    return (
        <Stack direction="row" style={{ position: "relative", opacity: 0.8, height: "100%" }}>
            <ProgressBar percent={shieldPercent} color={colors.shield} backgroundColor="#FFFFFF06" thickness={`${WIDTH_STAT_BAR}rem`} />

            <ProgressBar
                percent={healthPercent}
                color={health / maxHealth <= 0.45 ? colors.red : colors.health}
                backgroundColor="#FFFFFF06"
                thickness={`${WIDTH_STAT_BAR}rem`}
            />
        </Stack>
    )
}
