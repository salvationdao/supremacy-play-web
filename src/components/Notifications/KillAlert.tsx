import { Box } from "@mui/material"
import { StyledImageText, StyledNormalText } from ".."
import { WarMachineState } from "../../types"

interface KillAlertProps {
    destroyedWarMachine: WarMachineState
    killedByWarMachine?: WarMachineState
    killedBy?: string
}

export const KillAlert = ({ data }: { data: KillAlertProps }) => {
    const { destroyedWarMachine, killedByWarMachine, killedBy } = data

    return (
        <Box>
            <StyledImageText
                text={killedByWarMachine ? killedByWarMachine.name : killedBy || "UNKNOWN"}
                color={killedByWarMachine ? killedByWarMachine.faction.theme.primary : "grey !important"}
                imageUrl={killedByWarMachine ? killedByWarMachine.imageUrl : ""}
            />
            <StyledNormalText text=" DESTROYED " />
            <StyledImageText
                text={destroyedWarMachine.name}
                color={destroyedWarMachine.faction.theme.primary}
                imageUrl={destroyedWarMachine.imageUrl}
            />
        </Box>
    )
}
