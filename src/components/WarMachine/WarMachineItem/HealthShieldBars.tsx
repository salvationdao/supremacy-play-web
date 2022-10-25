import { Stack } from "@mui/material"
import React, { useMemo } from "react"
import { WIDTH_STAT_BAR } from "../.."
import { BinaryDataKey, useGameServerSubscription } from "../../../hooks/useGameServer"
import { colors } from "../../../theme/theme"
import { WarMachineLiveState, WarMachineState } from "../../../types"
import { ProgressBar } from "../../Common/ProgressBar"
import { warMachineStatsBinaryParser } from "../../../helpers/binaryDataParsers/warMachineStatsParser"
import { useArena } from "../../../containers"

interface HealthShieldBarsProps {
    warMachine: WarMachineState
    setIsAlive: React.Dispatch<React.SetStateAction<boolean>>
}

const propsAreEqual = (prevProps: HealthShieldBarsProps, nextProps: HealthShieldBarsProps) => {
    return prevProps.warMachine.hash === nextProps.warMachine.hash
}

export const HealthShieldBars = React.memo(function HealthShieldBars({ warMachine, setIsAlive }: HealthShieldBarsProps) {
    const { currentArenaID } = useArena()
    const { hash, maxHealth, maxShield } = warMachine

    useGameServerSubscription<WarMachineLiveState[]>(
        {
            URI: `/mini_map/arena/${currentArenaID}/public/mech_stats`,
            binaryKey: BinaryDataKey.WarMachineStats,
            binaryParser: warMachineStatsBinaryParser,
            ready: !!currentArenaID,
        },
        (payload) => {
            if (!payload) return

            const target = payload.find((p) => p.participant_id === warMachine.participantID)
            if (!target) return

            setIsAlive(target.health > 0)

            const healthBarEl = document.getElementById(`mechs-item-health-bar-${hash}`)
            if (healthBarEl) {
                const percent = Math.min((target.health / maxHealth) * 100, 100)
                healthBarEl.style.height = `${percent}%`
                healthBarEl.style.backgroundColor = percent <= 45 ? colors.red : colors.health
            }

            const shieldBarEl = document.getElementById(`mechs-item-shield-bar-${hash}`)
            if (shieldBarEl) {
                const percent = Math.min((target.shield / maxShield) * 100, 100)
                shieldBarEl.style.height = `${percent}%`
            }
        },
    )

    return useMemo(
        () => (
            <Stack direction="row" style={{ height: "100%" }}>
                <ProgressBar
                    id={`mechs-item-shield-bar-${hash}`}
                    percent={(warMachine.shield / maxHealth) * 100}
                    color={colors.shield}
                    backgroundColor="#FFFFFF06"
                    thickness={`${WIDTH_STAT_BAR}rem`}
                />

                <ProgressBar
                    id={`mechs-item-health-bar-${hash}`}
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
