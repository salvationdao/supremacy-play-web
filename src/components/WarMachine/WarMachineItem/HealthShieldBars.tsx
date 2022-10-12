import { Stack } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { WIDTH_STAT_BAR } from "../.."
import { useArena } from "../../../containers/arena"
import { useGameServerSubscription } from "../../../hooks/useGameServer"
import { GameServerKeys } from "../../../keys"
import { colors } from "../../../theme/theme"
import { WarMachineLiveState, WarMachineState } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { useWarMachineStat } from "../../../hooks/useWarMachineStat"

interface HealthShieldBarsProps {
    warMachine: WarMachineState
    setIsAlive: React.Dispatch<React.SetStateAction<boolean>>
}

const propsAreEqual = (prevProps: HealthShieldBarsProps, nextProps: HealthShieldBarsProps) => {
    return prevProps.warMachine.hash === nextProps.warMachine.hash
}

export const HealthShieldBars = React.memo(function HealthShieldBars({ warMachine, setIsAlive }: HealthShieldBarsProps) {
    const { hash, maxHealth, maxShield } = warMachine

    const { health, shield } = useWarMachineStat(warMachine)
    useEffect(() => {
        setIsAlive(health > 0)

        const healthBarEl = document.getElementById(`war-machine-item-health-bar-${hash}`)
        if (healthBarEl) {
            const percent = Math.min((health / maxHealth) * 100, 100)
            healthBarEl.style.height = `${percent}%`
            healthBarEl.style.backgroundColor = percent <= 45 ? colors.red : colors.health
        }

        const shieldBarEl = document.getElementById(`war-machine-item-shield-bar-${hash}`)
        if (shieldBarEl) {
            const percent = Math.min((shield / maxShield) * 100, 100)
            shieldBarEl.style.height = `${percent}%`
        }
    }, [health, shield])

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
