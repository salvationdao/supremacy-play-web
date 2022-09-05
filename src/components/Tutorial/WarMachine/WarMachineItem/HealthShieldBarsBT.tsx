import { Stack } from "@mui/material"
import { useEffect, useMemo } from "react"
import { colors } from "../../../../theme/theme"
import { WarMachineState } from "../../../../types"
import { ProgressBar } from "../../../Common/ProgressBar"
import { WIDTH_STAT_BAR } from "./WarMachineItemBT"

export const HealthShieldBarsBT = ({ warMachine, toggleIsAlive }: { warMachine: WarMachineState; toggleIsAlive: (value: boolean) => void }) => {
    const { maxHealth, maxShield, health, shield } = warMachine

    const healthPercent = useMemo(() => (health / maxHealth) * 100, [health, maxHealth])
    const shieldPercent = useMemo(() => (shield / maxShield) * 100, [shield, maxShield])

    useEffect(() => {
        if (healthPercent === 0) {
            toggleIsAlive(false)
        }
    }, [healthPercent, toggleIsAlive])

    return (
        <Stack direction="row" style={{ height: "100%" }}>
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
