import { useMemo } from "react"
import { SvgDrag } from "../../../../assets"
import { useTheme } from "../../../../containers/theme"
import { useTraining } from "../../../../containers/training"
import { pulseEffect } from "../../../../theme/keyframes"
import { colors } from "../../../../theme/theme"
import { MechAbilityStages } from "../../../../types/training"
import { MapIconBT } from "./MapIconBT"

export const MechCommandIconsBT = () => {
    const theme = useTheme()
    const { mechMoveCommand, trainingStage, setTrainingStage, setIsTargeting, setPlayerAbility } = useTraining()
    const mechMoveCommands = useMemo(() => (mechMoveCommand ? [mechMoveCommand] : undefined), [mechMoveCommand])

    return useMemo(() => {
        return (
            <>
                {mechMoveCommands &&
                    mechMoveCommands.length > 0 &&
                    mechMoveCommands.map((mmc) => {
                        if (mmc.cell_x === undefined || mmc.cell_y === undefined) return null
                        return (
                            <MapIconBT
                                key={mmc.id}
                                primaryColor={trainingStage === MechAbilityStages.MoveActionMA ? theme.factionTheme.primary : colors.lightGrey}
                                position={{ x: mmc.cell_x, y: mmc.cell_y }}
                                onClick={async () => {
                                    setIsTargeting(false)
                                    setTrainingStage(MechAbilityStages.MoveActionMA)
                                    setPlayerAbility(undefined)
                                }}
                                sx={{
                                    zIndex: 9,
                                    borderRadius: "50%",
                                    animation: trainingStage === MechAbilityStages.MoveMA ? `${pulseEffect} 2s infinite` : "unset",
                                }}
                                sizeGrid={1.2}
                                icon={
                                    <SvgDrag
                                        size="3rem"
                                        sx={{ pb: 0 }}
                                        fill={trainingStage === MechAbilityStages.MoveActionMA ? theme.factionTheme.primary : colors.lightGrey}
                                    />
                                }
                            />
                        )
                    })}
            </>
        )
    }, [mechMoveCommands, setIsTargeting, setPlayerAbility, setTrainingStage, theme.factionTheme.primary, trainingStage])
}
