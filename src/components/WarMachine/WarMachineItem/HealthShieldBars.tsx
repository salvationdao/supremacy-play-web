import { Stack } from "@mui/material"
import React, { useMemo } from "react"
import { WIDTH_STAT_BAR } from "../.."
import { useArena } from "../../../containers/arena"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { WarMachineLiveState, WarMachineState } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"

interface HealthShieldBarsProps {
    warMachine: WarMachineState
    setIsAlive: React.Dispatch<React.SetStateAction<boolean>>
}

const propsAreEqual = (prevProps: HealthShieldBarsProps, nextProps: HealthShieldBarsProps) => {
    return prevProps.warMachine.hash === nextProps.warMachine.hash
}

export const HealthShieldBars = React.memo(function HealthShieldBars({ warMachine, setIsAlive }: HealthShieldBarsProps) {
    const { currentArenaID } = useArena()
    const { hash, participantID, maxHealth, maxShield } = warMachine

    // Listen on current war machine changes
    useGameServerSubscription<WarMachineLiveState | undefined>(
        {
            URI: `/public/arena/${currentArenaID}/mech/${participantID}`,
            key: GameServerKeys.SubMechLiveStats,
            ready: !!participantID && !!currentArenaID,
            batchURI: `/public/arena/${currentArenaID}/mech`,
        },
        (payload) => {
            // Direct DOM manipulation is a lot more optimized than re-rendering
            if (payload?.health !== undefined) {
                if (payload.health <= 0) setIsAlive(false)

                const healthBarEl = document.getElementById(`war-machine-item-health-bar-${hash}`)
                if (healthBarEl) {
                    const percent = Math.min((payload.health / maxHealth) * 100, 100)
                    healthBarEl.style.height = `${percent}%`
                    healthBarEl.style.backgroundColor = percent <= 45 ? colors.red : colors.green
                }
            }

            if (payload?.shield !== undefined) {
                const shieldBarEl = document.getElementById(`war-machine-item-shield-bar-${hash}`)
                if (shieldBarEl) {
                    const percent = Math.min((payload.shield / maxShield) * 100, 100)
                    shieldBarEl.style.height = `${percent}%`
                }
            }
        },
    )

    return useMemo(
        () => (
            <Stack direction="row" style={{ height: "100%" }}>
                <ProgressBar
                    id={`war-machine-item-shield-bar-${hash}`}
                    percent={(warMachine.shield / maxHealth) * 100}
                    color={colors.shield}
                    backgroundColor="#FFFFFF06"
                    thickness={`${WIDTH_STAT_BAR}rem`}
                />

                <ProgressBar
                    id={`war-machine-item-health-bar-${hash}`}
                    percent={(warMachine.health / maxShield) * 100}
                    color={colors.health}
                    backgroundColor="#FFFFFF06"
                    thickness={`${WIDTH_STAT_BAR}rem`}
                />
            </Stack>
        ),
        [hash, maxHealth, maxShield, warMachine.health, warMachine.shield],
    )
}, propsAreEqual)
